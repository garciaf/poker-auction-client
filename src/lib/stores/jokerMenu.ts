import { writable } from 'svelte/store';
import type { Joker } from './player';

export type JokerMenuStep =
  | 'closed'
  | 'select-joker'
  | 'select-target'
  // Burn Card: a card on the table
  | 'select-community-card'
  // Pickpocket: a card of the lot, then one of the player's hole cards
  | 'select-pickpocket';

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

// What the player picks next to play this joker.
function stepFor(joker: Joker): JokerMenuStep {
  if (joker.choose === 'community-card') return 'select-community-card';
  if (joker.choose === 'lot-and-hole-card') return 'select-pickpocket';
  return joker.requiresTarget ? 'select-target' : 'select-joker';
}

function createJokerMenuStore() {
  const { subscribe, set, update } = writable<JokerMenuState>(initialState);

  return {
    subscribe,
    open: () => update(state => ({ ...state, isOpen: true, step: 'select-joker' })),
    // Straight to what this joker needs (e.g. Pickpocket from the card-select screen).
    openWith: (joker: Joker) => set({ isOpen: true, selectedJoker: joker, step: stepFor(joker) }),
    close: () => set(initialState),
    selectJoker: (joker: Joker) => update(state => ({
      ...state,
      selectedJoker: joker,
      step: stepFor(joker)
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
