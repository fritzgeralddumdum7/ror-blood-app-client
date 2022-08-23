import { Box, Image } from '@mantine/core';

const CarouselItem = ({ src }) => {
  return (
    <Box>
      <Image src={src} />
    </Box>
  );
};

export default CarouselItem;
