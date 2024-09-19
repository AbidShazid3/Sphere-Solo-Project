// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Slide from './Slide';
import img1 from "../../assets/images/carousel1.jpg"
import img2 from "../../assets/images/carousel2.jpg"
import img3 from "../../assets/images/carousel3.jpg"
const Slider = () => {


    return (
        <div className='container py-3 mx-auto'>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                loop={true}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                <SwiperSlide><Slide image={img1} text={"Get Your Web Development Projects Done in minutes"} /></SwiperSlide>
                <SwiperSlide><Slide image={img2} text={"Get Your Graphics Design Projects Done in minutes"} /></SwiperSlide>
                <SwiperSlide><Slide image={img3} text={"Start Your Digital Marketing Campaigns up n running"}/></SwiperSlide>
            </Swiper>
        </div>
    );
};

export default Slider;