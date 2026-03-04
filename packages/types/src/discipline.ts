import { z } from 'zod';

export const DisciplineSchema = z.object({
  id: z.string().cuid().describe('Unique discipline identifier'),
  classId: z.string().cuid().describe('Class ID'),
  code: z.string().min(1).describe('Discipline code'),
  name: z.string().min(1).describe('Discipline name'),
  description: z
    .string()
    .nullable()
    .optional()
    .describe('Discipline description'),
  creditHours: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional()
    .describe('Credit hours'),
  instructorId: z.string().cuid().describe('Instructor user ID'),
  order: z.number().int().nullable().optional().describe('Display order'),
  createdAt: z.date().or(z.string().datetime()).describe('Creation timestamp'),
  updatedAt: z
    .date()
    .or(z.string().datetime())
    .describe('Last update timestamp'),
});

export type Discipline = z.infer<typeof DisciplineSchema>;

export const CreateDisciplineSchema = DisciplineSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  instructorId: true,
});

export type CreateDiscipline = z.infer<typeof CreateDisciplineSchema>;

export const UpdateDisciplineSchema = CreateDisciplineSchema.partial();

export type UpdateDiscipline = z.infer<typeof UpdateDisciplineSchema>;
