'use client'

import { AppointmentList } from '@/modules/appointment/components/appointment-list';
import { NewAppointmentForm } from '@/modules/appointment/components/new-appointment-form';
import { Button, Modal } from '@medisync/ui';
import { useState } from 'react';

export default function AppointmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-500 mt-1">Gerencie seus agendamentos do dia.</p>
        </div>
        <Button variant="primary" size="lg" onClick={openModal}>
          + Novo Agendamento
        </Button>
      </div>

      <AppointmentList />

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title="Novo Agendamento"
        size="md"
      >
        <NewAppointmentForm 
          onSuccess={closeModal} 
          onCancel={closeModal} 
        />
      </Modal>
    </div>
  );
}