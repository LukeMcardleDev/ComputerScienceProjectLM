import { create } from 'zustand';

type UiMode = 'default' | 'devices' | 'fundamentals' | 'test';

type AppState = {
  uiMode: UiMode;
  setUiMode: (mode: UiMode) => void;

  deviceSearchQuery: string;
  setDeviceSearchQuery: (query: string) => void;

  fundSearchQuery: string;
  setFundSearchQuery: (query: string) => void;

  activeDeviceTab: string;
  setActiveDeviceTab: (tab: string) => void;

  testNetwork: {
    name: string;
    router: string;
    switches: string[];
  };
  setTestNetworkName: (name: string) => void;
  setTestNetworkRouter: (router: string) => void;
  setTestNetworkSwitches: (switches: string[]) => void;
  clearTestNetwork: () => void;
};

const useAppStore = create<AppState>((set) => ({
  uiMode: 'default',
  setUiMode: (mode) => set({ uiMode: mode }),

  deviceSearchQuery: '',
  setDeviceSearchQuery: (query) => set({ deviceSearchQuery: query }),

  fundSearchQuery: '',
  setFundSearchQuery: (query) => set({ fundSearchQuery: query }),

  activeDeviceTab: 'routers',
  setActiveDeviceTab: (tab) => set({ activeDeviceTab: tab }),

  testNetwork: {
    name: '',
    router: '',
    switches: [],
  },
  setTestNetworkName: (name) => set((state) => ({
    testNetwork: { ...state.testNetwork, name }
  })),
  setTestNetworkRouter: (router) => set((state) => ({
    testNetwork: { ...state.testNetwork, router }
  })),
  setTestNetworkSwitches: (switches) => set((state) => ({
    testNetwork: { ...state.testNetwork, switches }
  })),
  clearTestNetwork: () => set({
    testNetwork: { name: '', router: '', switches: [] }
  }),
}));

export default useAppStore;
