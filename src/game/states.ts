import { ElementalPower, Enemy, GameState } from "./types";

export const ENEMY_APPEARED_MESSAGE = 'Enemy appeared!';
export const GAME_OVER = 'GAME OVER';
export const defaultPlayerStats = {
    health: 100,
    maxHealth: 100,
    energy: 100,
    maxEnergy: 100,
    experience: 0,
    harmony: 70
};

export const locations: Record<string, any> = {
    'Scorched Plains Entry': {
        name: 'Scorched Plains Entry',
        description: 'You stand at the edge of a once-fertile land, now reduced to cracked earth and withered vegetation. The air is thick with smoke and ash.',
        environmentalThreat: 'Severe drought and uncontrolled fires',
        crisis: {
            type: 'drought',
            severity: 10,
            description: 'The land is parched and dying, with small fires sprouting spontaneously in the distance.'
        },
        exits: ['Water Spirit Shrine', 'Crystal Caverns', 'Storm Peaks'],
        items: ['water_crystal']
    },
    'Water Spirit Shrine': {
        name: 'Water Spirit Shrine',
        description: 'An ancient shrine dedicated to the water spirits. Despite the surrounding desolation, a small spring still flows here.',
        crisis: {
            type: 'floods',
            severity: 7,
            description: 'The land is being flooded'
        },
        exits: ['Scorched Plains Entry'],
        items: ['spirit_essence'],
        environmentalThreat: 'Water source contamination'
    },
    'Crystal Caverns': {
        name: 'Crystal Caverns',
        description: 'A vast network of underground chambers adorned with glowing crystals. The ground trembles ominously as ancient stone guardians stir.',
        environmentalThreat: 'Seismic instability',
        crisis: {
            type: 'earthquake',
            severity: 8,
            description: 'The cavern system is becoming unstable, threatening to collapse and reshape the surrounding landscape.'
        },
        exits: ['Scorched Plains Entry'],
        items: ['earth_talisman']
    },
    'Storm Peaks': {
        name: 'Storm Peaks',
        description: 'Jagged mountain peaks pierce the clouds, where violent winds howl and lightning arcs between floating islands of rock.',
        environmentalThreat: 'Devastating storms',
        crisis: {
            type: 'tempest',
            severity: 9,
            description: 'A massive storm system is forming, generating tornados and lightning strikes that threaten the lands below.'
        },
        exits: ['Scorched Plains Entry'],
        items: ['wind_charm']
    }
};

export const enemies: Enemy[] = [
    {
        name: "Blaze Reactor",
        health: 85,
        maxHealth: 85,
        attack: 14,
        experience: 35,
        type: "fire",
        description: "A malfunctioning reactor core that spreads uncontrolled flames"
    },
    {
        name: "Plasma Specter",
        health: 45,
        maxHealth: 45,
        attack: 20,
        experience: 30,
        type: "fire",
        description: "An unstable mass of superheated industrial waste"
    },
    {
        name: "Furnace Demon",
        health: 70,
        maxHealth: 70,
        attack: 16,
        experience: 35,
        type: "fire",
        description: "A malevolent spirit born in abandoned factory furnaces"
    },
    {
        name: "Oil Fire Demon",
        health: 60,
        maxHealth: 60,
        attack: 18,
        experience: 40,
        type: "fire",
        description: "A creature of burning petroleum that ignites everything it touches"
    },
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
        name: "Smog Beast",
        health: 75,
        maxHealth: 75,
        attack: 13,
        experience: 30,
        type: "pollution",
        description: "A massive creature formed from concentrated air pollution"
    },
    {
        name: "Toxic Sludge Horror",
        health: 90,
        maxHealth: 90,
        attack: 14,
        experience: 40,
        type: "pollution",
        description: "An amorphous mass of living chemical waste"
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
        name: "Tainted Earth Spirit",
        health: 50,
        maxHealth: 50,
        attack: 10,
        experience: 25,
        type: "corruption",
        description: "A soil spirit twisted by chemical contamination"
    },
    {
        name: "Toxic Wind Wisp",
        health: 40,
        maxHealth: 40,
        attack: 14,
        experience: 25,
        type: "corruption",
        description: "Once-pure air spirit now spreading noxious fumes"
    },
    {
        name: "Plague Tree Ent",
        health: 55,
        maxHealth: 55,
        attack: 11,
        experience: 30,
        type: "corruption",
        description: "A forest guardian warped by industrial waste"
    },
    {
        name: "Corrupted Frost Wraith",
        health: 42,
        maxHealth: 42,
        attack: 13,
        experience: 25,
        type: "corruption",
        description: "An ice spirit tainted by chemical runoff"
    },
    {
        name: "Sludge River Nymph",
        health: 48,
        maxHealth: 48,
        attack: 11,
        experience: 25,
        type: "corruption",
        description: "A river spirit transformed by industrial dumping"
    },
    {
        name: "Industrial Golem",
        health: 80,
        maxHealth: 80,
        attack: 15,
        experience: 35,
        type: "machine",
        description: "A construct of industrial waste and machinery"
    },
    {
        name: "Rogue Harvester",
        health: 100,
        maxHealth: 100,
        attack: 15,
        experience: 45,
        type: "machine",
        description: "An automated harvesting machine that now hunts organic life"
    },
    {
        name: "Nano Swarm",
        health: 40,
        maxHealth: 40,
        attack: 22,
        experience: 35,
        type: "machine",
        description: "A cloud of malfunctioning nanobots that devour everything in their path"
    },
    {
        name: "Circuit Phantom",
        health: 65,
        maxHealth: 65,
        attack: 17,
        experience: 40,
        type: "machine",
        description: "An electrical entity that possesses and weaponizes machinery"
    }
];

