import { create } from 'zustand';

export type LessonDraftType = '1on1' | 'group' | 'live';

type LessonDraftFields = {
  title: string;
  level: string;
  category: string;
  price: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
};

type LessonDraftState = LessonDraftFields & {
  type: LessonDraftType | null;
  freeTrial: boolean;
  setType: (type: LessonDraftType) => void;
  setField: <K extends keyof LessonDraftFields>(key: K, value: LessonDraftFields[K]) => void;
  setFreeTrial: (value: boolean) => void;
  reset: () => void;
};

const initialFields: LessonDraftFields = {
  title: '',
  level: '초급',
  category: '회화',
  price: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
};

export const useLessonDraftStore = create<LessonDraftState>((set) => ({
  ...initialFields,
  type: null,
  freeTrial: false,
  setType: (type) => set({ type }),
  setField: (key, value) => set({ [key]: value } as Partial<LessonDraftState>),
  setFreeTrial: (freeTrial) => set({ freeTrial }),
  reset: () => set({ ...initialFields, type: null, freeTrial: false }),
}));
