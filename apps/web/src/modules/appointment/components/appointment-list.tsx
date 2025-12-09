'use client';

import { useAppointments } from '@medisync/logic';
import { Card, CardBody, Button } from '@medisync/ui'; // Seus componentes!

export function AppointmentList() {
  const { data: appointments, isLoading, error } = useAppointments();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Erro ao carregar agendamentos.</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    );
  }

  if (!appointments?.length) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-500 mb-4">Nenhum agendamento encontrado.</p>
        <Button variant="primary">Novo Agendamento</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {appointments.map((appt) => (
        <Card key={appt.id} variant="elevated" className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardBody className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  {new Date(appt.date).toLocaleDateString('pt-BR')}
                </p>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  {new Date(appt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </h3>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                appt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {appt.status}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {appt.patient.name}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                 <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Dr. {appt.doctor.name}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
               <Button size="sm" variant="outline">Ver Detalhes</Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}