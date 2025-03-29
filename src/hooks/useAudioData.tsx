
import { create } from 'zustand';

interface AudioDataStore {
  audioData: Uint8Array | null;
  setAudioData: (data: Uint8Array) => void;
}

const useAudioDataStore = create<AudioDataStore>((set) => ({
  audioData: null,
  setAudioData: (data) => set({ audioData: data }),
}));

export const useAudioData = () => {
  const { audioData, setAudioData } = useAudioDataStore();
  return { audioData, setAudioData };
};
