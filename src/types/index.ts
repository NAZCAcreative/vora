// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'teacher' | 'admin';
export type LanguageLevel = 'beginner' | 'elementary' | 'intermediate' | 'advanced' | 'topik1' | 'topik2';

export interface User {
  _id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  activeRole?: UserRole;
  nativeLanguage: string;   // e.g. "en", "ja", "zh"
  koreanLevel: LanguageLevel;
  createdAt: string;
  updatedAt: string;
}

// ─── Course ───────────────────────────────────────────────────────────────────

export type CourseCategory = 'grammar' | 'vocabulary' | 'conversation' | 'topik' | 'culture';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  teacherId: string;
  category: CourseCategory;
  level: DifficultyLevel;
  tags: string[];
  lessonCount: number;
  enrolledCount: number;
  rating: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Lesson ───────────────────────────────────────────────────────────────────

export type LessonType = 'video' | 'reading' | 'exercise' | 'quiz';

export interface Lesson {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  type: LessonType;
  order: number;
  durationMinutes: number;
  contentUrl?: string;
  script?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Vocabulary ───────────────────────────────────────────────────────────────

export interface VocabWord {
  _id: string;
  korean: string;
  pronunciation: string;    // romanization
  meaning: Record<string, string>;  // { en: '...', ja: '...', zh: '...' }
  exampleSentence: string;
  exampleTranslation: Record<string, string>;
  audioUrl?: string;
  tags: string[];
  level: DifficultyLevel;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface UserProgress {
  _id: string;
  userId: string;
  courseId: string;
  completedLessons: string[];
  lastLessonId?: string;
  progressPercent: number;
  startedAt: string;
  updatedAt: string;
}

// ─── Community ────────────────────────────────────────────────────────────────

export type PostCategory = 'question' | 'share' | 'correction' | 'culture';

export interface Post {
  _id: string;
  authorId: string;
  title: string;
  content: string;
  category: PostCategory;
  tags: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  postId: string;
  authorId: string;
  content: string;
  isTeacherReply: boolean;
  createdAt: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
