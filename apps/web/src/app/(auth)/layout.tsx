import type { Metadata } from 'next';
import '../globals.css';
import '@medisync/ui/styles.css';

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
