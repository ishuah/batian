/* eslint-disable import/prefer-default-export */
import { useEffect } from 'react';
import { RecoilState, useRecoilValue, atom } from 'recoil';

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

type RecoilObserverProps = {
  node: RecoilState<AppState>,
  onChange: (value: AppState) => void
}

export function RecoilObserver(props: RecoilObserverProps) {
  const { node, onChange } = props;
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
}
