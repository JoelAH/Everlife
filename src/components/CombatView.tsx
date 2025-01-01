import React from 'react';
import { Box, Paper, Typography, Button, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Enemy, ElementalPower, PlayerStats } from '../game/types';

interface CombatViewProps {
  enemy: Enemy;
  player: PlayerStats;
  powers: ElementalPower[];
  onUsePower: (power: ElementalPower) => void;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#2a2a2a',
  color: '#ffffff',
  border: '1px solid #4CAF50',
}));

const CombatButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderColor: '#4CAF50',
  color: '#4CAF50',
  '&:hover': {
    borderColor: '#45a049',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  '&.Mui-disabled': {
    borderColor: '#666',
    color: '#666',
  },
}));

const HealthBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#4CAF50',
  },
}));

const EnergyBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#2196F3',
  },
}));

const CombatView: React.FC<CombatViewProps> = ({ enemy, player, powers, onUsePower }) => {
  return (
    <Box>
      <StyledPaper elevation={3}>
        {/* Enemy Stats */}
        <Typography variant="h5" color="error" gutterBottom>
          {enemy.name}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {enemy.description}
        </Typography>
        <Typography>
          HP: {enemy.health}/{enemy.maxHealth}
        </Typography>
        <HealthBar
          variant="determinate"
          value={(enemy.health / enemy.maxHealth) * 100}
        />

        {/* Player Stats */}
        <Typography variant="h5" color="primary" gutterBottom sx={{ mt: 3 }}>
          Your Status
        </Typography>
        <Typography>
          HP: {player.health}/{player.maxHealth}
        </Typography>
        <HealthBar
          variant="determinate"
          value={(player.health / player.maxHealth) * 100}
        />
        <Typography>
          Energy: {player.energy}/{player.maxEnergy}
        </Typography>
        <EnergyBar
          variant="determinate"
          value={(player.energy / player.maxEnergy) * 100}
        />

        {/* Combat Actions */}
        <Typography variant="h6" color="primary" sx={{ mt: 3, mb: 2 }}>
          Available Powers
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {powers.map((power) => (
            <CombatButton
              key={power.name}
              variant="outlined"
              onClick={() => onUsePower(power)}
              disabled={player.energy < power.energyCost}
            >
              {power.name} ({power.energyCost} Energy)
            </CombatButton>
          ))}
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default CombatView;