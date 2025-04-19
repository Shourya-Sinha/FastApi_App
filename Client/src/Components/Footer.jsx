import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1c1c1c',
        color: '#ffffff',
        py: 2,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="body2">
              © Quicksolve.tech | Owner: Shourya
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">
              Copyright © {year}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
