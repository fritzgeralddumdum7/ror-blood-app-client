import { Box } from "@mantine/core";
import BecomeSomething from "@/components/Home/BecomeSomething";
import Carousels from "@/components/Home/Carousels";

const Home = () => {
  const data = {
    carousels: [
      {
        src: '/images/slideshow-main-bg-1.jpg'
      },
      {
        src: '/images/slideshow-main-bg-2.jpg'
      },
      {
        src: '/images/slideshow-main-bg-3.jpg'
      }
    ]
  }

  return (
    <Box>
      <Carousels carousels={data.carousels} />
      <BecomeSomething />
    </Box>
  );
}

export default Home;
