import { AppointmentList } from '@/modules/appointment/components/appointment-list';
import { Button } from '@medisync/ui';

export default function AppointmentPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-500 mt-1">Gerencie seus agendamentos do dia.</p>
        </div>
        <Button variant="primary" size="lg">
          + Novo Agendamento
        </Button>
      </div>

      <AppointmentList />
    </div>
  );
}