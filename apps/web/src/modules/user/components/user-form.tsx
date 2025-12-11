'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUserSchema, type RegisterUserInput } from '@medisync/schema';
import { useCreateUser } from '@medisync/logic';
import { Button, Input, useToast } from '@medisync/ui'; 

interface UserFormProps {
  defaultRole: 'PATIENT' | 'DOCTOR';
  onSuccess: () => void;
  onCancel: () => void;
}

export function UserForm({ defaultRole, onSuccess, onCancel }: UserFormProps) {
  const { mutate: createUser, isPending } = useCreateUser();
  const { success: toast, error: showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: { 
      role: defaultRole
    }
  });

  function onSubmit(data: RegisterUserInput) {
    createUser(data, {
      onSuccess: () => {
        toast('Usuário criado com sucesso!');
        onSuccess();
      },
      onError: (err: { message: string }) => {
        showError('Erro ao criar', err.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      <div className="space-y-4">
        <Input
          label="Nome Completo"
          placeholder="Ex: João Silva"
          {...register('name')}
          error={errors.name?.message}
          disabled={isPending}
        />

        <Input
          label="Email"
          type="email"
          placeholder="email@exemplo.com"
          {...register('email')}
          error={errors.email?.message}
          disabled={isPending}
        />

        <Input
          label="Senha"
          type="password"
          placeholder="Mínimo 6 caracteres"
          {...register('password')}
          error={errors.password?.message}
          disabled={isPending}
        />
        
        <input type="hidden" {...register('role')} value={defaultRole} />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isPending} disabled={isPending}>
          Cadastrar {defaultRole === 'DOCTOR' ? 'Médico' : 'Paciente'}
        </Button>
      </div>
    </form>
  );
}