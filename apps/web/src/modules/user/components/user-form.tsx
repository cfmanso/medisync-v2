'use client';

import { useEffect, useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUserSchema, updateUserSchema, type RegisterUserInput,type UserPublic, type UpdateUserInput } from '@medisync/schema';
import { useCreateUser, useUpdateUser} from '@medisync/logic';
import { Button, Input, useToast, Alert } from '@medisync/ui'; 

interface UserFormProps {
  defaultRole: 'PATIENT' | 'DOCTOR';
  initialData?: UserPublic | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UserForm({ defaultRole, initialData, onSuccess, onCancel }: UserFormProps) {
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { success: toast, error: showError } = useToast();
  
  const isEditing = !!initialData;
  const isPending = isCreating || isUpdating;
  const schema = useMemo(() => {
    return isEditing ? updateUserSchema : registerUserSchema;
  }, [isEditing]);
  
  const form = useForm<RegisterUserInput | UpdateUserInput>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const { 
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = form;

  const name = useWatch({ control: form.control, name: 'name' })

  useEffect(() => {
    console.warn('name', name);
  }, [name])
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        password: '',
      });
    } else {
      reset({ role: defaultRole, name: '', email: '', password: '' });
    }
  }, [initialData, reset, defaultRole]);

  function onSubmit(data: RegisterUserInput | UpdateUserInput) {
    if (isEditing && initialData) {
      const payload: UpdateUserInput = {};
      console.warn('data', data, initialData)
      if (data.name && data.name !== initialData.name) {
        payload.name = data.name;
      }
      
      if (data.email && data.email !== initialData.email) {
        payload.email = data.email;
      }
      
      if (data.role && data.role !== initialData.role) {
        payload.role = data.role;
      }
      
      if (data.password && data.password.trim() !== '') {
        payload.password = data.password;
      }

      if (Object.keys(payload).length === 0) {
        showError('Nenhuma alteração foi feita');
        return;
      }

      console.warn(payload)
      updateUser({ id: initialData.id, data: payload }, {
        onSuccess: () => {
          toast('Usuário atualizado!');
          onSuccess();
        },
        onError: (err: { message: string }) => showError('Erro ao atualizar', err.message)
      });
    } else {
      const payload: RegisterUserInput = {
        name: data.name || '',
        email: data.email || '',
        password: data.password || '',
        role: defaultRole,
      };

      createUser(payload, {
        onSuccess: () => {
          toast('Usuário criado!');
          onSuccess();
        },
        onError: (err: { message: string }) => showError('Erro ao criar', err.message)
      });
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {isEditing && (
          <Alert variant="info" className="mb-4">
            Deixe a senha em branco para manter a atual.
          </Alert>
        )}

        <div className="space-y-4">
          <Input
            id="name"
            label="Nome Completo"
            placeholder="Ex: João Silva"
            {...register('name')}
            error={errors.name?.message}
            disabled={isPending}
          />

          <Input
            id="email"
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            disabled={isPending}
          />

          <Input
            id="password"
            label={isEditing ? "Nova Senha (Opcional)" : "Senha"}
            type="password"
            placeholder={isEditing ? "Manter senha atual" : "******"}
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
            {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </FormProvider>

  );
}