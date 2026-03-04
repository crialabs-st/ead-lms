import { z } from 'zod';

export const CourseSchema = z.object({
  id: z.string().cuid().describe('Unique course identifier'),
  code: z.string().min(1).describe('Course code (unique)'),
  name: z.string().min(1).describe('Course name'),
  description: z.string().nullable().optional().describe('Course description'),
  image: z.string().url().nullable().optional().describe('Course image URL'),
  adminId: z.string().cuid().describe('Administrator user ID'),
  createdAt: z.date().or(z.string().datetime()).describe('Creation timestamp'),
  updatedAt: z
    .date()
    .or(z.string().datetime())
    .describe('Last update timestamp'),
});

export type Course = z.infer<typeof CourseSchema>;

export const CreateCourseSchema = CourseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  adminId: true,
});

export type CreateCourse = z.infer<typeof CreateCourseSchema>;

export const UpdateCourseSchema = CreateCourseSchema.partial();

export type UpdateCourse = z.infer<typeof UpdateCourseSchema>;
