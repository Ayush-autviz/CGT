import { z } from 'zod';

// Login form validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
});

// Sign-up form validation schema
export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .min(2, { message: 'Name must be at least 2 characters long' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

// Forgot password form validation schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
});

// Reset password form validation schema
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'Confirm password is required' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Create session form validation schema
export const createSessionSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Session title is required' })
    .max(100, { message: 'Session title must be less than 100 characters' }),
});

// Chat message form validation schema
export const chatMessageSchema = z.object({
  content: z
    .string()
    .max(5000, { message: 'Message must be less than 5000 characters' }),
  // Optional file validation could be added here
});

// Book coach form validation schema
export const bookCoachSchema = z.object({
  coachId: z.string().min(1, { message: 'Please select a coach' }),
  date: z.string().min(1, { message: 'Please select a date' }),
  timeSlot: z.string().min(1, { message: 'Please select a time slot' }),
  duration: z.string().min(1, { message: 'Please select a duration' }),
});

// Export types for each schema
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type CreateSessionFormData = z.infer<typeof createSessionSchema>;
export type ChatMessageFormData = z.infer<typeof chatMessageSchema>;
export type BookCoachFormData = z.infer<typeof bookCoachSchema>;
