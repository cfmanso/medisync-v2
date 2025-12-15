'use client';

import { useState } from 'react';
import { useUsers, useDeleteUser } from '@medisync/logic';
import { Button, Modal, useToast, Card } from '@medisync/ui';
import { UserForm } from './user-form';

interface UserListProps {
  role: 'DOCTOR' | 'PATIENT';
  title: string;
}

export function UserList({ role, title }: UserListProps) {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: response, isLoading } = useUsers(role, page, limit);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { success: toast, error: showError } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja remover ${name}?`)) {
      deleteUser(id, {
        onSuccess: () => toast('Usuário removido.'),
        onError: () => showError('Erro ao remover usuário.')
      });
    }
  };

  const handleEdit = (userId: string) => {
    setEditingUserId(userId);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingUserId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">
            {response?.meta.total || 0} registros encontrados
          </p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          + Novo {role === 'DOCTOR' ? 'Médico' : 'Paciente'}
        </Button>
      </div>

      <Card variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cadastro
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    Carregando dados...
                  </td>
                </tr>
              ) : response?.data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                response?.data.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mr-3">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(user.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id, user.name)}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        disabled={isDeleting}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé da Paginação */}
        {response && response.meta.total > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Página <span className="font-medium">{page}</span> de <span className="font-medium">{response.meta.lastPage}</span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Anterior
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={page === response.meta.lastPage}
                onClick={() => setPage(p => p + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modal Genérico (Serve para Criar e Editar) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUserId ? `Editar ${role === 'DOCTOR' ? 'Médico' : 'Paciente'}` : `Cadastrar ${role === 'DOCTOR' ? 'Médico' : 'Paciente'}`}
        size="md"
      >
        <UserForm 
          defaultRole={role}
          userId={editingUserId || undefined}
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}