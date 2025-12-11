'use client';

import { useParams } from 'next/navigation';
import { useUser, usePatientRecords } from '@medisync/logic';
import { Card, CardBody, Button, Alert, useToast } from '@medisync/ui';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { clearDraft, setDraft } from '@/store/features/medical-record-slice';
import { useCreateMedicalRecord } from '@medisync/logic';

export default function PatientPage() {
  const params = useParams();
  const patientId = params.id as string;
  const { success: toast, error: showError} = useToast();

  const { data: patient, isLoading: loadingPatient } = useUser(patientId);
  const { data: records, isLoading: loadingRecords } = usePatientRecords(patientId);

  const { mutate: saveRecord, isPending: isSaving } = useCreateMedicalRecord();
  const dispatch = useDispatch();

  const draftContent = useSelector((state: RootState) => 
    state.medicalRecord.drafts[patientId] || ''
  );

  const handleType = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setDraft({ 
      patientId, 
      content: e.target.value 
    }));
  };

  const handleSave = () => {
    if (!draftContent.trim()) {
      showError('Prontuário vazio', 'Escreva algo antes de salvar.');
      return;
    }

    saveRecord({
      patientId,
      description: draftContent,
    }, {
      onSuccess: () => {
        toast('Atendimento Finalizado', 'Histórico atualizado com sucesso.');
        dispatch(clearDraft(patientId));
      },
      onError: (err: { message: string }) => {
        toast('Erro ao salvar', err.message);
      }
    });
  };
  
  if (loadingPatient) return <div className="p-8 text-center">Carregando paciente...</div>;

  if (!patient) return (
    <div className="p-8">
      <Alert variant="danger">Paciente não encontrado.</Alert>
      <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>Voltar</Button>
    </div>
  );

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6">
      
      <div className="w-full md:w-1/3 flex flex-col gap-6 overflow-y-auto pr-2">
        
        <Card variant="elevated">
          <CardBody className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                {patient.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
                <p className="text-sm text-gray-500">{patient.email}</p>
              </div>
            </div>
            <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block font-semibold">
              PACIENTE
            </div>
          </CardBody>
        </Card>

        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Histórico Clínico
          </h3>
          
          {loadingRecords ? (
            <p className="text-gray-400 text-sm">Carregando histórico...</p>
          ) : records?.length === 0 ? (
            <p className="text-gray-400 text-sm italic">Nenhum registro anterior.</p>
          ) : (
            <div className="space-y-4">
              {records?.map((rec) => (
                <Card key={rec.date.toISOString()} className="border-l-4 border-l-gray-400">
                  <CardBody className="p-4">
                    <p className="text-xs text-gray-500 font-medium mb-2">
                      {new Date(rec.date).toLocaleDateString('pt-BR')} às {new Date(rec.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit'})}
                    </p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {rec.description}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full md:w-2/3 flex flex-col">
        <Card variant="elevated" className="flex-1 flex flex-col shadow-lg border-blue-100">
          <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Atendimento Atual</h3>
            {draftContent && (
              <span className="text-xs text-green-600 font-medium flex items-center animate-pulse">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Rascunho salvo
              </span>
            )}
          </div>
          
          <div className="flex-1 p-6 flex flex-col">
            <textarea 
              className="flex-1 w-full p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 leading-relaxed text-lg"
              placeholder="Descreva a evolução do paciente..."
              value={draftContent}
              onChange={handleType}
            />
            
            <div className="mt-6 flex justify-end gap-3">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleSave}
                isLoading={isSaving}
                disabled={isSaving}
                >
                {isSaving ? 'Salvando...' : 'Finalizar Atendimento'}
            </Button>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}