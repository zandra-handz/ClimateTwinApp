import { AppState, AppStateStatus } from 'react-native';
import { useEffect, useRef } from 'react';

export function useWatchAppState(onChange: (state: AppStateStatus) => void) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appState.current !== nextAppState) {
        appState.current = nextAppState;
        onChange(nextAppState);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [onChange]);
}
