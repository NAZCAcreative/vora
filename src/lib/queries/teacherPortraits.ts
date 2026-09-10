import { createClient } from '@/lib/supabase/client';

const PORTRAIT_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export async function uploadTeacherPortrait(profileId: string, file: File): Promise<string> {
  const extension = PORTRAIT_TYPES[file.type];
  if (!extension) throw new Error('JPG, PNG, WebP 이미지를 선택해주세요.');
  if (!file.size || file.size > 5 * 1024 * 1024) throw new Error('사진은 5MB 이하로 선택해주세요.');

  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.id !== profileId) throw new Error('로그인 후 본인의 사진을 변경해주세요.');

  const path = `${profileId}/${crypto.randomUUID()}.${extension}`;
  const storage = supabase.storage.from('teacher-portraits');
  const { error: uploadError } = await storage.upload(path, file, { contentType: file.type, cacheControl: '31536000' });
  if (uploadError) throw new Error('사진 업로드에 실패했습니다. 다시 시도해주세요.');
  const { data: { publicUrl } } = storage.getPublicUrl(path);
  const { error: updateError } = await supabase.from('profiles')
    .update({ avatar_url: publicUrl, avatar_is_generated: false })
    .eq('id', profileId).select('id').single();
  if (updateError) {
    await storage.remove([path]);
    throw new Error('사진 정보를 저장하지 못했습니다. 다시 시도해주세요.');
  }
  return publicUrl;
}
