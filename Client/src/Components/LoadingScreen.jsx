import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';
import logo from '../assets/logo.png'; // adjust path if needed

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 150,
          height: 150,
          borderRadius: '50%',
          border: '6px solid transparent',
          borderTopColor: '#4e54c8',
          borderRightColor: '#8f94fb',
          animation: `${rotate} 1.5s linear infinite`,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: '#fff',
            padding: 1,
          }}
        />
      </Box>
    </Box>
  );
};

export default LoadingScreen;
