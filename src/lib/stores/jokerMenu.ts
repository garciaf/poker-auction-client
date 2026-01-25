import { writable } from 'svelte/store';
import type { Joker } from './player';

export type JokerMenuStep = 'closed' | 'select-joker' | 'select-target';

export interface JokerMenuState {
  isOpen: boolean;
  step: JokerMenuStep;
  selectedJoker: Joker | null;
}

const initialState: JokerMenuState = {
  isOpen: false,
  step: 'closed',
  selectedJoker: null
};

function createJokerMenuStore() {
  const { subscribe, set, update } = writable<JokerMenuState>(initialState);

  return {
    subscribe,
    open: () => update(state => ({ ...state, isOpen: true, step: 'select-joker' })),
    close: () => set(initialState),
    selectJoker: (joker: Joker) => update(state => ({
      ...state,
      selectedJoker: joker,
      step: joker.requiresTarget ? 'select-target' : 'select-joker'
    })),
    goBack: () => update(state => ({
      ...state,
      selectedJoker: null,
      step: 'select-joker'
    })),
    reset: () => set(initialState)
  };
}

export const jokerMenuStore = createJokerMenuStore();
