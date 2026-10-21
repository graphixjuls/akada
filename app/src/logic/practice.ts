/** Practice session answer state: pick an answer, check it, get instant feedback, move on. */
export interface PracticeState {
  index: number;
  selected: number | null;
  checked: boolean;
  /** One entry per checked question: was it right? */
  outcomes: boolean[];
}

export type PracticeAction =
  | { type: 'select'; option: number }
  | { type: 'check'; answerIndex: number }
  | { type: 'next' };

export const initialPractice: PracticeState = { index: 0, selected: null, checked: false, outcomes: [] };

export function practiceReducer(state: PracticeState, action: PracticeAction): PracticeState {
  switch (action.type) {
    case 'select':
      return state.checked ? state : { ...state, selected: action.option };
    case 'check':
      if (state.checked || state.selected === null) return state;
      return { ...state, checked: true, outcomes: [...state.outcomes, state.selected === action.answerIndex] };
    case 'next':
      if (!state.checked) return state;
      return { index: state.index + 1, selected: null, checked: false, outcomes: state.outcomes };
  }
}

export type OptionState = 'Default' | 'Selected' | 'Correct' | 'Wrong';

/** Answer Option variant for each option. After checking, the right answer is always shown. */
export function optionState(state: PracticeState, option: number, answerIndex: number): OptionState {
  if (!state.checked) return state.selected === option ? 'Selected' : 'Default';
  if (option === answerIndex) return 'Correct';
  if (option === state.selected) return 'Wrong';
  return 'Default';
}
