import { Enemy, ElementalPower, PlayerStats } from './types';

// Utility function to calculate damage with elemental effectiveness
export const calculateDamage = (power: ElementalPower, enemy: Enemy): number => {
  let multiplier = 1;

  // Enhanced damage against certain enemy types
  if (power.element === 'water' && enemy.type === 'fire') multiplier = 2;
  if (power.element === 'earth' && enemy.type === 'pollution') multiplier = 1.5;
  if (power.element === 'wind' && enemy.type === 'corruption') multiplier = 1.5;
  if (power.element === 'fire' && enemy.type === 'machine') multiplier = 2;

  return power.damage * multiplier;
};

// Process a combat turn when player uses a power
export const processCombatTurn = (
  power: ElementalPower,
  player: PlayerStats,
  enemy: Enemy
): {
  updatedPlayer: PlayerStats;
  updatedEnemy: Enemy;
  turnMessages: string[];
} => {
  const turnMessages: string[] = [];
  const updatedPlayer = { ...player };
  const updatedEnemy = { ...enemy };

  // Check if player has enough energy
  if (updatedPlayer.energy < power.energyCost) {
    turnMessages.push("Not enough energy to use this power!");
    return { updatedPlayer, updatedEnemy, turnMessages };
  }

  // Calculate and apply effects
  updatedPlayer.energy -= power.energyCost;

  // Handle healing powers
  let damage = 0;
  if (power.name === "Healing Rain") {
    const healing = 20;
    updatedPlayer.health = Math.min(updatedPlayer.maxHealth, updatedPlayer.health + healing);
    turnMessages.push(`Healing Rain restores ${healing} HP!`);
  } else if (power.name === "Earth Shield") {
    // Reduce incoming damage for this turn
    enemy.attack = Math.floor(enemy.attack * 0.5);
    turnMessages.push("Earth Shield reduces incoming damage!");
  } else if (power.name === 'Re-energize') {
    // no damage or energy lost. Just recharge energy
    const energize = 20;
    updatedPlayer.energy = Math.min(updatedPlayer.maxEnergy, updatedPlayer.energy + energize);
    turnMessages.push(`Re-energize restores ${energize} energy!`);
  } else {
    // Calculate and apply damage for offensive powers
    damage = calculateDamage(power, enemy);
    updatedEnemy.health = Math.max(0, updatedEnemy.health - damage);
  }

  turnMessages.push(
    `You use ${power.name}! It deals ${damage} damage to ${enemy.name}.`
  );

  // Enemy counter-attack if still alive
  if (updatedEnemy.health > 0) {
    updatedPlayer.health = Math.max(0, updatedPlayer.health - enemy.attack);
    turnMessages.push(
      `${enemy.name} counter-attacks, dealing ${enemy.attack} damage!`
    );
  } else {
    turnMessages.push(`${enemy.name} is defeated!`);
    updatedPlayer.experience += enemy.experience;
  }

  return { updatedPlayer, updatedEnemy, turnMessages };
};

// Check if combat should end
export const isCombatOver = (player: PlayerStats, enemy: Enemy): boolean => {
  return player.health <= 0 || enemy.health <= 0;
};

// Generate random enemy encounter based on location
export const generateEnemyEncounter = (enemies: Enemy[], force?: boolean): Enemy | null => {
  // 30% chance of enemy encounter
  if (!force && Math.random() > 0.3) return null;

  const randomIndex = Math.floor(Math.random() * enemies.length);
  return { ...enemies[randomIndex] }; // Return a copy of the enemy
};