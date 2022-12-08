/* eslint-disable import/prefer-default-export */
import type { RecoilState } from 'recoil';
import { atom } from 'recoil';

const initialAppState: AppState = {
  map: { title: '', type: '', region: 'Africa' },
  userData: { data: [], errors: [], ready: false },
  currentStep: 0,
  dataKeys: {},
  mismatchedRegions: [],
  regionSuggestions: [],
  choroplethColorScheme: 'Reds',
  symbolColorScheme: 'Red',
  symbolShape: 'Circle',
};

export const recoilState: RecoilState<AppState> = atom({
  default: initialAppState,
  key: 'initialAppState',
});
