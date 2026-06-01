import type { Metadata } from 'next';
import { RegisterForm } from '@/components/features/auth/RegisterForm';

export const metadata: Metadata = { title: 'Create Account | KoreaLingoBridge' };

export default function RegisterPage() {
  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Create Account</h2>
      <RegisterForm />
    </>
  );
}
