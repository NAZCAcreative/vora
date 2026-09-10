'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleAuthButton } from '@/components/shared/GoogleAuthButton';
import { useAuthStore } from '@/stores/auth-store';
import type { LanguageLevel } from '@/types';

const KOREAN_LEVELS: { value: LanguageLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'elementary', label: 'Elementary' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'topik1', label: 'TOPIK I' },
  { value: 'topik2', label: 'TOPIK II' },
];

const NATIVE_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'other', label: 'Other' },
];

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  nativeLanguage: z.string().min(1, 'Please select your native language'),
  koreanLevel: z.enum(['beginner', 'elementary', 'intermediate', 'advanced', 'topik1', 'topik2']),
});
type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const [verificationSent, setVerificationSent] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const router = useRouter();
  const registerUser = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { koreanLevel: 'beginner', nativeLanguage: '' },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await registerUser(data);
      if (result === 'verify_email') setVerificationSent(true);
      else router.push('/student/home');
    } catch (err) {
      setError('root', {
        message: err instanceof Error ? err.message : 'Registration failed. Please try again.',
      });
    }
  };

  const fieldClass =
    'w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-base focus:border-primary focus:ring-1 focus:ring-primary';
  const labelClass = 'block text-sm font-medium text-on-surface-variant mb-2';
  const errorClass = 'mt-1 text-xs text-red-600';

  if (verificationSent) return <div role="status" className="space-y-4"><p>가입 이메일로 보낸 인증 링크를 확인한 후 로그인해주세요.</p><Link href="/login">로그인으로 이동</Link></div>;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <GoogleAuthButton onError={setGoogleError} />
      {googleError && <p role="alert" className="rounded-lg bg-error-container/20 px-4 py-3 text-sm text-error">{googleError}</p>}
      <p className="text-center text-sm text-on-surface-variant">또는 이메일로 가입</p>
      <div>
        <label htmlFor="name" className={labelClass}>Full Name</label>
        <input id="name" type="text" autoComplete="name" {...register('name')} className={fieldClass} />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" type="email" autoComplete="email" {...register('email')} className={fieldClass} />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>Password</label>
        <input id="password" type="password" autoComplete="new-password" {...register('password')} className={fieldClass} />
        {errors.password && <p className={errorClass}>{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="nativeLanguage" className={labelClass}>Native Language</label>
        <select id="nativeLanguage" {...register('nativeLanguage')} className={fieldClass}>
          <option value="">Select language...</option>
          {NATIVE_LANGUAGES.map((language) => (
            <option key={language.value} value={language.value}>{language.label}</option>
          ))}
        </select>
        {errors.nativeLanguage && <p className={errorClass}>{errors.nativeLanguage.message}</p>}
      </div>

      <div>
        <label htmlFor="koreanLevel" className={labelClass}>Korean Level</label>
        <select id="koreanLevel" {...register('koreanLevel')} className={fieldClass}>
          {KOREAN_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>{level.label}</option>
          ))}
        </select>
        {errors.koreanLevel && <p className={errorClass}>{errors.koreanLevel.message}</p>}
      </div>

      {errors.root && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {errors.root.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full min-h-12 rounded-xl bg-primary py-3 text-base font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-sm text-on-surface-variant">
        Already have an account?{' '}
        <Link href="/login" className="inline-flex min-h-11 items-center font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
