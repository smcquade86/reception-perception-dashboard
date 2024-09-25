import React from 'react';
import { Box, BoxProps } from '@mui/material';

const CustomScrollbarBox: React.FC<BoxProps> = (props) => {
  return (
    <Box
      {...props}
      sx={{
        ...props.sx,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '0.4em',
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.1)',
          outline: '1px solid slategrey',
        },
      }}
    >
      {props.children}
    </Box>
  );
};

export default CustomScrollbarBox;