import { AuthService } from './auth.service';
import { errorResponse } from 'src/dto/api-response.dto';
import { Body, Controller, Get, Headers, Ip, Post, Version } from '@nestjs/common';
import * as AuthSchema from './schemas/auth.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @Version('1')
  async signup(@Body() userData: AuthSchema.signupInput, @Ip() ipAddress: string, @Headers('user-agent') userAgent: string = 'unknown') {
    return this.authService.signup(userData, ipAddress, userAgent);
  }

  @Post('signin')
  @Version('1')
  async signin(@Body() credentials: AuthSchema.signinInput, @Ip() ipAddress: string, @Headers('user-agent') userAgent: string = 'unknown') {
    return this.authService.signin(credentials, ipAddress, userAgent);
  }

  @Post('google')
  @Version('1')
  async googleAuth(@Body() googleAuthData: AuthSchema.googleAuthInput, @Ip() ipAddress: string, @Headers('user-agent') userAgent: string = 'unknown') {
    return this.authService.googleAuth(googleAuthData, ipAddress, userAgent);
  };

  @Post('signout')
  @Version('1')
  async signout(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      return errorResponse('Authorization header is missing', 401);
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return errorResponse('Invalid authorization format', 401);
    }
    return this.authService.signout(token);
  }

  @Post('generate-signup-otp')
  @Version('1')
  async generateSignupOtp(@Body() generateOtpData: AuthSchema.generateOtpInput) {
    return this.authService.generateSignupOtp(generateOtpData);
  };

  @Post('check-email-exists')
  @Version('1')
  async checkEmailExists(@Body() checkEmailExistsData: AuthSchema.checkEmailExistsInput) {
    return this.authService.checkEmailExists(checkEmailExistsData);
  };

  @Post('verify-otp')
  @Version('1')
  async verifyOtp(@Body() verifyOtpData: AuthSchema.verifyOtpInput) {
    return this.authService.verifyOtp(verifyOtpData);
  };

  @Post('generate-forgot-password-otp')
  @Version('1')
  async generateForgotPasswordOtp(@Body() generateOtpData: AuthSchema.generateOtpInput) {
    return this.authService.generateForgotPasswordOtp(generateOtpData);
  };

  @Post('authenticate-token')
  @Version('1')
  async authenticateToken(@Body() authenticateTokenData: AuthSchema.autheticateTokenInput, @Headers('authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];
    return this.authService.authenticateToken(authenticateTokenData, token);
  };

  @Post('create-password')
  @Version('1')
  async createPassword(@Body() createPasswordData: AuthSchema.createPasswordInput) {
    return this.authService.createPassword(createPasswordData);
  };
}
