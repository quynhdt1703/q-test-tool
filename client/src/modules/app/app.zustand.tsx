import { MappingAlgorithm, ThemeConfig, theme } from 'antd';
import { create } from 'zustand';

import { defaultTheme } from './default-theme';

export type TTheme = ThemeConfig & {
  algorithm: MappingAlgorithm[];
};

export type TAppState = {
  theme: TTheme;
  loading: boolean;
  connectedSocket: boolean;
};

type TAppActions = {
  setLoading: (loading: boolean) => void;
  setTheme: (theme: TTheme) => void;
  toggleTheme: () => void;
  setConnectedSocket: (connected: boolean) => void;
};

export const useAppStore = create<TAppState & TAppActions>((set) => ({
  theme: defaultTheme,
  loading: false,
  connectedSocket: false,

  setLoading: (loading) => set({ loading }),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({
      theme: {
        ...state.theme,
        algorithm: state.theme.algorithm.map((x) => {
          if (x === theme.defaultAlgorithm) {
            return theme.darkAlgorithm;
          } else if (x === theme.darkAlgorithm) {
            return theme.defaultAlgorithm;
          }
          return x;
        }),
      },
    })),
  setConnectedSocket: (connected) => set({ connectedSocket: connected }),
}));
