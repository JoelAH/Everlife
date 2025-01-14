import { Enemy, GameState } from './types';
import { generateEnemyEncounter } from './combat';

export const processCommand = (command: string, state: GameState, allGameStates: GameState[], enemies: Enemy[]): GameState => {
  const words = command.toLowerCase().split(' ');
  const action = words[0];

  switch (action) {
    case 'forward':
      return handleForward(state, allGameStates, enemies);

    default:
      return {
        ...state,
        messages: [...state.messages, `I don't understand '${command}'.`],
      };
  }
};

const handleForward = (currentState: GameState, allGameStates: GameState[], enemies: Enemy[]): GameState => {
  if (currentState.step || currentState.step === 0) {
    let newStep = currentState.step + 1;
    let newState = allGameStates.find(s => s.step === newStep);
    while(!newState) {
      newStep = newStep + 1;
      newState = allGameStates.find(s => s.step === newStep)
    }
    
    return {
      ...newState,
      messages: [
        ...currentState.messages,
        ...newState.messages
      ],
      playerStats: currentState.playerStats,
      inventory: currentState.inventory,
      elementalPowers: currentState.elementalPowers,
      environmentStatus: currentState.environmentStatus,
      currentEnemy: newState.mode === 'combat' ? (generateEnemyEncounter(enemies, newState.currentEnemyType) || undefined) : undefined
    }
  }

  return currentState;
};