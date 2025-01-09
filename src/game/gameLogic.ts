import { ElementalPower, GameState } from './types';
import { generateEnemyEncounter } from './combat';
import { enemies, ENEMY_APPEARED_MESSAGE, GAME_STATE, locations } from './states';

// const handlePowerUse = (power: ElementalPower, state: GameState): GameState => {
//   if (!state.elementalPowers.includes(power)) {
//     return {
//       ...state,
//       messages: [...state.messages, `You don't have the ${power.name} power.`]
//     };
//   }

//   const location = locations[state.currentLocation];
//   let effectiveMessage = '';
//   let environmentalEffect = 0;

//   switch (power.name) {
//     case 'water_blast':
//       if (location.crisis?.type === 'drought' || location.crisis?.type === 'wildfire') {
//         effectiveMessage = location.crisis.type === 'drought'
//           ? 'Your water blast provides much-needed moisture to the parched earth!'
//           : 'Your water blast helps contain the spreading fires!';
//         environmentalEffect = 5;
//       }
//       break;
//     case 'earth_shield':
//       if (location.crisis?.type === 'erosion' || location.environmentalThreat?.includes('drought')) {
//         effectiveMessage = 'Your earth shield creates natural barriers, protecting the soil and vegetation!';
//         environmentalEffect = 3;
//       }
//       break;
//   }

//   if (environmentalEffect > 0) {
//     return {
//       ...state,
//       environmentStatus: Math.min(100, state.environmentStatus + environmentalEffect),
//       messages: [
//         ...state.messages,
//         effectiveMessage,
//         `The Earth's health has improved by ${environmentalEffect}%!`
//       ]
//     };
//   }

//   return {
//     ...state,
//     messages: [...state.messages, effectiveMessage || 'The power seems to have no effect here.']
//   };
// };

export const processCommand = (command: string, state: GameState): GameState => {
  const words = command.toLowerCase().split(' ');
  const action = words[0];

  switch (action) {
    // case 'go':
    // case 'move':
    //   return handleMovement(words[1], state);
    // case 'use':
    //   return handlePowerUse({
    //     name: action,
    //     element: 'water',
    //     damage: 0,
    //     energyCost: 0,
    //     description: ''
    //   }, state);
    case 'forward':
      return handleForward(state);

    default:
      return {
        ...state,
        messages: [...state.messages, `I don't understand '${command}'.`],
      };
  }
};

// const handleMovement = (direction: string, state: GameState): GameState => {
//   // const currentLocation = locations[state.currentLocation];
//   // if (!currentLocation.exits.includes(direction)) {
//   //   return {
//   //     ...state,
//   //     messages: [...state.messages, `You can't go to ${direction} from here.`],
//   //   };
//   // }

//   const possibleEnemy = generateEnemyEncounter(enemies);
//   if (possibleEnemy) {
//     return {
//       ...state,
//       mode: 'combat',
//       currentLocation: direction,
//       currentEnemy: possibleEnemy,
//       messages: [
//         ...state.messages,
//         `You move to the ${direction}.`,
//         locations[direction].description,
//         `A ${possibleEnemy.name} appears!`,
//         possibleEnemy.description
//       ],
//     };
//   }

//   return {
//     ...state,
//     currentLocation: direction,
//     messages: [...state.messages, `You move to the ${direction}.`, locations[direction].description],
//   };
// };

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
  // const possibleEnemy = generateEnemyEncounter(enemies);
  // console.log('1', possibleEnemy);
  // if (possibleEnemy && state.mode !== 'combat' && (state.step !== 1 && state.step !== 2)) {
  //   return {
  //     ...state,
  //     mode: 'combat',
  //     currentEnemy: possibleEnemy,
  //     messages: [
  //       ...state.messages,
  //       ENEMY_APPEARED_MESSAGE,
  //       possibleEnemy.description
  //     ],
  //   };
  // } else {
  //   if (state.step) {
  //     console.log('2', state.step);
  //     let newStep = state.step + 1;
  //     let newState = GAME_STATE.find(s => s.step === newStep);
  //     while(!newState) {
  //       newStep = newStep + 1;
  //       newState = GAME_STATE.find(s => s.step === newStep)
  //     }
      
  //     return {
  //       ...newState,
  //       messages: [
  //         ...state.messages,
  //         ...newState.messages
  //       ],
  //       playerStats: state.playerStats,
  //       inventory: state.inventory,
  //       elementalPowers: state.elementalPowers,
  //       environmentStatus: state.environmentStatus
  //     }
  //   }

  //   return state;
  // }
};
// const handleLook = (state: GameState): GameState => {
//   const currentLocation = locations[state.currentLocation];
//   const itemsDescription = currentLocation.items.length > 0
//     ? `You see the following items: ${currentLocation.items.join(', ')}.`
//     : 'There are no items of interest here.';
//   return {
//     ...state,
//     messages: [...state.messages, ENEMY_APPEARED_MESSAGE],
//     currentEnemy: enemies[0],
//     mode: 'combat'
//     //messages: [...state.messages, currentLocation.description, itemsDescription],
//   };
// };