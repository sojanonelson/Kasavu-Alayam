import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import ScrolledNavbar from '../components/ScrolledNavbar';
import Footer from '../components/Footer';
import { useInView } from 'react-intersection-observer';
import SideContactNavbar from '../pages/sidecontactbar';
import border1 from '../assets/elements/border2.png';
import border2 from '../assets/elements/border1.png';
import CheckoutCart from './CheckoutCart';
import EnhancedFeedbackSystem from '../components/EnhancedFeedbackSystem';
import HomePageSkeleton from './HomePageSkeleton';
import websiteSettingService from '../services/websiteSettingService';

// Import images
import weddingSilksImage from '../assets/ka women-4.jpg';
import bridalBlouseSetsImage from '../assets/k-2.jpg';
import festivalPicksImage from '../assets/ka men-2.webp';
import sareesImage from '../assets/ka women-1.webp';
import womensCollectionsImage from '../assets/ka women-2.webp';
import mensCollectionsImage from '../assets/ka men-1.webp';
import product1Image from '../assets/k-1.jpg';
import product2Image from '../assets/k-4.jpg';
import product3Image from '../assets/k-1.jpg';

const heroImages = [
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

const featuredCollections = [
  {
    title: "Wedding Silks",
    description: "Exquisite silk sarees and attire for your special day",
    link: "/featured/wedding",
    image: weddingSilksImage
  },
  {
    title: "Bridal Blouse Sets",
    description: "Intricately designed blouses to complement your sarees",
    link: "/featured/blouse-sets",
    image: bridalBlouseSetsImage
  },
  {
    title: "Festival Picks",
    description: "Vibrant collections for all your celebration needs",
    link: "/featured/festive",
    image: festivalPicksImage
  }
];

const categories = [
  {
    title: "Sarees",
    img: sareesImage,
    link: "/sarees",
    description: "Traditional and contemporary sarees for every occasion"
  },
  {
    title: "Women's Collections",
    img: womensCollectionsImage,
    link: "/womens",
    description: "Kurtas, salwars, lehengas and more"
  },
  {
    title: "Men's Collections",
    img: mensCollectionsImage,
    link: "/mens",
    description: "Traditional and fusion wear for the modern man"
  }
];

const FeaturedCard = ({ title, description, link, image }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={link}
      className="block overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 h-96 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full w-full">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 filter brightness-90' : 'scale-100'}`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-70'}`} />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <div className="mb-2 relative">
            <h3 className={`text-2xl font-bold mb-2 transition-all duration-500 ${isHovered ? 'text-amber-300' : 'text-white'}`}>
              {title}
            </h3>
            <div className={`h-0.5 bg-amber-400 transition-all duration-500 ease-in-out ${isHovered ? 'w-24' : 'w-10'}`} />
          </div>
          <p className={`text-white/90 mb-6 transition-all duration-500 line-clamp-2 ${isHovered ? 'opacity-100' : 'opacity-70'}`}>
            {description}
          </p>
          <div className={`flex items-center font-medium transition-all duration-500 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
            <span className="py-2 px-4 bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors duration-300 text-white flex items-center gap-2">
              View Collection
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
        className="w-8 h-8 bg-red-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white"
        aria-label="Scroll to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
    </motion.div>
  );
};


