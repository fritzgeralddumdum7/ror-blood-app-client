import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import CarouselItem from '@/components/Home/CarouselItem';

const Carousels = ({ carousels }) => {
  return (
    <Carousel
      showThumbs={false}
      autoPlay={true}
      infiniteLoop={true}
      showStatus={false}
    >
      {
        carousels.map((item, i) => <CarouselItem src={item.src} key={i} />)
      }
    </Carousel>
  );
};

export default Carousels;
