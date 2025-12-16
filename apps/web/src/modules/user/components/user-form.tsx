'use client';

import { useEffect, useMemo } from 'react';
import { FormProvider, useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  registerUserSchema, 
  updateUserSchema, 
  type RegisterUserInput,
  type UserPublic, 
  type UpdateUserInput,
  type UpdatePermissionsInput 
} from '@medisync/schema';
import { useCreateUser, useUpdateUser, useUpdatePermissions, useCurrentUser, useUser } from '@medisync/logic';
import { Button, Input, Select, useToast, Alert, Card, CardBody } from '@medisync/ui'; 
import { useQueryClient } from '@tanstack/react-query';

type UserFormData = (RegisterUserInput | UpdateUserInput) & {
  permissions?: UpdatePermissionsInput['permissions'];
};

interface UserFormProps {
  defaultRole: 'PATIENT' | 'DOCTOR';
  userId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const actionOptions = [
  { value: 'read', label: 'Ler (Read)' },
  { value: 'create', label: 'Criar (Create)' },
  { value: 'update', label: 'Editar (Update)' },
  { value: 'delete', label: 'Deletar (Delete)' },
  { value: 'manage', label: 'Gerenciar Tudo' },
];

const subjectOptions = [
  { value: 'Appointment', label: 'Agendamentos' },
  { value: 'MedicalRecord', label: 'Prontuários' },
  { value: 'User', label: 'Usuários' },
  { value: 'all', label: 'Tudo (⚠️)' },
];

export function UserForm({ defaultRole, userId, onSuccess, onCancel }: UserFormProps) {
  const queryClient = useQueryClient();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUser();
  const { mutate: updatePermissions, isPending: isUpdatingPermissions } = useUpdatePermissions();
  const { data: initialData, isLoading: isLoadingUser } = useUser(userId || '');
  const { success: toast, error: showError } = useToast();
  
  const { data: currentUser } = useCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';

  const isEditing = !!userId;
  const isPending = isCreating || isUpdatingUser || isUpdatingPermissions || isLoadingUser;

  const schema = useMemo(() => {
    return isEditing ? updateUserSchema : registerUserSchema;
  }, [isEditing]);

  const getDefaultValues = (data?: UserPublic | null, role?: 'PATIENT' | 'DOCTOR') => {
    if (data) {
      let existingPermissions = [];
      if (data.permissions) {
        try {
          existingPermissions = typeof data.permissions === 'string' 
            ? JSON.parse(data.permissions) 
            : data.permissions;
        } catch {
          existingPermissions = [];
        }
      }

      return {
        name: data.name,
        email: data.email,
        role: data.role,
        password: '',
        permissions: existingPermissions,
      };
    }
    return { 
      role: role, 
      name: '', 
      email: '', 
      password: '',
      permissions: [] 
    };
  };

  const defaultValues = useMemo(() => {
    return getDefaultValues(initialData, defaultRole);
  }, [initialData, defaultRole]);

  const form = useForm<UserFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues,
  });

  const { 
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'permissions',
  });

  useEffect(() => {
    if (initialData || !userId) {
      const newDefaults = getDefaultValues(initialData, defaultRole);
      form.reset(newDefaults);
    }
  }, [initialData, userId, defaultRole, form]);

  async function onSubmit(data: UserFormData) {
    try {
      if (isEditing && initialData) {
        const userPayload: UpdateUserInput = {};

        if (data.name !== initialData.name) userPayload.name = data.name;
        if (data.email !== initialData.email) userPayload.email = data.email;
        if (data.role !== initialData.role) userPayload.role = data.role;
        if (data.password && data.password.trim() !== "")
          userPayload.password = data.password;

        if (isAdmin && data.permissions) {
          userPayload.permissions = data.permissions;
        }

        if (Object.keys(userPayload).length === 0) {
          showError("Nenhuma alteração detectada.");
          return;
        }

        updateUser(
          { id: initialData.id, data: userPayload },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ["user", initialData.id],
              });
              queryClient.invalidateQueries({ queryKey: ["users"] });
              toast("Dados atualizados com sucesso!");
              onSuccess();
            },
            onError: (err: Error) => {
              showError("Erro ao atualizar", err.message);
            },
          }
        );
      } else {
        const payload: RegisterUserInput = {
          name: data.name || "",
          email: data.email || "",
          password: data.password || "",
          role: defaultRole,
        };

        createUser(payload, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast("Usuário criado!");
            onSuccess();
          },
          onError: (err: { message: string }) =>
            showError("Erro ao criar", err.message),
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Ocorreu um erro ao salvar.";
      showError(errorMessage);
    }
  }

  if (isEditing && isLoadingUser) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">Carregando dados do usuário...</p>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {isEditing && (
            <Alert variant="info" className="mb-4">
              Deixe a senha em branco para manter a atual.
            </Alert>
          )}

          <Input
            id="name"
            label="Nome Completo"
            placeholder="Ex: João Silva"
            {...register("name")}
            error={errors.name?.message}
            disabled={isPending}
          />

          <Input
            id="email"
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            disabled={isPending}
          />

          <Input
            id="password"
            label={isEditing ? "Nova Senha (Opcional)" : "Senha"}
            type="password"
            placeholder={isEditing ? "Manter senha atual" : "******"}
            {...register("password")}
            error={errors.password?.message}
            disabled={isPending}
          />

          <input type="hidden" {...register("role")} value={defaultRole} />
        </div>

        {isEditing && isAdmin && (
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Permissões Extras (ABAC)
            </h3>
            <Alert variant="warning" className="mb-4 text-xs">
              <strong>Cuidado:</strong> Adicionar regras aqui concede
              privilégios além do padrão da função {defaultRole}.
            </Alert>

            <div className="space-y-3 max-h-[300px] overflow-y-auto p-1 bg-gray-50 rounded-md border border-gray-200">
              {fields.map((field, index) => (
                <Card
                  key={field.id}
                  variant="bordered"
                  className="bg-white shadow-sm"
                >
                  <CardBody className="p-3">
                    <div className="flex gap-3 items-end">
                      <div className="grid grid-cols-2 gap-3 flex-1">
                        {/* Ação */}
                        <Select
                          label="Ação"
                          options={actionOptions}
                          {...register(`permissions.${index}.action`)}
                        />

                        {/* Recurso */}
                        <Select
                          label="Recurso"
                          options={subjectOptions}
                          {...register(`permissions.${index}.subject`)}
                        />
                      </div>

                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        className="h-[34px] w-[34px] p-0 flex items-center justify-center"
                        onClick={() => remove(index)}
                        title="Remover regra"
                      >
                        X
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}

              {fields.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4 italic">
                  Nenhuma permissão extra. Segue o padrão.
                </p>
              )}
            </div>

            <div className="mt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ action: "read", subject: "Appointment" })
                }
                className="w-full border-dashed"
              >
                + Adicionar Regra de Exceção
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
            disabled={isPending}
          >
            {isEditing ? "Salvar Tudo" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}