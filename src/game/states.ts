import { Enemy, GameState } from "./types";

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

export const enemies: Enemy[] = [
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

export const GAME_STATE: GameState[] = [
    {
        mode: 'exploration',
        currentLocation: 'Scorched Plains Entry',
        playerStats: {
            health: 100,
            maxHealth: 100,
            energy: 100,
            maxEnergy: 100,
            experience: 0,
            level: 1,
            harmony: 70
        },
        messages: [
            `Welcome to EverLife - A Journey to Save Earth. 
          You are a chosen guardian, blessed with elemental powers by the ancient spirits. 
          Your mission: Save this land from environmental destruction. 
          Click "Look Around" to examine your surroundings.`
        ],
        inventory: [],
        elementalPowers: [
            {
                name: "Water Blast",
                element: "water",
                damage: 15,
                energyCost: 20,
                description: "A concentrated blast of purifying water"
            },
            {
                name: "Earth Shield",
                element: "earth",
                damage: 0,
                energyCost: 15,
                description: "Defensive barrier made of natural elements"
            },
            {
                name: "Healing Rain",
                element: "water",
                damage: 0,
                energyCost: 25,
                description: "Rejuvenating rain that restores the land"
            },
            {
                name: "Nature's Wrath",
                element: "earth",
                damage: 20,
                energyCost: 30,
                description: "Channel the anger of the wounded Earth"
            }
        ],
        environmentStatus: 70,
        currentEnemy: undefined
    }
]