const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [carouselImages, setCarouselImages] = useState([]);

  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const images = await websiteSettingService.getCarouselImages();
        setCarouselImages(images);
      } catch (error) {
        console.error('Failed to fetch carousel images:', error);
        setCarouselImages(heroImages);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarouselImages();
  }, []);

  const [categoriesRef, categoriesInView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const [featuredRef, featuredInView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const [aboutRef, aboutInView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const handleSlideChange = useCallback((swiper) => {
    setCurrentSlide(swiper.realIndex);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const [imagesLoaded, setImagesLoaded] = useState({});

  const handleImageLoad = useCallback((index) => {
    setImagesLoaded(prev => ({ ...prev, [index]: true }));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (swiperRef.current && swiperRef.current.swiper) {
        if (e.key === 'ArrowRight') {
          swiperRef.current.swiper.slideNext();
        } else if (e.key === 'ArrowLeft') {
          swiperRef.current.swiper.slidePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

      <section className="relative" aria-label="Featured collections carousel">
        {carouselImages.length > 0 ? (
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
              renderBullet: (index, className) => {
                return `<span class="${className}" aria-label="Go to slide ${index + 1}"></span>`;
              }
            }}
            speed={1000}
            loop={true}
            spaceBetween={0}
            slidesPerView={1}
            className="w-full lg:h-screen"
            onSlideChange={handleSlideChange}
          >
            {carouselImages.map((img, index) => (
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
                      animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 30 }}
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
        ) : (
          <div className="w-full lg:h-screen h-[60vh] bg-gray-200 flex items-center justify-center">
            <p className='custom-font'>Kasavu Aalayam</p>
          </div>
        )}
        <div className="custom-pagination !bottom-12 md:bottom-0 pb-10" />
      </section>

      <div className='flex justify-center items-center lg:pt-10 pt-10'>
        <img draggable="false" src={border1} className='lg:h-16 h-10' alt='border' />
      </div>

      <section
        ref={categoriesRef}
        className="lg:py-16 py-4 px-6 md:px-20 bg-white"
        aria-labelledby="categories-heading"
      >
        <motion.div>
          <h2 id="categories-heading" className="text-4xl font-semibold cutsom-font2 text-center mb-3 poppins-regular">Our Collections</h2>
          <p className="text-center text-gray-600 max-w-2xl text-xs lg:text-lg mx-auto mb-12">Discover our curated collections of traditional and contemporary Indian wear</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: categoriesInView ? 1 : 0, y: categoriesInView ? 0 : 30 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <CategoryCard
                  title={category.title}
                  img={category.img}
                  link={category.link}
                  description={category.description}
                  index={index}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <SideContactNavbar />

      <section
        ref={aboutRef}
        className="bg-white py-20 px-6 md:px-20"
        aria-labelledby="about-heading"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: aboutInView ? 1 : 0, y: aboutInView ? 0 : 40 }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 id="about-heading" className="text-3xl poppins-bold mb-6">A Legacy of Tradition</h2>
          <div className="flex flex-row justify-center items-center pb-10 gap-5">
            <div className="w-2/6 text-center cursor-pointer">
              <img
                className="w-full rounded-t-full object-cover"
                src={product1Image}
                alt="Traditional Saree"
              />
              <p className="mt-2 font-semibold poppins-regular text-gray-700">Traditional Saree</p>
              <p className="text-gray-800 poppins-regular-bold font-medium">₹3,200</p>
            </div>
            <div className="w-2/6 text-center cursor-pointer">
              <img
                className="w-full rounded-t-full object-cover"
                src={product2Image}
                alt="Wedding Saree"
              />
              <p className="mt-2 font-semibold poppins-regular text-gray-700">Wedding Saree</p>
              <p className="text-gray-800 poppins-regular-bold font-medium">₹4,500</p>
            </div>
            <div className="w-2/6 text-center cursor-pointer">
              <img
                className="w-full rounded-t-full object-cover"
                src={product3Image}
                alt="Silk Blend Saree"
              />
              <p className="mt-2 font-semibold poppins-regular text-gray-700">Silk Blend Saree</p>
              <p className="text-gray-800 poppins-regular-bold font-medium">₹3,800</p>
            </div>
          </div>
          <div className='flex justify-center select-none my-16 pt-10 items-center'>
            <img src={border2} className='h-16' alt='border' draggable="false" />
          </div>
        </motion.div>
      </section>

      <section
        ref={featuredRef}
        className="py-6 px-6 md:px-20 bg-gradient-to-b from-white to-amber-50"
        aria-labelledby="featured-heading"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: featuredInView ? 1 : 0, y: featuredInView ? 0 : 40 }}
          transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16 relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 w-20 h-1 bg-amber-300"></div>
            <h2 id="featured-heading" className="text-4xl font-semibold mb-4 poppins-regular pt-2 relative inline-block">
              Featured Collections
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-amber-400"></div>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4 poppins-regular">
              Handpicked selections for every occasion, crafted with love and tradition
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCollections.map((collection, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: featuredInView ? 1 : 0, y: featuredInView ? 0 : 30 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <FeaturedCard
                  title={collection.title}
                  description={collection.description}
                  link={collection.link}
                  image={collection.image}
                />
              </motion.div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link to="/collections" className="inline-flex items-center gap-2 px-8 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors duration-300 shadow-md hover:shadow-lg">
              <span className="font-medium">Explore All Collections</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </section>

      <ScrollToTopButton />
      <EnhancedFeedbackSystem />
      <Footer />
    </div>
  );
};

const CategoryCard = ({ title, img, link, description, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  let imageRounded = '';

  if (index === 0) {
    imageRounded = 'lg:rounded-tl-2xl lg:rounded-bl-2xl';
  } else if (index === 2) {
    imageRounded = 'lg:rounded-tr-2xl lg:rounded-br-2xl';
  }

  return (
    <Link
      to={link}
      className={`group relative block h-[28rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${imageRounded}`}
      aria-label={`Browse ${title} collection`}
    >
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={img}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105`}
          onLoad={() => setImageLoaded(true)}
          loading={index < 3 ? "eager" : "lazy"}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300 animate-pulse" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent opacity-90 group-hover:from-black/90 transition-all duration-500" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <div className="mb-3 relative">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 transform group-hover:translate-x-2 transition-transform duration-300">
            {title}
          </h3>
          <div className="w-12 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100" />
        </div>
        <p className="text-white/90 poppins-regular text-sm md:text-base mb-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
          {description}
        </p>
        <button
          className="self-start flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 delay-150"
          aria-hidden="true"
        >
          <span className="font-medium text-sm">Explore</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200" />
    </Link>
  );
};

export default HomePage;
