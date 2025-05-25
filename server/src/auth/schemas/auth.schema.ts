import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200, 'Name cannot exceed 200 characters'),
  email: z.string().email('Invalid email format'),
  photo: z.string().optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  deviceType: z.number().int().min(1).max(3).optional(), // 1=web, 2=android, 3=ios
});

export const signinSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  deviceType: z.number().int().min(1).max(3).optional(), // 1=web, 2=android, 3=ios
});

export const googleAuthSchema = z.object({
  code: z.string().min(1, 'Google ID token is required'),
  deviceType: z.number().int().min(1).max(3).optional(), // 1=web, 2=android, 3=ios
});

export const generateOtpSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const checkEmailExistsSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.number(),
});

export const authenticateTokenSchema = z.object({
  userId: z.string().min(1, 'Invalid userId'),
});

export const createPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .optional(),
});

export type signupInput = z.infer<typeof signupSchema>;
export type signinInput = z.infer<typeof signinSchema>;
export type googleAuthInput = z.infer<typeof googleAuthSchema>;
export type generateOtpInput = z.infer<typeof generateOtpSchema>;
export type checkEmailExistsInput = z.infer<typeof checkEmailExistsSchema>;
export type verifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type autheticateTokenInput = z.infer<typeof authenticateTokenSchema>;
export type createPasswordInput = z.infer<typeof createPasswordSchema>;