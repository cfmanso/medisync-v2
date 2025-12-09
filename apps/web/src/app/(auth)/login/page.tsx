import { LoginForm } from '@/modules/auth/components/login-form';
import { Card, CardBody } from '@medisync/ui';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg className="w-16 h-16 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5 0 1.93-1.57 3.5-3.5 3.5s-3.5-1.57-3.5-3.5c0-1.93 1.57-3.5 3.5-3.5zm7 13H5v-.23c0-.62.28-1.20.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">MediSync</h1>
          <p className="text-gray-600 mt-2">Prontuário Eletrônico Inteligente</p>
        </div>

        <Card variant="elevated" className="shadow-xl">
          <CardBody className="px-6 py-8 sm:px-10">
            <LoginForm />
          </CardBody>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 MediSync. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}