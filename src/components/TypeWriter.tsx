import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { ENEMY_APPEARED_MESSAGE, GAME_OVER } from '../game/states';

interface TypeWriterProps {
  text: string;
  delay?: number;
}

const redMessages: string[] = [GAME_OVER, ENEMY_APPEARED_MESSAGE];

const TypeWriter: React.FC<TypeWriterProps> = ({ text, delay = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, delay, text]);

  return (
    <Typography sx={{ mb: 1, borderLeft: '3px solid #4CAF50', pl: 2, color: redMessages.includes(text) ? 'red' : undefined, fontWeight: redMessages.includes(text) ? 'bold' : undefined }}>
      {displayText}
    </Typography>
  );
};

export default TypeWriter;