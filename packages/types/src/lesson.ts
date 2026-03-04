import { z } from 'zod';

export enum LessonType {
  VIDEO = 'VIDEO',
  QUIZ = 'QUIZ',
  TEXT = 'TEXT',
  FILE = 'FILE',
  ACTIVITY = 'ACTIVITY',
  FORUM = 'FORUM',
  LIVE = 'LIVE',
}

export const LessonTypeSchema = z.enum([
  'VIDEO',
  'QUIZ',
  'TEXT',
  'FILE',
  'ACTIVITY',
  'FORUM',
  'LIVE',
]);

// Content schemas based on type
export const VideoContentSchema = z.object({
  videoUrl: z.string().url().describe('Video URL'),
  duration: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional()
    .describe('Duration in seconds'),
  transcript: z.string().nullable().optional().describe('Video transcript'),
});

export const TextContentSchema = z.object({
  htmlContent: z.string().describe('HTML content'),
});

export const FileContentSchema = z.object({
  fileUrl: z.string().url().describe('File URL'),
  mimeType: z.string().describe('MIME type'),
});

export const ActivityContentSchema = z.object({
  instructions: z.string().describe('Activity instructions'),
  allowedFormats: z
    .array(z.string())
    .optional()
    .describe('Allowed file formats'),
  maxSubmissions: z.number().int().positive().default(1),
});

export const LessonSchema = z.object({
  id: z.string().cuid().describe('Unique lesson identifier'),
  disciplineId: z.string().cuid().describe('Discipline ID'),
  type: LessonTypeSchema.describe('Lesson type'),
  title: z.string().min(1).describe('Lesson title'),
  description: z.string().nullable().optional().describe('Lesson description'),
  content: z
    .record(z.string(), z.unknown())
    .nullable()
    .optional()
    .describe('Type-specific content'),
  order: z.number().int().nullable().optional().describe('Display order'),
  publishedAt: z
    .date()
    .or(z.string().datetime())
    .nullable()
    .optional()
    .describe('Publication date'),
  dueDate: z
    .date()
    .or(z.string().datetime())
    .nullable()
    .optional()
    .describe('Due date for activities'),
  points: z
    .number()
    .positive()
    .nullable()
    .optional()
    .describe('Points/grade for assessment'),
  createdAt: z.date().or(z.string().datetime()).describe('Creation timestamp'),
  updatedAt: z
    .date()
    .or(z.string().datetime())
    .describe('Last update timestamp'),
});

export type Lesson = z.infer<typeof LessonSchema>;

export const CreateLessonSchema = LessonSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateLesson = z.infer<typeof CreateLessonSchema>;

export const UpdateLessonSchema = CreateLessonSchema.partial();

export type UpdateLesson = z.infer<typeof UpdateLessonSchema>;
