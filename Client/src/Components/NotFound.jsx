import React from 'react';
import { Box, Typography } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import BrokenHeartIcon from '@mui/icons-material/HeartBroken'; // optional ❤️‍🩹

const NotFound = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#fef2f2',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Box
        sx={{
          fontSize: 100,
          animation: 'shake 1.5s infinite',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#ff6b6b',
        }}
      >
        <SentimentVeryDissatisfiedIcon sx={{ fontSize: 100 }} />
        <BrokenHeartIcon sx={{ fontSize: 80, ml: 1 }} />
      </Box>

      <Typography variant="h3" fontWeight="bold" mt={2} color="error">
        404 - Not Found
      </Typography>

      <Typography variant="h6" color="text.secondary" mt={1}>
        Uh-oh! The page you're looking for doesn't exist 💔
      </Typography>

      <style>
        {`
          @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default NotFound;