const powers: ElementalPower[] = [
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
    },
    {
        name: "Re-energize",
        element: "misc",
        damage: 0,
        energyCost: 0,
        description: "Call upon the elemental spirits for energy."
    }
];

export const GAME_STATE: GameState[] = [
    {
        step: 1,
        mode: 'story',
        currentLocation: locations['Scorched Plains Entry'].name,
        playerStats: defaultPlayerStats,
        messages: [
            `Welcome to EverLife - A Journey to Save Earth. 
          You are a chosen guardian, blessed with elemental powers by the ancient spirits. 
          Your mission: Save this land from environmental destruction. 
          Click "Go Forward" to start your mission.`
        ],
        inventory: [],
        elementalPowers: powers,
        environmentStatus: 50,
        currentEnemy: undefined
    },
    {
        step: 2,
        mode: 'decision',
        currentLocation: locations['Scorched Plains Entry'].name,
        playerStats: defaultPlayerStats,
        messages: [
            `Before you go any further, do you accept this mission?`
        ],
        inventory: [],
        elementalPowers: powers,
        environmentStatus: 50,
        currentEnemy: undefined,
        options: [
            {
                text: 'I accept', goto: 3
            },
            {
                text: 'No, this is too much for me', goto: 50
            }
        ] 
    },
    {
        step: 3,
        mode: 'story',
        currentLocation: locations['Scorched Plains Entry'].name,
        playerStats: defaultPlayerStats,
        messages: [
            `We will head north through Scorched Plains`
        ],
        inventory: [],
        elementalPowers: powers,
        environmentStatus: 50,
        currentEnemy: undefined
    },
    {
        step: 4,
        mode: 'decision',
        currentLocation: locations['Scorched Plains Entry'].name,
        playerStats: defaultPlayerStats,
        messages: [
            `There are two paths to choose from. The right looks nice. But the left is dark and scary.`
        ],
        inventory: [],
        elementalPowers: powers,
        environmentStatus: 50,
        currentEnemy: undefined,
        options: [
            {
                text: 'Go left', goto: 5, choice: 1
            },
            {
                text: 'Go right', goto: 5, choice: 2
            }
        ] 
    },
    {
        step: 5,
        choice: 1,
        mode: 'combat',
        currentLocation: locations['Scorched Plains Entry'].name,
        playerStats: defaultPlayerStats,
        messages: [
            ENEMY_APPEARED_MESSAGE
        ],
        inventory: [],
        elementalPowers: powers,
        environmentStatus: 50,
        currentEnemy: undefined
    },
    {
        step: 5,
        choice: 2,
        mode: 'story',
        currentLocation: locations['Scorched Plains Entry'].name,
        playerStats: defaultPlayerStats,
        messages: [
            `You have gone to the right and past the worse.`
        ],
        inventory: [],
        elementalPowers: powers,
        environmentStatus: 50,
        currentEnemy: undefined
    },
    {
        step: 50,
        mode: 'end',
        currentLocation: locations['Scorched Plains Entry'].name,
        playerStats: defaultPlayerStats,
        messages: [
            GAME_OVER
        ],
        inventory: [],
        elementalPowers: powers,
        environmentStatus: 50,
        currentEnemy: undefined
    }
]