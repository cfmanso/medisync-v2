'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAppointmentSchema, type CreateAppointmentInput } from '@medisync/schema';
import { useCreateAppointment } from '@medisync/logic';
import { Button, Input, Alert, useToast } from '@medisync/ui'; 

interface NewAppointmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function NewAppointmentForm({ onSuccess, onCancel }: NewAppointmentFormProps) {
  const { mutate: createAppointment, isPending, error: apiError } = useCreateAppointment();
  const { success, error: showError } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAppointmentInput>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: { reason: '' }
  });

  function onSubmit(data: CreateAppointmentInput) {
    createAppointment(data, {
      onSuccess: () => {
        success('Agendamento criado com sucesso!', 'Sucesso');
        onSuccess();
      },
      onError: (err: Error) => {
        showError(
          err.message || 'Não foi possível criar o agendamento. Tente novamente.', 
          'Erro ao agendar'
        );
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full">
          <Input
            label="Data da Consulta"
            type="datetime-local"
            {...register('date')}
            error={errors.date?.message}
          />
        </div>

        <div className="w-full">
          <Input
            label="Motivo"
            placeholder="Ex: Check-up anual"
            {...register('reason')}
            error={errors.reason?.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full">
          <Input
            label="ID do Médico"
            placeholder="UUID do médico"
            {...register('doctorId')}
            error={errors.doctorId?.message}
          />
        </div>

        <div className="w-full">
          <Input
            label="ID do Paciente"
            placeholder="UUID do paciente"
            {...register('patientId')}
            error={errors.patientId?.message}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          variant="primary"
          isLoading={isPending}
        >
          Agendar Consulta
        </Button>
      </div>
    </form>
  );
}