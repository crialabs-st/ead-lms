import { z } from 'zod';

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DROPPED = 'DROPPED',
}

export const EnrollmentStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'DROPPED']);

export const EnrollmentSchema = z.object({
  id: z.string().cuid().describe('Unique enrollment identifier'),
  classId: z.string().cuid().describe('Class ID'),
  userId: z.string().cuid().describe('User/Student ID'),
  status:
    EnrollmentStatusSchema.default('ACTIVE').describe('Enrollment status'),
  enrollmentDate: z
    .date()
    .or(z.string().datetime())
    .describe('Enrollment date'),
  createdAt: z.date().or(z.string().datetime()).describe('Creation timestamp'),
  updatedAt: z
    .date()
    .or(z.string().datetime())
    .describe('Last update timestamp'),
});

export type Enrollment = z.infer<typeof EnrollmentSchema>;

export const CreateEnrollmentSchema = EnrollmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  enrollmentDate: true,
});

export type CreateEnrollment = z.infer<typeof CreateEnrollmentSchema>;

export const UpdateEnrollmentSchema = CreateEnrollmentSchema.partial();

export type UpdateEnrollment = z.infer<typeof UpdateEnrollmentSchema>;
