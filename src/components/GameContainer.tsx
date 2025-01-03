import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Grid } from '@mui/material';
import TypeWriter from './TypeWriter';
import { styled } from '@mui/material/styles';
import { GameState, ElementalPower } from '../game/types';
import { processCommand } from '../game/gameLogic';
import { processCombatTurn, isCombatOver } from '../game/combat';
import CombatView from './CombatView';
import logo from '../assets/logo.png'
import { GAME_STATE } from '../game/states';

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
  const [gameState, setGameState] = useState<GameState>(GAME_STATE[0]);

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
    <Box sx={{ width: 1200, margin: '0 auto', padding: 3 }}>
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
                {
                  gameState.mode === 'combat' && gameState.currentEnemy ? (
                    <>
                      {gameState.elementalPowers.map((power) => (
                        <ActionButton
                          key={power.name}
                          variant="outlined"
                          onClick={() => handleUsePower(power)}
                        >
                          Use {power.name}
                        </ActionButton>
                      ))}
                      <ActionButton variant="outlined" onClick={() => handleAction('meditate')}>
                        Meditate
                      </ActionButton>
                    </>
                  ) : (
                    <>
                      <ActionButton variant="outlined" onClick={() => handleAction('forward')}>
                        Go Forward
                      </ActionButton>
                    </>
                  )
                }
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
            </Paper>
          </Grid>
        </Grid>
      </StyledPaper>
    </Box>
  );
};



export default GameContainer;