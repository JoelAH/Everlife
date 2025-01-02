import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Grid } from '@mui/material';
import TypeWriter from './TypeWriter';
import { styled } from '@mui/material/styles';
import { GameState, ElementalPower } from '../game/types';
import { processCommand, locations } from '../game/gameLogic';
import { processCombatTurn, isCombatOver } from '../game/combat';
import CombatView from './CombatView';
import logo from '../assets/logo.png'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  border: '1px solid #4CAF50',
}));

const MessageBox = styled(Box)(({ theme }) => ({
  height: '400px',
  overflowY: 'auto',
  padding: theme.spacing(2),
  backgroundColor: '#2a2a2a',
  marginBottom: theme.spacing(2),
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#1a1a1a',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#4CAF50',
    borderRadius: '4px',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderColor: '#4CAF50',
  color: '#4CAF50',
  '&:hover': {
    borderColor: '#45a049',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
}));

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
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
  });

  const handleUsePower = (power: ElementalPower) => {
    if (!gameState.currentEnemy || gameState.mode !== 'combat') return;

    const { updatedPlayer, updatedEnemy, turnMessages } = processCombatTurn(
      power,
      gameState.playerStats,
      gameState.currentEnemy
    );

    const combatOver = isCombatOver(updatedPlayer, updatedEnemy);
    
    setGameState((prevState) => ({
      ...prevState,
      mode: combatOver ? 'exploration' : 'combat',
      currentEnemy: combatOver ? undefined : updatedEnemy,
      playerStats: updatedPlayer,
      messages: [...prevState.messages, ...turnMessages]
    }));
  };

  const handleAction = (action: string, target?: string) => {
    const command = target ? `${action} ${target}` : action;
    const newState = processCommand(command, gameState);
    setGameState(newState);
  };

  const currentLocation = gameState.currentLocation;

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <StyledPaper elevation={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <img src={logo} width={'150px'} />
          </Grid>
          
          {gameState.mode === 'combat' && gameState.currentEnemy && (
            <Grid item xs={12}>
              <CombatView
                enemy={gameState.currentEnemy}
                player={gameState.playerStats}
                powers={gameState.elementalPowers}
                onUsePower={handleUsePower}
              />
            </Grid>
          )}
          
          <Grid item xs={12} md={8}>
            <MessageBox>
              {gameState.messages.map((message, index) => (
                <TypeWriter key={index} text={message} delay={30} />
              ))}
            </MessageBox>
            
            <Paper sx={{ p: 2, backgroundColor: '#2a2a2a' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Actions
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <ActionButton variant="outlined" onClick={() => handleAction('look')}>
                  Look Around
                </ActionButton>
                <ActionButton variant="outlined" onClick={() => handleAction('status')}>
                  Check Status
                </ActionButton>
                {gameState.elementalPowers.map((power) => (
                  <ActionButton
                    key={power.name}
                    variant="outlined"
                    onClick={() => handleUsePower(power)}
                  >
                    Use {power.name}
                  </ActionButton>
                ))}
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, backgroundColor: '#2a2a2a', color: '#fff' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Status
              </Typography>
              <Typography>Location: {currentLocation}</Typography>
              <Typography>Health: {gameState.playerStats.health}/{gameState.playerStats.maxHealth}</Typography>
              <Typography>Energy: {gameState.playerStats.energy}/{gameState.playerStats.maxEnergy}</Typography>
              <Typography>Level: {gameState.playerStats.level}</Typography>
              <Typography>Experience: {gameState.playerStats.experience}</Typography>
              <Typography>Earth's Health: {gameState.environmentStatus}%</Typography>
              
              <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                Available Exits
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {locations[currentLocation]?.exits.map((exit: any) => (
                  <ActionButton
                    key={exit}
                    variant="outlined"
                    size="small"
                    onClick={() => handleAction('go', exit)}
                  >
                    Go to {exit}
                  </ActionButton>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </StyledPaper>
    </Box>
  );
};



export default GameContainer;