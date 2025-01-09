import { GameState } from './types';
import { generateEnemyEncounter } from './combat';
import { enemies, GAME_STATE } from './states';

export const processCommand = (command: string, state: GameState): GameState => {
  const words = command.toLowerCase().split(' ');
  const action = words[0];

  switch (action) {
    case 'forward':
      return handleForward(state);

    default:
      return {
        ...state,
        messages: [...state.messages, `I don't understand '${command}'.`],
      };
  }
};

const handleForward = (state: GameState): GameState => {
  if (state.step) {
    let newStep = state.step + 1;
    let newState = GAME_STATE.find(s => s.step === newStep);
    while(!newState) {
      newStep = newStep + 1;
      newState = GAME_STATE.find(s => s.step === newStep)
    }
    
    return {
      ...newState,
      messages: [
        ...state.messages,
        ...newState.messages
      ],
      playerStats: state.playerStats,
      inventory: state.inventory,
      elementalPowers: state.elementalPowers,
      environmentStatus: state.environmentStatus,
      currentEnemy: newState.mode === 'combat' ? (generateEnemyEncounter(enemies, newState.currentEnemyType) || undefined) : undefined
    }
  }

  return state;
};