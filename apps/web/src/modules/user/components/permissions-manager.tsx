'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePermissionsSchema, UserPublic, type UpdatePermissionsInput } from '@medisync/schema';
import { useUpdatePermissions } from '@medisync/logic';
import { Button, Modal, useToast, Card, CardBody, Alert } from '@medisync/ui';

interface PermissionsManagerProps {
  user: UserPublic;
  isOpen: boolean;
  onClose: () => void;
}

export function PermissionsManager({ user, isOpen, onClose }: PermissionsManagerProps) {
  const { mutate: savePermissions, isPending } = useUpdatePermissions();
  const { success: toast, error } = useToast();

  const existingPermissions = user.permissions 
    ? (typeof user.permissions === 'string' ? JSON.parse(user.permissions) : user.permissions) 
    : [];

  const { control, handleSubmit, register } = useForm<UpdatePermissionsInput>({
    resolver: zodResolver(updatePermissionsSchema),
    defaultValues: {
      permissions: existingPermissions,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'permissions',
  });

  const onSubmit = (data: UpdatePermissionsInput) => {
    savePermissions({ userId: user.id, data }, {
      onSuccess: () => {
        toast(`Permissões de ${user.name} atualizadas!`);
        onClose();
      },
      onError: () => error('Erro ao salvar permissões.'),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Permissões Extras: ${user.name}`} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <Alert variant="warning">
          <strong>Atenção:</strong> Estas regras se somam às regras padrão do sistema. 
          Adicionar uma regra aqui concede privilégios extras.
        </Alert>

        <div className="space-y-3 max-h-[400px] overflow-y-auto p-1">
          {fields.map((field, index) => (
            <Card key={field.id} variant="bordered">
              <CardBody className="p-4">
                <div className="flex gap-3 items-start">
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    {/* Seleção de Ação */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Ação</label>
                      <select 
                        {...register(`permissions.${index}.action`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="read">Ler (Read)</option>
                        <option value="create">Criar (Create)</option>
                        <option value="update">Editar (Update)</option>
                        <option value="delete">Deletar (Delete)</option>
                        <option value="manage">Gerenciar Tudo (Manage)</option>
                      </select>
                    </div>

                    {/* Seleção de Assunto */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Recurso</label>
                      <select 
                        {...register(`permissions.${index}.subject`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Appointment">Agendamentos</option>
                        <option value="MedicalRecord">Prontuários</option>
                        <option value="User">Usuários</option>
                        <option value="all">Tudo (Cuidado!)</option>
                      </select>
                    </div>
                  </div>

                  <Button 
                    type="button" 
                    variant="danger"
                    size="sm"
                    className="mt-5"
                    onClick={() => remove(index)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
          
          {fields.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              Nenhuma permissão extra definida. O usuário segue o padrão da Role.
            </p>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => append({ action: 'read', subject: 'Appointment' })}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Regra
          </Button>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="primary" isLoading={isPending}>Salvar Permissões</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}