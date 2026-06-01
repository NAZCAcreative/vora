'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
      await registerUser(data);
      router.push('/homeT');
    } catch (err) {
      setError('root', {
        message: err instanceof Error ? err.message : 'Registration failed. Please try again.',
      });
    }
  };

  const fieldClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-korean-red focus:outline-none focus:ring-1 focus:ring-korean-red';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const errorClass = 'mt-1 text-xs text-red-600';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
        className="w-full rounded-lg bg-korean-red py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/homeT" className="font-medium text-korean-red hover:underline">
          Go to dashboard
        </Link>
      </p>
    </form>
  );
}
