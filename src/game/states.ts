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
        health: 50,
        maxHealth: 50,
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
        health: 40,
        maxHealth: 40,
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
        health: 60,
        maxHealth: 60,
        attack: 13,
        experience: 30,
        type: "pollution",
        description: "A massive creature formed from concentrated air pollution"
    },
    {
        name: "Toxic Sludge Horror",
        health: 50,
        maxHealth: 50,
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
        health: 60,
        maxHealth: 60,
        attack: 15,
        experience: 35,
        type: "machine",
        description: "A construct of industrial waste and machinery"
    },
    {
        name: "Rogue Harvester",
        health: 60,
        maxHealth: 60,
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
        health: 40,
        maxHealth: 40,
        attack: 17,
        experience: 40,
        type: "machine",
        description: "An electrical entity that possesses and weaponizes machinery"
    }
];

export const powers: ElementalPower[] = [
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
        energyCost: 15,
        description: "Rejuvenating rain that restores the land"
    },
    {
        name: "Nature's Wrath",
        element: "earth",
        damage: 30,
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

export const GAME_STATE: GameState[] = [{
    "step": 1,
    "mode": "story",
    "messages": [
        "Welcome to EverLife - A Journey to Save Earth. \n            You are a chosen guardian, blessed with elemental powers by the ancient spirits. \n            Your mission: Save this land from environmental destruction caused by the mysterious Blight Corporation.\n            Click \"Go Forward\" to begin your destiny."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 2,
    "mode": "story",
    "messages": [
        "The spirits materialize before you - manifestations of Water, Earth, Wind, and Fire.\n            They speak in unison: \"The land cries out in pain. The Scorched Plains, once verdant and alive,\n            now lies dying under the corruption of industrial waste and toxic emissions.\""
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 3,
    "mode": "decision",
    "messages": [
        "The spirits offer you their power. But wielding all elements requires great responsibility.\n            Which element calls to you most strongly?"
    ],
    "options": [
        {
            "text": "Water - The element of healing and adaptation",
            "goto": 4,
            "choice": 1
        },
        {
            "text": "Earth - The element of protection and strength",
            "goto": 4,
            "choice": 2
        },
        {
            "text": "Wind - The element of freedom and speed",
            "goto": 4,
            "choice": 3
        },
        {
            "text": "Fire - The element of passion and change",
            "goto": 4,
            "choice": 4
        }
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 4,
    "choice": 1,
    "mode": "story",
    "messages": [
        "The Water Spirit envelops you in a cool mist. You feel its healing energy flow through you.\n            \"Use our blessing to cleanse the corruption and restore life to these lands.\""
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 4,
    "choice": 2,
    "mode": "story",
    "messages": [
        "The Earth Spirit's energy grounds you with ancient strength.\n            \"Our power shall help you protect what remains and rebuild what was lost.\""
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 4,
    "choice": 3,
    "mode": "story",
    "messages": [
        "The Wind Spirit's essence dances around you like a playful breeze.\n            \"Let our swiftness guide you to where you're needed most.\""
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 4,
    "choice": 4,
    "mode": "story",
    "messages": [
        "The Fire Spirit's warmth ignites your inner strength.\n            \"Our flame will help you forge a new path for this wounded world.\""
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 5,
    "mode": "story",
    "messages": [
        "As you step into the Scorched Plains, you see the devastation firsthand.\n            Withered trees reach toward a smog-filled sky. The ground is cracked and lifeless.\n            In the distance, dark smoke rises from Blight Corporation's main facility."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 6,
    "mode": "decision",
    "messages": [
        "A group of local villagers approaches you. They look desperate.\n            \"Please, our water supply has been contaminated by the factory's waste.\n            But there's also a forest fire spreading from their careless operations.\""
    ],
    "options": [
        {
            "text": "Help purify the water supply",
            "goto": 7,
            "choice": 1
        },
        {
            "text": "Stop the forest fire",
            "goto": 7,
            "choice": 2
        }
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 7,
    "choice": 1,
    "mode": "combat",
    "messages": [
        "As you approach the contaminated reservoir, a monster emerges!\n            The corruption has taken physical form!"
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 7,
    "choice": 2,
    "mode": "combat",
    "messages": [
        "Racing toward the burning forest, you encounter a Fire Elemental corrupted by industrial waste!\n            It's spreading the flames intentionally!"
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined,
    "currentEnemyType": "fire"
}, {
    "step": 8,
    "mode": "story",
    "messages": [
        "After the battle, you discover a disturbing truth. These corrupted beings\n            were once pure nature spirits, twisted by Blight Corporation's experiments\n            with forbidden technology."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 9,
    "mode": "decision",
    "messages": [
        "A wounded security guard from Blight Corporation lies before you.\n            He offers to help you infiltrate the facility in exchange for healing.\n            However, a local environmentalist warns that it could be a trap."
    ],
    "options": [
        {
            "text": "Help and trust the guard",
            "goto": 10,
            "choice": 1
        },
        {
            "text": "Decline and find another way",
            "goto": 10,
            "choice": 2
        }
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 10,
    "choice": 1,
    "mode": "story",
    "messages": [
        "The guard, grateful for your mercy, reveals a secret entrance\n            and provides you with his keycard. \"Be careful,\" he warns,\n            \"They're working on something big in the lower levels.\""
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 10,
    "choice": 2,
    "mode": "combat",
    "messages": [
        "Your refusal angers the guard, who reveals himself as a corrupted shapeshifter!\n            The trap is sprung!"
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 11,
    "mode": "story",
    "messages": [
        "You discover Blight Corporation's true plan. They're not just polluting the land -\n            they're harvesting the corruption itself as an energy source.\n            Each act of destruction makes them stronger."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 12,
    "mode": "decision",
    "messages": [
        "In the facility's research lab, you find evidence of two urgent threats:\n            A massive toxic waste dump about to leak into the underground aquifer,\n            and a new superweapon about to be tested that will accelerate global warming."
    ],
    "options": [
        {
            "text": "Stop the toxic waste leak",
            "goto": 13,
            "choice": 1
        },
        {
            "text": "Destroy the superweapon",
            "goto": 13,
            "choice": 2
        }
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 13,
    "choice": 1,
    "mode": "combat",
    "messages": [
        "The toxic waste has gained sentience! A massive Pollution Behemoth rises from the dump,\n            its very presence corrupting everything around it!"
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined,
    "currentEnemyType": "pollution"
}, {
    "step": 13,
    "choice": 2,
    "mode": "combat",
    "messages": [
        "The superweapon is protected by the CEO's personal guard - a cybernetically enhanced\n            warrior powered by corrupted spirit energy!"
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined,
    "currentEnemyType": "corruption"
}, {
    "step": 14,
    "mode": "story",
    "messages": [
        "Your actions have weakened Blight Corporation, but the CEO, Dr. Mara Blight,\n            reveals herself. \"You understand nothing! The old world is dying anyway.\n            We're simply accelerating the inevitable and profiting from it!\""
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 15,
    "mode": "decision",
    "messages": [
        "Dr. Blight offers you a choice: \"Join us! Help us manage the world's end.\n            We can ensure some survive, rebuild in our image. Or die fighting for a lost cause.\""
    ],
    "options": [
        {
            "text": "Never! The Earth can be saved!",
            "goto": 16,
            "choice": 1
        },
        {
            "text": "Pretend to accept and infiltrate deeper",
            "goto": 16,
            "choice": 2
        }
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 16,
    "choice": 1,
    "mode": "combat",
    "messages": [
        "Dr. Blight unleashes her security force!"
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 16,
    "choice": 2,
    "mode": "story",
    "messages": [
        "You feign acceptance. Dr. Blight smiles coldly, \"Wise choice. Follow me\n        to your... orientation.\" Her hesitation makes you uneasy."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 17,
    "mode": "story",
    "messages": [
        "Deeper in the facility, you discover rows of massive tanks. Each contains\n        a captured nature spirit, their essence being slowly corrupted and drained."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 18,
    "mode": "decision",
    "messages": [
        "You find the spirit containment control system. You could:\n        Release all spirits at once, causing chaos but maximum damage to the facility,\n        or carefully free them one by one, taking longer but ensuring their safety."
    ],
    "options": [
        {
            "text": "Release all at once",
            "goto": 19,
            "choice": 1
        },
        {
            "text": "Free them carefully",
            "goto": 19,
            "choice": 2
        }
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 19,
    "choice": 1,
    "mode": "combat",
    "messages": [
        "The freed spirits rampage through the facility! But some have been corrupted\n        beyond recognition. A Chaos Storm Spirit attacks you!"
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 19,
    "choice": 2,
    "mode": "story",
    "messages": [
        "You begin carefully freeing the spirits. Each one grants you a portion of\n        their remaining power in gratitude. You feel your abilities growing stronger."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 20,
    "mode": "story",
    "messages": [
        "An alarm blares through the facility. Dr. Blight's voice echoes:\n        \"Intruder in the spirit containment sector! Release the Hybrid Units!\""
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 21,
    "mode": "combat",
    "messages": [
        "The Hybrid Units arrive - half-human, half-spirit beings, forcibly fused\n        with corrupted essence. Their faces show pain behind their rage."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 22,
    "mode": "decision",
    "messages": [
        "You notice the Hybrid Units have spirit cores that could be purified.\n        But attempting this would leave you vulnerable to their attacks."
    ],
    "options": [
        {
            "text": "Try to save them",
            "goto": 23,
            "choice": 1
        },
        {
            "text": "Defeat them quickly",
            "goto": 23,
            "choice": 2
        }
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 23,
    "choice": 1,
    "mode": "story",
    "messages": [
        "Your purification attempt works! The freed humans are confused but grateful.\n        They offer to help you navigate the facility's deeper levels."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 23,
    "choice": 2,
    "mode": "story",
    "messages": [
        "The Hybrid Units are defeated, but their final moments of anguish will\n        haunt you. At least they're free from their torment now."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 24,
    "mode": "story",
    "messages": [
        "You find Dr. Blight's personal logs. They reveal she was once an environmental\n        scientist who became convinced that humanity's doom was inevitable."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 25,
    "mode": "decision",
    "messages": [
        "The logs contain access codes to either: The facility's power core,\n        or the executive elevator to Dr. Blight's office. Choose your approach:"
    ],
    "options": [
        {
            "text": "Sabotage the power core",
            "goto": 26,
            "choice": 1
        },
        {
            "text": "Confront Dr. Blight",
            "goto": 26,
            "choice": 2
        }
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 26,
    "choice": 1,
    "mode": "combat",
    "messages": [
        ENEMY_APPEARED_MESSAGE
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 26,
    "choice": 2,
    "mode": "story",
    "messages": [
        "The executive elevator opens to Dr. Blight's office - but it's empty.\n        A hidden door behind her desk leads to a secret laboratory."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 27,
    "mode": "story",
    "messages": [
        "You uncover schematics for something called \"Project Eclipse\" -\n        a massive device designed to accelerate climate change worldwide."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 28,
    "mode": "combat",
    "messages": [
        ENEMY_APPEARED_MESSAGE
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 29,
    "mode": "story",
    "messages": [
        "After defeating the robots, you find a map of corruption spreaders -\n        devices planted throughout the Scorched Plains that poison the land."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 30,
    "mode": "decision",
    "messages": [
        "You can't disable all the spreaders before Project Eclipse activates.\n        You must choose: Disable the spreaders to save this region, or push\n        forward to stop Project Eclipse and save the world."
    ],
    "options": [
        {
            "text": "Save the local region",
            "goto": 31,
            "choice": 1
        },
        {
            "text": "Stop Project Eclipse",
            "goto": 31,
            "choice": 2
        }
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 31,
    "choice": 1,
    "mode": "story",
    "messages": [
        "You race across the Scorched Plains, disabling corruption spreaders.\n        With each one destroyed, you feel the land begin to heal."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 31,
    "choice": 2,
    "mode": "story",
    "messages": [
        "You press deeper into the facility, knowing the region will suffer\n        but determined to prevent global catastrophe."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 32,
    "mode": "combat",
    "messages": [
        ENEMY_APPEARED_MESSAGE
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 33,
    "mode": "story",
    "messages": [
        "Beyond the serpent's chamber, you find a massive underground cavern.\n        Pipes feed pollution directly into the earth's crust."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 34,
    "mode": "decision",
    "messages": [
        "You detect unstable spirit energy below. You could:\n        Redirect the pollution into the facility's systems, or\n        try to contain the energy itself first."
    ],
    "options": [
        {
            "text": "Redirect pollution",
            "goto": 35,
            "choice": 1
        },
        {
            "text": "Contain spirit energy",
            "goto": 35,
            "choice": 2
        }
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 35,
    "choice": 1,
    "mode": "story",
    "messages": [
        "The facility's systems overload as pollution floods back through them.\n        Alarms blare as containment starts failing throughout the complex."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 35,
    "choice": 2,
    "mode": "combat",
    "messages": [
        "As you work to contain the spirit energy, Dr. Blight's elite guard attack!\n        These warriors are infused with concentrated corruption!"
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 36,
    "mode": "story",
    "messages": [
        "You've reached the lowest level. Here, ancient spirit wards have been\n        corrupted and reversed, actively pulling poison into the earth."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 37,
    "mode": "combat",
    "messages": [
        "The wards manifest as Corrupted Ward Guardians! These twisted spirits\n        attack with both elemental and pollution-based powers!"
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 40,
    "mode": "story",
    "messages": [
        "You've discovered the heart of the corruption - a massive spirit core,\n            stolen from the Earth itself. Its power is being perverted to fuel\n            Blight Corporation's operations worldwide."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 50,
    "mode": "combat",
    "messages": [
        "Dr. Blight merges with the corrupted spirit core, becoming a monstrous\n            manifestation of pollution and industrial might!"
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 60,
    "mode": "decision",
    "messages": [
        "The spirit core is unstable. You could attempt to purify it,\n            but the process might destroy everything nearby. Or try to contain it,\n            which is safer but may allow some corruption to survive."
    ],
    "options": [
        {
            "text": "Risk everything to purify it completely",
            "goto": 61,
            "choice": 1
        },
        {
            "text": "Contain and gradually cleanse it",
            "goto": 61,
            "choice": 2
        }
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 61,
    "choice": 1,
    "mode": "story",
    "messages": [
        "You channel all your power into the core. The purification releases\n            an explosion of pure spiritual energy, destroying the facility but\n            beginning an immediate restoration of the land!"
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 61,
    "choice": 2,
    "mode": "story",
    "messages": [
        "You create a containment field around the core. The land will take longer\n            to heal, but the process will be stable and lasting. New growth already\n            begins to emerge from the scorched earth."
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 62,
    "mode": "story",
    "messages": [
        "The spirits return, their power restored. \"You have done well, guardian.\n            But this is just one battle. Other lands cry out for healing, and\n            more corrupt corporations threaten the Earth's balance.\""
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 63,
    "mode": "decision",
    "messages": [
        "Will you continue your mission to heal the Earth?"
    ],
    "options": [
        {
            "text": "Yes, my journey is just beginning",
            "goto": 64,
            "choice": 1
        },
        {
            "text": "I need rest before the next battle",
            "goto": 64,
            "choice": 2
        }
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 64,
    "choice": 1,
    "mode": "end",
    "messages": [
        "Congratulations! You've completed the first chapter of EverLife.\n            The Scorched Plains begin to heal, but new adventures await in distant lands.\n            Thank you for playing!"
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 64,
    "choice": 2,
    "mode": "end",
    "messages": [
        "Congratulations! You've completed the first chapter of EverLife.\n            Rest well, guardian. The Earth will need your strength again soon.\n            Thank you for playing!"
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}, {
    "step": 70,
    "mode": "end",
    "messages": [
        GAME_OVER
    ],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": powers,
    "environmentStatus": 50,
    "currentEnemy": undefined
}]