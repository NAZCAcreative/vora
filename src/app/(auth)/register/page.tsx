import type { Metadata } from 'next';
import { RegisterForm } from '@/components/features/auth/RegisterForm';

export const metadata: Metadata = { title: 'Create Account | GoSsaem' };

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md px-container-margin pt-8 pb-32">
      <h2 className="mb-6 text-headline-lg font-headline text-on-surface">Create Account</h2>
      <RegisterForm />
    </main>
  );
}
