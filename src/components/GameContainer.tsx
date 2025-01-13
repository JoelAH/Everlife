import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, Button, Grid, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import TypeWriter from './TypeWriter';
import { styled } from '@mui/material/styles';
import { BoxOwnProps } from '@mui/system';
import { GameState, ElementalPower, Enemy } from '../game/types';
import { processCommand } from '../game/gameLogic';
import { processCombatTurn, isCombatOver, generateEnemyEncounter } from '../game/combat';
import CombatView from './CombatView';
import logo from '../assets/logo.png'
import char from '../assets/char.png';
import { FILE_URL, getSavedState, getStates, loginUser, savedData } from '../services/services';
import { defaultPlayerStats } from '../game/states';

interface MessageBoxProps extends BoxOwnProps {
  gameState?: GameState;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  border: '1px solid #4CAF50',
}));

const audio = new Audio();

const MessageBox = styled(Box)<MessageBoxProps>(({ theme, gameState }) => ({
  className: 'message-box',
  height: gameState?.mode === 'combat' ? '200px' : '400px',
  overflowY: 'auto',
  padding: theme.spacing(2),
  backgroundColor: '#2a2a2a',
  marginBottom: gameState?.mode === 'combat' ? 0 : theme.spacing(2),
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

let enemies: Enemy[] = [];
let gameStates: GameState[] = [];

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    "step": 1,
    "mode": "story",
    "messages": [],
    "currentLocation": "Scorched Plains Entry",
    "playerStats": defaultPlayerStats,
    "inventory": [],
    "elementalPowers": [],
    "environmentStatus": 50,
    "currentEnemy": undefined
  });
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [token, setToken] = useState<string>(localStorage.getItem('token') || '');
  const [savedEmail, setSavedEmail] = useState<string>(localStorage.getItem('savedEmail') || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [gameInit, setGameInit] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    getStates()
      .then((data) => {
        enemies = data.enemies;
        if (data.gameStates?.length) {
          for (const state of data.gameStates) {
            gameStates.push(
              {
                ...state,
                messages: JSON.parse(state.messages as string),
                options: state.options ? JSON.parse(state.options as string) : undefined,
                playerStats: defaultPlayerStats,
                environmentStatus: 50,
                currentEnemy: undefined,
                inventory: [],
                elementalPowers: data.powers
              }
            )
          }
        }

        getSavedState()
          .then((data) => {
            if (data) {
              setGameState(JSON.parse(data) as GameState);
              setGameInit(true);
            } else if (enemies?.length && gameStates?.length) {
              setGameState(gameStates[0]);
              setGameInit(true);
            }
          })
          .catch((err) => {
            console.log(err);
            alert('Error loading saved state');
          });


      })
      .catch((err) => {
        console.log(err);
        alert('Error loading game state');
      });
  }, []);

  useEffect(() => {
    handleScroll();
  }, [gameState]);

  const handleUsePower = (power: ElementalPower) => {
    if (!gameState.currentEnemy || gameState.mode !== 'combat') return;

    const { updatedPlayer, updatedEnemy, turnMessages, environment } = processCombatTurn(
      power,
      gameState.playerStats || {
        health: 100,
        maxHealth: 100,
        energy: 100,
        maxEnergy: 100,
        experience: 0,
        harmony: 70
      },
      gameState.currentEnemy,
      gameState.environmentStatus
    );

    const combatOver = isCombatOver(updatedPlayer, updatedEnemy);
    handleScroll();
    if (updatedPlayer.health <= 0) {
      const state = gameStates.find(s => s.step === 70);
      if (state) {
        setGameState((prevState) => ({
          ...state,
          environmentStatus: prevState.environmentStatus,
          currentEnemy: undefined,
          playerStats: prevState.playerStats,
          messages: [...prevState.messages, ...state.messages]
        }));
        playAudio(state);
      }
    } else {
      setGameState((prevState) => ({
        ...prevState,
        environmentStatus: environment ? environment : prevState.environmentStatus,
        mode: combatOver ? 'story' : 'combat',
        currentEnemy: combatOver ? undefined : updatedEnemy,
        playerStats: updatedPlayer,
        messages: [...prevState.messages, ...turnMessages]
      }));
    }
  };

  const handleAction = (action: string, target?: string) => {
    const command = target ? `${action} ${target}` : action;
    const newState = processCommand(command, gameState, gameStates, enemies);
    setGameState(newState);
    savedData(newState, gameStates);
    try {
      console.log('sound', `${FILE_URL}/step${newState.step}${newState.choice ? `-${newState.choice}` : ''}.mp3`)
      audio.src = `${FILE_URL}/step${newState.step}${newState.choice ? `-${newState.choice}` : ''}.mp3`;
      if(audio.paused || audio.currentTime <= 0 || audio.ended) {
        audio.play();
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  const handleDecision = (goto: number, choice?: number) => {
    const state = gameStates.find(s => s.step === goto && (!choice || choice === s.choice));
    if (!state) return;
    let enemy: Enemy | null = null;
    if (state.mode === 'combat') {
      enemy = generateEnemyEncounter(enemies, state.currentEnemyType);
    }
    setGameState((prevState) => ({
      ...prevState,
      step: state.step,
      mode: state.mode,
      currentEnemy: enemy === null ? undefined : enemy,
      messages: [...prevState.messages, ...state.messages]
    }));
    playAudio(state);
  }

  const playAudio = (state: GameState) => {
    try {
      audio.src = `${FILE_URL}/step${state.step}${state.choice ? `-${state.choice}` : ''}.mp3`;
      if(audio.paused || audio.currentTime <= 0 || audio.ended) {
        audio.play();
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  const currentLocation = gameState.currentLocation;

  return (
    <Box sx={{
      width: '100%',
      margin: '0 auto',
      padding: { xs: 1, sm: 2, md: 3 },
    }}>
      <StyledPaper elevation={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <img src={logo} width={'150px'} />
          </Grid>

          <Grid item xs={12} lg={8}>
            {
              !gameInit && (
                <div>Loading game...</div>
              )
            }
            <MessageBox ref={scrollRef} gameState={gameState}>
              {gameState.messages.map((message, index) => (
                <TypeWriter key={index} text={message} delay={30} />
              ))}
            </MessageBox>

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
            {
              gameState.mode !== 'combat' && gameState.mode != 'end' && (
                <Paper sx={{ p: 2, backgroundColor: '#2a2a2a' }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Actions
                  </Typography>

                  <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                  }}>

                    {
                      gameState.mode !== 'decision' && gameInit && (
                        <>
                          <ActionButton variant="outlined" onClick={() => handleAction('forward')}>
                            Go Forward
                          </ActionButton>
                        </>
                      )
                    }

                    {
                      gameState.mode === 'decision' && (
                        gameState.options?.map((option, index) => (
                          <ActionButton key={index} variant="outlined" onClick={() => handleDecision(option.goto, option.choice)}>
                            {option.text}
                          </ActionButton>
                        )
                        )
                      )
                    }

                  </Box>
                </Paper>
              )
            }
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 2, backgroundColor: '#2a2a2a', color: '#fff' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Status
              </Typography>
              <Typography>Location: {currentLocation}</Typography>
              <Typography>Health: {gameState.playerStats.health}/{gameState.playerStats.maxHealth}</Typography>
              <Typography>Energy: {gameState.playerStats.energy}/{gameState.playerStats.maxEnergy}</Typography>
              <Typography>Earth's Health: {gameState.environmentStatus}%</Typography>
            </Paper>
            <Paper sx={{ p: 2, backgroundColor: '#2a2a2a', color: '#fff' }}>
              <img src={char} width={'100px'} />
            </Paper>
            {
              !!token ? (
                <div>Signed in as {savedEmail}</div>
              ) : (
                <Paper sx={{ p: 2, backgroundColor: '#2a2a2a', color: '#fff' }}>
                  <Typography sx={{ color: 'green' }}>Sign Up/In to save progress</Typography>
                  <div>
                    <TextField
                      id="email"
                      type='email'
                      label="Email"
                      variant="filled"
                      sx={{ width: '100%' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} />
                    <TextField
                      id="password"
                      type='password'
                      label="Password"
                      variant="filled"
                      sx={{ width: '100%' }}
                      placeholder='max 6 characters'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} />
                    <LoadingButton
                      loading={loading}
                      variant="contained"
                      onClick={() => {
                        setLoading(true);
                        loginUser({ email, password })
                          .then((success) => {
                            if (success) {
                              setToken(localStorage.getItem('token') || '');
                              setSavedEmail(localStorage.getItem('savedEmail') || '');
                            }
                            setLoading(false);
                          })
                          .catch(() => {
                            setLoading(false);
                            alert('Something went wrong trying to login')
                          });
                      }}>
                      Continue
                    </LoadingButton>
                  </div>
                </Paper>
              )
            }
          </Grid>
        </Grid>
      </StyledPaper>
    </Box>
  );
};



export default GameContainer;