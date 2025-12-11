'use client';

import { useState } from 'react';
import { useUsers, useDeleteUser } from '@medisync/logic';
import { Button, Card, CardBody, Modal, useToast } from '@medisync/ui';
import { UserForm } from './user-form';

interface UserListProps {
  role: 'DOCTOR' | 'PATIENT';
  title: string;
}

export function UserList({ role, title }: UserListProps) {
  const { data: users, isLoading } = useUsers(role);
  const { mutate: deleteUser } = useDeleteUser();
  const { success: toast, error: showError } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja remover ${name}?`)) {
      deleteUser(id, {
        onSuccess: () => toast('Usuário removido.'),
        onError: () => showError('Erro ao remover usuário.')
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Novo {role === 'DOCTOR' ? 'Médico' : 'Paciente'}
        </Button>
      </div>

      {isLoading ? (
        <p>Carregando...</p>
      ) : users?.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">Nenhum usuário encontrado.</div>
      ) : (
        <div className="grid gap-4">
          {users?.map((user) => (
            <Card key={user.id} variant="elevated">
              <CardBody className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex gap-2">
                   {/* Aqui entraria o botão de Editar no futuro */}
                   <Button size="sm" variant="outline" onClick={() => handleDelete(user.id, user.name)}>
                     Excluir
                   </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Cadastrar ${role === 'DOCTOR' ? 'Médico' : 'Paciente'}`}
        size="md"
      >
        <UserForm 
          defaultRole={role}
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}