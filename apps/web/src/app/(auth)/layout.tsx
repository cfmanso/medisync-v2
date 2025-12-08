import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - MediSync',
  description: 'Sistema de agendamento médico',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
