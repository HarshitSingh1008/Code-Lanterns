import { useCallback, useEffect, useSyncExternalStore } from 'react';

import { getState, hydrate, subscribe, type Action, type State } from './store';

export function useNexus(): [State, (a: Action) => void] {
  const state = useSyncExternalStore(subscribe, getState, getState);
  const dispatch = useCallback((a: Action) => {
    void import('./store').then((m) => m.dispatch(a));
  }, []);
  return [state, dispatch];
}

export function useNexusHydration() {
  useEffect(() => {
    void hydrate();
  }, []);
}

export function useMember(memberId: string) {
  const [state] = useNexus();
  return state.okf.members.find((m) => m.memberId === memberId) ?? state.okf.members[0];
}
