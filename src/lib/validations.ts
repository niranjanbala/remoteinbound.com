import { z } from 'zod';

// Base validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const uuidSchema = z.string().uuid('Invalid UUID format');
export const urlSchema = z.string().url('Invalid URL format').optional();
export const phoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format').optional();

// User validation schemas
export const createUserSchema = z.object({
  email: emailSchema,
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name too long'),
  company: z.string().max(100, 'Company name too long').optional(),
  jobTitle: z.string().max(100, 'Job title too long').optional(),
  phone: phoneSchema,
});

export const updateUserSchema = z.object({
  email: emailSchema.optional(),
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name too long').optional(),
  company: z.string().max(100, 'Company name too long').optional(),
  jobTitle: z.string().max(100, 'Job title too long').optional(),
  phone: phoneSchema,
});

// Event validation schemas
export const organizerSchema = z.object({
  name: z.string().min(1, 'Organizer name is required').max(100, 'Organizer name too long'),
  email: emailSchema,
  avatar: urlSchema,
});

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  startDate: z.string().datetime('Invalid start date format'),
  endDate: z.string().datetime('Invalid end date format'),
  timezone: z.string().min(1, 'Timezone is required').max(50, 'Timezone too long'),
  status: z.enum(['upcoming', 'live', 'ended']).default('upcoming'),
  coverImage: urlSchema,
  maxAttendees: z.number().int().positive('Max attendees must be positive').optional(),
  currentAttendees: z.number().int().min(0, 'Current attendees cannot be negative').default(0),
  tags: z.array(z.string().max(50, 'Tag too long')).max(10, 'Too many tags').default([]),
  organizer: organizerSchema,
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export const updateEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long').optional(),
  startDate: z.string().datetime('Invalid start date format').optional(),
  endDate: z.string().datetime('Invalid end date format').optional(),
  timezone: z.string().min(1, 'Timezone is required').max(50, 'Timezone too long').optional(),
  status: z.enum(['upcoming', 'live', 'ended']).optional(),
  coverImage: urlSchema,
  maxAttendees: z.number().int().positive('Max attendees must be positive').optional(),
  currentAttendees: z.number().int().min(0, 'Current attendees cannot be negative').optional(),
  tags: z.array(z.string().max(50, 'Tag too long')).max(10, 'Too many tags').optional(),
  organizer: organizerSchema.optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) > new Date(data.startDate);
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

// Speaker validation schemas
export const socialLinksSchema = z.object({
  twitter: z.string().max(100, 'Twitter handle too long').optional(),
  linkedin: urlSchema,
  website: urlSchema,
});

export const createSpeakerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  company: z.string().min(1, 'Company is required').max(100, 'Company name too long'),
  bio: z.string().min(1, 'Bio is required').max(1000, 'Bio too long'),
  avatar: urlSchema,
  social: socialLinksSchema.optional(),
  sessions: z.array(z.string().max(200, 'Session title too long')).max(20, 'Too many sessions').default([]),
});

export const updateSpeakerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long').optional(),
  company: z.string().min(1, 'Company is required').max(100, 'Company name too long').optional(),
  bio: z.string().min(1, 'Bio is required').max(1000, 'Bio too long').optional(),
  avatar: urlSchema,
  social: socialLinksSchema.optional(),
  sessions: z.array(z.string().max(200, 'Session title too long')).max(20, 'Too many sessions').optional(),
});

// Registration validation schemas
export const createRegistrationSchema = z.object({
  userId: uuidSchema,
  eventId: uuidSchema,
  type: z.enum(['virtual', 'in_person']).default('virtual'),
});

export const cancelRegistrationSchema = z.object({
  userId: uuidSchema,
  eventId: uuidSchema,
});

// Query parameter validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const sortSchema = z.object({
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Common response schemas
export const errorResponseSchema = z.object({
  error: z.string(),
  details: z.record(z.string(), z.any()).optional(),
});

export const successResponseSchema = z.object({
  message: z.string(),
  data: z.any().optional(),
});

// Type exports for use in API routes
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type CreateSpeakerInput = z.infer<typeof createSpeakerSchema>;
export type UpdateSpeakerInput = z.infer<typeof updateSpeakerSchema>;
export type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>;
export type CancelRegistrationInput = z.infer<typeof cancelRegistrationSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SortInput = z.infer<typeof sortSchema>;