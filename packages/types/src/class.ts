import { z } from 'zod';

export const ClassSchema = z.object({
  id: z.string().cuid().describe('Unique class identifier'),
  courseId: z.string().cuid().describe('Course ID'),
  semester: z
    .string()
    .regex(/^\d{4}\.\d$/)
    .describe('Semester (e.g., 2024.1)'),
  code: z.string().min(1).describe('Class code (e.g., T01)'),
  instructorId: z.string().cuid().describe('Instructor user ID'),
  capacity: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional()
    .describe('Student capacity'),
  startDate: z
    .date()
    .or(z.string().datetime())
    .nullable()
    .optional()
    .describe('Start date'),
  endDate: z
    .date()
    .or(z.string().datetime())
    .nullable()
    .optional()
    .describe('End date'),
  createdAt: z.date().or(z.string().datetime()).describe('Creation timestamp'),
  updatedAt: z
    .date()
    .or(z.string().datetime())
    .describe('Last update timestamp'),
});

export type Class = z.infer<typeof ClassSchema>;

export const CreateClassSchema = ClassSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  instructorId: true,
});

export type CreateClass = z.infer<typeof CreateClassSchema>;

export const UpdateClassSchema = CreateClassSchema.partial();

export type UpdateClass = z.infer<typeof UpdateClassSchema>;
