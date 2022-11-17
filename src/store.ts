/* eslint-disable import/prefer-default-export */
import type { RecoilState } from 'recoil';
import { atom } from 'recoil';

const initialAppState: AppState = {
  map: { title: '', type: '', region: 'Africa' },
  userData: { data: [], ready: false },
  currentStep: 0,
  dataKeys: {},
  mismatchedRegions: 0,
  choroplethColorScheme: 'Reds',
  symbolColorScheme: 'Red',
  symbolShape: 'Circle',
};

export const recoilState: RecoilState<AppState> = atom({
  default: initialAppState,
  key: 'initialAppState',
});
