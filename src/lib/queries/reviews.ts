import { createClient } from '@/lib/supabase/client';

export type WrittenReviewRow = {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherAvatarUrl: string | null;
  meta: string;
  stars: number;
  text: string;
};

export async function listMyWrittenReviews(studentId: string, page = 1): Promise<WrittenReviewRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('id, teacher_id, rating, text, created_at, profiles!teacher_id(name, avatar_url), lesson_sessions(title)')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false }).order('id', { ascending: false }).range((page - 1) * 20, page * 20 - 1);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const teacherProfile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const session = Array.isArray(row.lesson_sessions) ? row.lesson_sessions[0] : row.lesson_sessions;
    const dateLabel = new Date(row.created_at).toLocaleDateString('ko-KR');
    return {
      id: row.id,
      teacherId: row.teacher_id,
      teacherName: teacherProfile?.name ?? '선생님',
      teacherAvatarUrl: teacherProfile?.avatar_url ?? null,
      meta: session?.title ? `${dateLabel} • ${session.title}` : dateLabel,
      stars: row.rating,
      text: row.text ?? '',
    };
  });
}

export async function updateReviewText(reviewId: string, text: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('reviews').update({ text }).eq('id', reviewId);
  if (error) throw new Error(error.message);
}

export type PendingReviewTarget = {
  sessionId: string;
  teacherId: string;
  teacherName: string;
  teacherAvatarUrl: string | null;
  scheduledAt: string;
  sessionTitle: string;
};

export async function listPendingReviewTargets(studentId: string, page = 1): Promise<PendingReviewTarget[]> {
  const { data, error } = await createClient().rpc('my_pending_reviews', { p_page: page });
  if (error) throw new Error(error.message);
  return data as PendingReviewTarget[];
}

export type CreateReviewInput = {
  studentId: string;
  teacherId: string;
  sessionId: string;
  rating: number;
  text: string;
};

export async function createReview(input: CreateReviewInput): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('reviews').insert({
    student_id: input.studentId,
    teacher_id: input.teacherId,
    session_id: input.sessionId,
    rating: input.rating,
    text: input.text,
  });
  if (error) throw new Error(error.message);
}

export type TeacherReviewRow = {
  id: string;
  studentName: string;
  studentAvatarUrl: string | null;
  createdAt: string;
  rating: number;
  text: string;
  teacherReply: string | null;
};

export async function listTeacherReviews(teacherId: string, page = 1, sort = '최신순'): Promise<TeacherReviewRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, text, created_at, teacher_reply, profiles!student_id(name, avatar_url)')
    .eq('teacher_id', teacherId)
    .order(sort === '높은 평점순' ? 'rating' : sort === '미답변순' ? 'teacher_reply' : 'created_at', { ascending: sort === '미답변순', nullsFirst: true })
    .order('created_at', { ascending: false }).order('id', { ascending: false }).range((page - 1) * 20, page * 20 - 1);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const studentProfile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id,
      studentName: studentProfile?.name ?? '학생',
      studentAvatarUrl: studentProfile?.avatar_url ?? null,
      createdAt: row.created_at,
      rating: row.rating,
      text: row.text ?? '',
      teacherReply: row.teacher_reply,
    };
  });
}

export async function updateTeacherReply(reviewId: string, reply: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('reviews')
    .update({ teacher_reply: reply, teacher_reply_at: new Date().toISOString() })
    .eq('id', reviewId);
  if (error) throw new Error(error.message);
}
