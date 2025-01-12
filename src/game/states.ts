import { GameState } from "./types";

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

export const GAME_STATE: GameState[] = [{
    "step": 1,
    "mode": "story",
    "messages": [
        "Loading game..."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": [],
    "environmentStatus": 50,
    "currentEnemy": undefined
}]