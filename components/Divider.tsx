// CustomDivider.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Divider = ({ text }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', my: 4, width: '100%' }}>
      <Box sx={{ flexGrow: 1, height: '1px', background: 'linear-gradient(to right, transparent, gray)' }} />
      {text && (
        <Typography variant="h6" sx={{ mx: 2, whiteSpace: 'nowrap' }}>
          {text}
        </Typography>
      )}
      <Box sx={{ flexGrow: 1, height: '1px', background: 'linear-gradient(to right, gray, transparent)' }} />
    </Box>
  );
};

export default Divider;
