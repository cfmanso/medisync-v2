'use client';

import { useState } from 'react';
import { Button, Input, Card, CardBody, Checkbox } from '@medisync/ui';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulando chamada à API
    setTimeout(() => {
      if (email === 'admin@medisync.com' && password === 'admin') {
        window.location.href = '/dashboard';
      } else {
        setError('Email ou senha inválidos');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg className="w-16 h-16 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5 0 1.93-1.57 3.5-3.5 3.5s-3.5-1.57-3.5-3.5c0-1.93 1.57-3.5 3.5-3.5zm7 13H5v-.23c0-.62.28-1.20.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">MediSync</h1>
          <p className="text-gray-600 mt-2">Agendamento de Consultas</p>
          <p className="text-sm text-gray-500 mt-1">Bem-vindo de volta! Por favor, faça seu login.</p>
        </div>

        {/* Card de Login */}
        <Card variant="elevated" className="shadow-xl">
          <CardBody className="px-6 py-4 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="w-full">
                <Input
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  }
                />
              </div>

              {/* Senha */}
              <div className="w-full">
                <Input
                  label="Senha"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                />
              </div>

              {/* Lembrar de mim e Esqueci senha */}
              <div className="flex items-center justify-between">
                <Checkbox
                  label="Lembrar de mim"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <a href="/esqueci-senha" className="text-sm text-primary-600 hover:text-primary-700">
                  Esqueci minha senha
                </a>
              </div>

              {/* Botão Entrar */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
              >
                Entrar
              </Button>

              {/* Criar conta */}
              <div className="mt-6 text-center text-sm text-gray-600">
                Não tem uma conta?{' '}
                <a href="/criar-conta" className="text-primary-600 hover:text-primary-700 font-medium">
                  Criar conta
                </a>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 MediSync. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}