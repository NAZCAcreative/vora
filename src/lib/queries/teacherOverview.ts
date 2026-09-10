import { createClient } from '@/lib/supabase/client';

export type TeacherOverview = {
  name: string;
  avatarUrl: string | null;
  headline: string | null;
  isVerified: boolean;
  ratingAvg: number;
  ratingCount: number;
  publishedLessonCount: number;
  upcomingSessionCount: number;
  completedSessionCount: number;
  monthRevenue: number;
  totalRevenue: number;
};

export async function getTeacherOverview(teacherId: string): Promise<TeacherOverview> {
  const { data, error } = await createClient().rpc('my_teacher_overview');
  if (error) throw new Error(error.message);
  return data as TeacherOverview;
}
