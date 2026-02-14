import { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password - TodoApp',
  description: 'Set a new password for your TodoApp account',
};

interface ResetPasswordPageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResetPasswordPage({ 
  params,
  searchParams 
}: ResetPasswordPageProps) {
  const { token } = await params;
  
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Invalid Reset Link</h1>
          <p className="mt-2 text-muted-foreground">
            The password reset link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ResetPasswordForm token={token} />
    </div>
  );
}
