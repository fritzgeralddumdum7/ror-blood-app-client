import {
  MantineProvider,
  Box
} from '@mantine/core';

const theme = {
  fontFamily: 'Mark Pro, sans-serif',
  colors: {
    'red-theme': [
      '#b2141a',
      '#b2141a',
      '#b2141a',
      '#b2141a',
      '#b2141a',
      '#b2141a', // input border
      '#E11B22', // button bg
      '#b2141a', // href
      '#b2141a',
      '#B0DC90', // hover
    ],
  },
  primaryColor: 'red-theme',
};

const Main = ({ children, meta }) => {
  return (
    <MantineProvider>
      <Box>
        {meta}
        <Box>{children}</Box>
      </Box>
    </MantineProvider>
  )
};

export default Main;
