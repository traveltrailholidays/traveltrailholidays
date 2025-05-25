import * as bcrypt from 'bcryptjs';

import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { apiResponse, errorResponse } from '../dto/api-response.dto';
import { signupOtpTemplate } from 'src/mail/templates/signup-otp.template';
import * as AuthSchema from './schemas/auth.schema';
import { forgotPasswordOtpTemplate } from 'src/mail/templates/forgot-password-otp.template';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailer: MailService,
  ) {
    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'postmessage'
    );
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  };

  private async generateToken(userId: string, ipAddress: string, userAgent: string) {
    const payload = {
      sub: userId
    };
    const accessToken = this.jwtService.sign(payload);
    const validTo = new Date();
    validTo.setDate(validTo.getDate() + 7);
    await this.prisma.session.deleteMany({
      where: { userId },
    });
    await this.prisma.session.create({
      data: {
        userId,
        userAgent,
        ipAddress,
        token: accessToken,
        validTo,
      },
    });
    return {
      accessToken
    };
  };

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async signup(userData: AuthSchema.signupInput, ipAddress: string, userAgent: string) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: userData.email,
        },
      });
      if (existingUser) {
        return errorResponse('User with this email already exists', 409);
      }
      if (!userData.password) {
        return errorResponse('Password is required', 400);
      };
      const hashedPassword = await this.hashPassword(userData.password);
      const user = await this.prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          photo: userData.photo || null,
          password: hashedPassword,
          phone: userData.phone || null,
          address: userData.address || null,
          accountType: 1, // normal account
          deviceType: userData.deviceType || 1, // default to web
          role: 1, // default user role
          isVerified: 0, // unverified by default
          status: 1, // active by default
        },
      });
      const { password, createdAt, updatedAt, ...safeUser } = user;
      const { accessToken } = await this.generateToken(user.id, ipAddress, userAgent);
      const responsePayload = {
        ...safeUser,
        token: accessToken
      };
      return apiResponse({ payload: responsePayload, code: 201 });
    } catch (error) {
      return errorResponse(error.message);
    }
  }

  async signin(credentials: AuthSchema.signinInput, ipAddress: string, userAgent: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: credentials.email,
        },
      });
      if (!user) {
        return errorResponse('Invalid email', 401);
      }
      if (!user.password) {
        return errorResponse('Invalid password', 401);
      }
      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      if (!isPasswordValid) {
        return errorResponse('Invalid password', 401);
      }
      const { accessToken } = await this.generateToken(user.id, ipAddress, userAgent);
      const { password, createdAt, updatedAt, ...safeUser } = user;
      const responsePayload = {
        ...safeUser,
        token: accessToken
      };
      return apiResponse({ payload: responsePayload });
    } catch (error) {
      return errorResponse(error.message);
    }
  };

  async googleAuth(input: AuthSchema.googleAuthInput, ipAddress: string, userAgent: string) {
    try {
      if (!input.code) {
        return errorResponse('Authorization code is required', 400);
      }
      const { tokens } = await this.googleClient.getToken(input.code);
      if (!tokens.id_token) {
        return errorResponse('Failed to get ID token from Google', 401);
      }
      const ticket = await this.googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return errorResponse('Invalid Google token', 401);
      }
      let user = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });
      if (user) {
        if (user.accountType === 1 && user.password) {
          user = await this.prisma.user.update({
            where: { id: user.id },
            data: {
              accountType: 2, // Both normal and Google
              photo: user.photo || payload.picture,
            },
          });
        };
        const { accessToken } = await this.generateToken(user.id, ipAddress, userAgent);
        const { password, createdAt, updatedAt, ...safeUser } = user;
        const responsePayload = {
          ...safeUser,
          token: accessToken
        };
        return apiResponse({ payload: responsePayload });
      };
      user = await this.prisma.user.create({
        data: {
          name: payload.name || 'Google User',
          email: payload.email,
          photo: payload.picture,
          password: null,
          accountType: 2,
          deviceType: input.deviceType || 1,
          status: 1,
        },
      });
      const { accessToken } = await this.generateToken(user.id, ipAddress, userAgent);
      const { password, createdAt, updatedAt, ...safeUser } = user;
      const responsePayload = {
        ...safeUser,
        token: accessToken
      };
      return apiResponse({ payload: responsePayload });
    } catch (error) {
      return errorResponse(error.message);
    }
  };

  async signout(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token);
      const userId = decodedToken.sub;
      if (!userId) {
        return errorResponse('Invalid token format', 401);
      }
      const userTokensCount = await this.prisma.session.count({
        where: { userId }
      });
      if (userTokensCount === 0) {
        return errorResponse('Already signed out', 401);
      }
      await this.prisma.session.deleteMany({
        where: { userId },
      });
      return apiResponse({
        message: 'Successfully signed out',
        payload: {}
      });
    } catch (error) {
      return errorResponse(error.message);
    }
  };

  async generateSignupOtp(generateOtpData: AuthSchema.generateOtpInput) {
    try {
      const mailOtp = this.generateOtp();
      const validTo = new Date(Date.now() + 10 * 60 * 1000);
      await this.prisma.otp.deleteMany({
        where: { email: generateOtpData.email },
      });
      await this.prisma.otp.create({
        data: {
          email: generateOtpData.email,
          code: Number(mailOtp),
          validTo,
        },
      });
      const mailResponse = await this.mailer.sendMail({
        to: generateOtpData.email,
        subject: 'Complete Your Signup – Travel Trail Holidays',
        html: signupOtpTemplate(mailOtp)
      });
      if (mailResponse.code !== 200) {
        return errorResponse(mailResponse.message);
      }
      return apiResponse({ message: 'Mail sent successfully' })
    } catch (error) {
      return errorResponse(error.message);
    }
  };

  async checkEmailExists(checkEmailExistsData: AuthSchema.checkEmailExistsInput) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: checkEmailExistsData.email },
      });
      if (!user) {
        return errorResponse('Email does not exist', 404);
      }
      return apiResponse({ message: "Email already exists" });
    } catch (error) {
      return errorResponse(error.message);
    }
  };

  async verifyOtp(verifyOtpData: AuthSchema.verifyOtpInput) {
    try {
      const isOtp = await this.prisma.otp.findUnique({
        where: { email: verifyOtpData.email },
      });
      if (!isOtp) {
        return errorResponse("OTP not found or already expired");
      }
      const currentTime = new Date();
      if (currentTime > isOtp.validTo) {
        await this.prisma.otp.deleteMany({
          where: { email: verifyOtpData.email },
        });
        return errorResponse("OTP has expired");
      }
      if (isOtp.code !== Number(verifyOtpData.otp)) {
        return errorResponse("Invalid OTP");
      }
      await this.prisma.otp.deleteMany({
        where: { email: verifyOtpData.email },
      });
      return apiResponse({ message: "OTP verified successfully." });
    } catch (error) {
      return errorResponse(error.message);
    }
  };

  async generateForgotPasswordOtp(generateOtpData: AuthSchema.generateOtpInput) {
    try {
      const mailOtp = this.generateOtp();
      const validTo = new Date(Date.now() + 10 * 60 * 1000);
      await this.prisma.otp.deleteMany({
        where: { email: generateOtpData.email },
      });
      await this.prisma.otp.create({
        data: {
          email: generateOtpData.email,
          code: Number(mailOtp),
          validTo,
        },
      });
      const mailResponse = await this.mailer.sendMail({
        to: generateOtpData.email,
        subject: 'Reset Your Password – Travel Trail Holidays',
        html: forgotPasswordOtpTemplate(mailOtp)
      });
      if (mailResponse.code !== 200) {
        return errorResponse(mailResponse.message);
      }
      return apiResponse({ message: 'Mail sent successfully' })
    } catch (error) {
      return errorResponse(error.message);
    }
  };

  async authenticateToken(authenticateTokenData: AuthSchema.autheticateTokenInput, tokenFromRequest: string) {
    try {
      const isUser = await this.prisma.session.findUnique({
        where: { userId: authenticateTokenData.userId },
      });
      if (!isUser) {
        return errorResponse("Invalid session");
      }
      const currentTime = new Date();
      if (currentTime > isUser.validTo) {
        await this.prisma.session.deleteMany({
          where: { userId: authenticateTokenData.userId },
        });
        return errorResponse("Session expired");
      }
      if (tokenFromRequest !== isUser.token) {
        return errorResponse("Invalid token");
      }
      const responsePayload = {
        token: isUser.token
      };
      return apiResponse({ message: "Valid session", payload: responsePayload });
    } catch (error) {
      return errorResponse(error.message);
    }
  };

  async createPassword(createPasswordData: AuthSchema.createPasswordInput) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: createPasswordData.email },
      });
      if(!user) {
        return errorResponse("User not found", 404);
      };
      const password = createPasswordData.password!;
      const hashedPassword = await this.hashPassword(password);
      await this.prisma.user.update({
        where: { email: createPasswordData.email },
        data: {
          password: hashedPassword,
        },
      });
      return apiResponse({ message: 'Password has been set successfully' });
    } catch (error) {
      return errorResponse(error.message);
    }
  };
}
