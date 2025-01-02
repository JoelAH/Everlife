import { ElementalPower, GameState } from './types';

export const locations: Record<string, any> = {
  'Scorched Plains Entry': {
    name: 'Scorched Plains Entry',
    description: 'You stand at the edge of a once-fertile land, now reduced to cracked earth and withered vegetation. The air is thick with smoke and ash.',
    environmentalThreat: 'Severe drought and uncontrolled fires',
    crisis: {
      type: 'drought',
      severity: 8,
      description: 'The land is parched and dying, with small fires sprouting spontaneously in the distance.'
    },
    exits: ['Water Spirit Shrine', 'Burning Forest'],
    items: ['water_crystal']
  },
  'Water Spirit Shrine': {
    name: 'Water Spirit Shrine',
    description: 'An ancient shrine dedicated to the water spirits. Despite the surrounding desolation, a small spring still flows here.',
    exits: ['Scorched Plains Entry'],
    items: ['spirit_essence'],
    environmentalThreat: 'Water source contamination'
  },
  'Burning Forest': {
    name: 'Burning Forest',
    description: 'What was once a lush forest is now a maze of burning trees and thick smoke. The destruction is overwhelming.',
    environmentalThreat: 'Uncontrolled forest fires',
    crisis: {
      type: 'wildfire',
      severity: 9,
      description: 'The forest is being consumed by an inferno, threatening to spread to other regions.'
    },
    exits: ['Scorched Plains Entry'],
    items: ['fire_suppressant']
  }
};

const handlePowerUse = (power: ElementalPower, state: GameState): GameState => {
  if (!state.elementalPowers.includes(power)) {
    return {
      ...state,
      messages: [...state.messages, `You don't have the ${power.name} power.`]
    };
  }

  const location = locations[state.currentLocation];
  let effectiveMessage = '';
  let environmentalEffect = 0;

  switch (power.name) {
    case 'water_blast':
      if (location.crisis?.type === 'drought' || location.crisis?.type === 'wildfire') {
        effectiveMessage = location.crisis.type === 'drought' 
          ? 'Your water blast provides much-needed moisture to the parched earth!'
          : 'Your water blast helps contain the spreading fires!';
        environmentalEffect = 5;
      }
      break;
    case 'earth_shield':
      if (location.crisis?.type === 'erosion' || location.environmentalThreat?.includes('drought')) {
        effectiveMessage = 'Your earth shield creates natural barriers, protecting the soil and vegetation!';
        environmentalEffect = 3;
      }
      break;
  }

  if (environmentalEffect > 0) {
    return {
      ...state,
      environmentStatus: Math.min(100, state.environmentStatus + environmentalEffect),
      messages: [
        ...state.messages, 
        effectiveMessage,
        `The Earth's health has improved by ${environmentalEffect}%!`
      ]
    };
  }

  return {
    ...state,
    messages: [...state.messages, effectiveMessage || 'The power seems to have no effect here.']
  };
};

const handleEnvironmentStatus = (state: GameState): GameState => {
  return {
    ...state,
    messages: [...state.messages, `Current environment status: ${state.environmentStatus}`]
  };
};

export const processCommand = (command: string, state: GameState): GameState => {
  const words = command.toLowerCase().split(' ');
  const action = words[0];

  switch (action) {
    case 'go':
    case 'move':
      return handleMovement(words[1], state);
    case 'use':
      return handlePowerUse({
        name: action,
        element: 'water',
        damage: 0,
        energyCost: 0,
        description: ''
      }, state);
    case 'look':
      return handleLook(state);
    case 'help':
      return handleHelp(state);
    case 'status':
      return handleEnvironmentStatus(state);

    default:
      return {
        ...state,
        messages: [...state.messages, `I don't understand '${command}'. Type 'help' for a list of commands.`],
      };
  }
};

import { generateEnemyEncounter } from './combat';

const enemies = [
  {
    name: "Smoke Wraith",
    health: 50,
    maxHealth: 50,
    attack: 8,
    experience: 20,
    type: "pollution",
    description: "A malevolent entity born from toxic emissions"
  },
  {
    name: "Acid Rain Specter",
    health: 45,
    maxHealth: 45,
    attack: 12,
    experience: 25,
    type: "corruption",
    description: "Corrupted water spirit spreading pollution"
  },
  {
    name: "Industrial Golem",
    health: 80,
    maxHealth: 80,
    attack: 15,
    experience: 35,
    type: "machine",
    description: "A construct of industrial waste and machinery"
  }
];

const handleMovement = (direction: string, state: GameState): GameState => {
  const currentLocation = locations[state.currentLocation];
  if (!currentLocation.exits.includes(direction)) {
    return {
      ...state,
      messages: [...state.messages, `You can't go to ${direction} from here.`],
    };
  }

  const possibleEnemy = generateEnemyEncounter(enemies);
  if (possibleEnemy) {
    return {
      ...state,
      mode: 'combat',
      currentLocation: direction,
      currentEnemy: possibleEnemy,
      messages: [
        ...state.messages,
        `You move to the ${direction}.`,
        locations[direction].description,
        `A ${possibleEnemy.name} appears!`,
        possibleEnemy.description
      ],
    };
  }

  return {
    ...state,
    currentLocation: direction,
    messages: [...state.messages, `You move to the ${direction}.`, locations[direction].description],
  };
};

const handleLook = (state: GameState): GameState => {
  const currentLocation = locations[state.currentLocation];
  const itemsDescription = currentLocation.items.length > 0
    ? `You see the following items: ${currentLocation.items.join(', ')}.`
    : 'There are no items of interest here.';
  return {
    ...state,
    messages: [...state.messages, currentLocation.description, itemsDescription],
  };
};







const handleHelp = (state: GameState): GameState => {
  const helpMessage = `
    Available Commands:
    - go [location]: Move to a new area
    - use [power]: Use an elemental power
    - look: Examine your surroundings
    - status: Check environmental conditions
    - help: Show this help message

    Your elemental powers: ${state.elementalPowers.join(', ')}
  `;
  return {
    ...state,
    messages: [...state.messages, helpMessage],
  };
};