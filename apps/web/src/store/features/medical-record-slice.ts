import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MedicalRecordState {
  drafts: Record<string, string>;
}

const initialState: MedicalRecordState = {
  drafts: {},
};

export const medicalRecordSlice = createSlice({
  name: 'medicalRecord',
  initialState,
  reducers: {
    setDraft: (state, action: PayloadAction<{ patientId: string; content: string }>) => {
      const { patientId, content } = action.payload;
      state.drafts[patientId] = content;
    },
    clearDraft: (state, action: PayloadAction<string>) => {
      const patientId = action.payload;
      delete state.drafts[patientId];
    },
  },
});

export const { setDraft, clearDraft } = medicalRecordSlice.actions;
export const medicalRecordReducer = medicalRecordSlice.reducer;
