'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Verificação simples de segurança no cliente
    // (TODO: Middleware)
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Fictícia (depois usamos componente UI) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600">MediSync</h2>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          <a href="/dashboard" className="block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
            Agendamentos
          </a>
          <a href="/pacientes" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            Pacientes
          </a>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}