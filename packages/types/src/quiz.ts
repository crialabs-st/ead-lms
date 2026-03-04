import { z } from 'zod';

export const QuizQuestionSchema = z.object({
  id: z.string().cuid().describe('Unique question identifier'),
  lessonId: z.string().cuid().describe('Lesson (quiz) ID'),
  text: z.string().min(1).describe('Question text'),
  options: z.array(z.string()).min(2).describe('Answer options'),
  correctOption: z.number().int().min(0).describe('Index of correct option'),
  points: z
    .number()
    .positive()
    .nullable()
    .optional()
    .describe('Points for this question'),
  order: z.number().int().nullable().optional().describe('Question order'),
  createdAt: z.date().or(z.string().datetime()).describe('Creation timestamp'),
  updatedAt: z
    .date()
    .or(z.string().datetime())
    .describe('Last update timestamp'),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const CreateQuizQuestionSchema = QuizQuestionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateQuizQuestion = z.infer<typeof CreateQuizQuestionSchema>;

export const QuizTakenSchema = z.object({
  id: z.string().cuid().describe('Unique quiz attempt identifier'),
  lessonId: z.string().cuid().describe('Lesson (quiz) ID'),
  userId: z.string().cuid().describe('Student user ID'),
  answers: z
    .record(z.string(), z.number())
    .describe('Student answers (questionId -> answerIndex)'),
  score: z.number().nonnegative().nullable().optional().describe('Final score'),
  takenAt: z.date().or(z.string().datetime()).describe('When quiz was taken'),
  createdAt: z.date().or(z.string().datetime()).describe('Creation timestamp'),
  updatedAt: z
    .date()
    .or(z.string().datetime())
    .describe('Last update timestamp'),
});

export type QuizTaken = z.infer<typeof QuizTakenSchema>;

export const CreateQuizTakenSchema = QuizTakenSchema.omit({
  id: true,
  takenAt: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateQuizTaken = z.infer<typeof CreateQuizTakenSchema>;

export const LessonSubmissionSchema = z.object({
  id: z.string().cuid().describe('Unique submission identifier'),
  lessonId: z.string().cuid().describe('Lesson (activity) ID'),
  userId: z.string().cuid().describe('Student user ID'),
  content: z
    .string()
    .nullable()
    .optional()
    .describe('Submission content or file URL'),
  grade: z
    .number()
    .nonnegative()
    .nullable()
    .optional()
    .describe('Grade given by instructor'),
  feedback: z.string().nullable().optional().describe('Instructor feedback'),
  submittedAt: z.date().or(z.string().datetime()).describe('When submitted'),
  createdAt: z.date().or(z.string().datetime()).describe('Creation timestamp'),
  updatedAt: z
    .date()
    .or(z.string().datetime())
    .describe('Last update timestamp'),
});

export type LessonSubmission = z.infer<typeof LessonSubmissionSchema>;

export const CreateLessonSubmissionSchema = LessonSubmissionSchema.omit({
  id: true,
  submittedAt: true,
  createdAt: true,
  updatedAt: true,
  grade: true,
  feedback: true,
});

export type CreateLessonSubmission = z.infer<
  typeof CreateLessonSubmissionSchema
>;

export const UpdateLessonSubmissionSchema = LessonSubmissionSchema.omit({
  id: true,
  submittedAt: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export type UpdateLessonSubmission = z.infer<
  typeof UpdateLessonSubmissionSchema
>;
