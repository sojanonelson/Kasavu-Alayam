import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Import components and services
import Footer from '../components/Footer';
import SideContactNavbar from '../pages/sidecontactbar';
import EnhancedFeedbackSystem from '../components/EnhancedFeedbackSystem';
import HomePageSkeleton from './HomePageSkeleton';
import websiteSettingService from '../services/websiteSettingService';

// Import styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

// Import assets
import border1 from '../assets/elements/border2.png';
import border2 from '../assets/elements/border1.png';
import weddingSilksImage from '../assets/ka women-4.jpg';
import bridalBlouseSetsImage from '../assets/k-2.jpg';
import sareesImage from '../assets/ka women-1.webp';
import womensCollectionsImage from '../assets/ka women-2.webp';
import mensCollectionsImage from '../assets/ka men-1.webp';
import product1Image from '../assets/k-1.jpg';
import product2Image from '../assets/k-4.jpg';
import product3Image from '../assets/k-1.jpg';

// Configuration data
const DEFAULT_HERO_IMAGES = [
  {
    url: "https://kalyansilks.com/_next/image?url=https%3A%2F%2Fapi.kalyansilks.com%2Fmedia%2Fvegam%2Fhomepage%2Fimages%2F1920_x1040_-_Main_Banner_-_01_1.jpg&w=1920&q=75",
    title: "Traditional Wear",
    subtitle: "Celebrating heritage and culture"
  },
  {
    url: "https://kalyansilks.com/_next/image?url=https%3A%2F%2Fapi.kalyansilks.com%2Fmedia%2Fvegam%2Fhomepage%2Fimages%2F1920_x1040_-_Main_Banner_-_03_1.jpg&w=1920&q=75",
    title: "Festive Collection",
    subtitle: "Adorn yourself in ceremonial splendor"
  },
  {
    url: "https://www.tata.com/content/dam/tata/images/newsroom/business/desktop/taneira_traditional_crafts_banner_desktop_1920x1080.jpg",
    title: "Traditional Wear",
    subtitle: "Celebrating heritage and culture"
  }
];

const FEATURED_COLLECTIONS = [
  {
    title: "Wedding Silks",
    link: "/collections/textiles",
    image: weddingSilksImage
  },
  {
    title: "Bridal Blouse Sets",
    link: "/collections/womens",
    image: bridalBlouseSetsImage
  }
];

const CATEGORIES = [
  {
    title: "Sarees",
    img: sareesImage,
    link: "/collections/womens",
  },
  {
    title: "Women's Collections",
    img: womensCollectionsImage,
    link: "/collections/womens",
  },
  {
    title: "Men's Collections",
    img: mensCollectionsImage,
    link: "/collections/mens",
  }
];

const FEATURED_PRODUCTS = [
  { image: product1Image, name: "Traditional Saree", price: "₹3,200" },
  { image: product2Image, name: "Wedding Saree", price: "₹4,500" },
  { image: product3Image, name: "Silk Blend Saree", price: "₹3,800" }
];

// Custom hooks and helper components
const useScrolledState = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isScrolled;
};

const useCarouselImages = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await websiteSettingService.getCarouselImages();
        setCarouselImages(images);
      } catch (error) {
        console.error('Failed to fetch carousel images:', error);
        setCarouselImages(DEFAULT_HERO_IMAGES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  return { carouselImages, isLoading };
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.pageYOffset > 300);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      className="fixed bottom-4 right-2 z-50 md:bottom-6 md:right-4"
    >
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-8 h-8 bg-red-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white rounded-full"
        aria-label="Scroll to top"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

const HeroCarousel = ({ images, onSlideChange }) => {
  const swiperRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState({});

  const handleImageLoad = useCallback((index) => {
    setImagesLoaded(prev => ({ ...prev, [index]: true }));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (swiperRef.current?.swiper) {
        if (e.key === 'ArrowRight') swiperRef.current.swiper.slideNext();
        if (e.key === 'ArrowLeft') swiperRef.current.swiper.slidePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!images.length) {
    return (
      <div className="w-full lg:h-screen h-[60vh] bg-gray-200 flex items-center justify-center">
        <p className="custom-font">Kasavu Aalayam</p>
      </div>
    );
  }

  return (
    <section className="relative" aria-label="Featured collections carousel">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        pagination={{
          clickable: true,
          el: '.custom-pagination',
          bulletClass: 'custom-bullet',
          bulletActiveClass: 'custom-bullet-active',
          renderBullet: (index, className) =>
            `<span class="${className}" aria-label="Go to slide ${index + 1}"></span>`
        }}
        speed={1000}
        loop={true}
        className="w-full lg:h-screen"
        onSlideChange={onSlideChange}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full lg:h-screen overflow-hidden">
              <img
                src={img.url}
                alt={`${img.title || 'Carousel Image'} - ${img.subtitle || ''}`}
                className="w-full lg:h-full h-[60vh] object-cover"
                onLoad={() => handleImageLoad(`hero-${index}`)}
              />
              {!imagesLoaded[`hero-${index}`] && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/0 z-10" />
              <div className="absolute inset-0 flex flex-col justify-end items-center lg:pb-32 pb-[20%] text-center px-6 z-20">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="max-w-4xl"
                >
                  <h1 className="lg:text-5xl text-2xl md:text-6xl font-bold custom-font2 text-white lg:mb-4">
                    {img.title || 'Premium Collection'}
                  </h1>
                  <p className="lg:text-xl text-1xl text-white mb-8 poppins-regular">
                    {img.subtitle || 'Discover our exquisite range'}
                  </p>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="custom-pagination !bottom-12 md:bottom-0 pb-10" />
    </section>
  );
};

const RoundCollectionCard = ({ title, img, link, description, index, isCategory = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center group">
      <Link
        to={link}
        className="relative block w-64 h-64 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 mb-4"
        aria-label={`Browse ${title} collection`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: "pointer" }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-full">
          <img
            src={img}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered ? 'scale-110 brightness-90' : 'scale-100'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading={index < 3 ? "eager" : "lazy"}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300 animate-pulse rounded-full" />
          )}
        </div>
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-full transition-all duration-500 ${
          isHovered ? 'opacity-80' : 'opacity-40'
        }`} />
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
          <button
            className={
              `flex items-center gap-2 px-4 py-1 rounded-full bg-white/60
              backdrop-blur-[6px] border border-white/30 text-amber-900 font-medium text-sm
              shadow-md transition-all duration-300
              ${isHovered ? "bg-amber-400/80 text-white shadow-amber-100 scale-105" : ""}
              `
            }
            style={{
              boxShadow: isHovered
                ? "0 8px 24px 0 rgba(245, 158, 11, 0.18), 0 0 0 2px #f59e0b22"
                : "0 4px 12px 0 rgba(0,0,0,0.08)"
            }}
          >
            Explore
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </Link>
      <div className="text-center mt-2">
        <h3 className="text-xl font-bold text-gray-800 mb-1 poppins-regular">
          {title}
        </h3>
        <p className="text-gray-600 text-sm poppins-regular max-w-48 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const ProductShowcase = ({ products }) => (
  <div className="flex flex-row justify-center items-center pb-10 gap-5">
    {products.map((product, index) => (
      <div key={index} className="w-2/6 text-center cursor-pointer">
        <img
          className="w-full rounded-t-full object-cover"
          src={product.image}
          alt={product.name}
        />
        <p className="mt-2 font-semibold poppins-regular text-gray-700">{product.name}</p>
        <p className="text-gray-800 poppins-regular-bold font-medium">{product.price}</p>
      </div>
    ))}
  </div>
);

const AnimatedSection = ({ children, className, ...props }) => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 40 }}
      transition={{ duration: 0.7 }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
};

// Main Component
const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { carouselImages, isLoading } = useCarouselImages();
  const isScrolled = useScrolledState();

  const handleSlideChange = useCallback((swiper) => {
    setCurrentSlide(swiper.realIndex);
  }, []);

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="font-sans">
      <Helmet>
        <title>Kasavu Aalayam | Home of Traditional Indian Wear</title>
        <meta name="description" content="Discover the finest traditional Indian wear at Kasavu Aalayam. Explore premium silk sarees, ethnic wear collections for men and women, and exquisite bridal wear." />
        <meta name="keywords" content="kasavu, sarees, traditional wear, indian fashion, silk sarees, ethnic wear" />
        <link rel="canonical" href="https://kasavuaalayam.com" />
      </Helmet>

      <HeroCarousel images={carouselImages} onSlideChange={handleSlideChange} />

      <div className="flex justify-center items-center lg:pt-8 pt-8">
        <img draggable="false" src={border1} className="lg:h-20 h-10" alt="border lg:pt-8"/>
      </div>

      {/* Collections Section */}
      <AnimatedSection
        className="lg:py-16 py-6 px-6 md:px-20 bg-white"
        aria-labelledby="collections-heading"
      >
        <div className="text-center mb-8 font-playfair tracking-tight text-gray-900">
          <h2 id="collections-heading" className="text-4xl font-bold mb-6 font-serif tracking-tight">
            <span>Kasavu Aalayam Collections</span>
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 text-lg font-light font-serif leading-relaxed">
            Discover our curated collections of traditional and contemporary Indian wear,
            alongside our handpicked featured selections.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-start gap-8 lg:gap-12">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={`category-${index}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <RoundCollectionCard {...category} index={index} isCategory={true} />
            </motion.div>
          ))}
          {FEATURED_COLLECTIONS.map((collection, index) => (
            <motion.div
              key={`featured-${index}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (CATEGORIES.length + index) * 0.1 }}
            >
              <RoundCollectionCard {...collection} index={CATEGORIES.length + index} />
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      <SideContactNavbar />

      {/* Enhanced Feedback System with Pagination and Autoplay */}
      <div className="py-10 bg-gray-100">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          loop={true}
        >
          <SwiperSlide>
            <EnhancedFeedbackSystem />
          </SwiperSlide>
          {/* Add more SwiperSlides if you have multiple feedback sections */}
        </Swiper>
      </div>

      <ScrollToTopButton />
      <Footer />
    </div>
  );
};

export default HomePage;
