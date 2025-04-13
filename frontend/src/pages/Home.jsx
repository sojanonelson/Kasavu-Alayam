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

const heroImages = [
  {
    url: "https://kalyansilks.com/_next/image?url=https%3A%2F%2Fapi.kalyansilks.com%2Fmedia%2Fvegam%2Fhomepage%2Fimages%2FDesktop_Banner-_1920_x_1040_px_1.jpg&w=1920&q=75",
    title: "Premium Silk Collection",
    subtitle: "Elegance woven into every thread"
  },
  {
    url: "https://kalyansilks.com/_next/image?url=https%3A%2F%2Fapi.kalyansilks.com%2Fmedia%2Fvegam%2Fhomepage%2Fimages%2F1920_x1040_-_Main_Banner_-_01_1.jpg&w=1920&q=75",
    title: "Traditional Wear",
    subtitle: "Celebrating heritage and culture"
  },
  {
    url: "https://kalyansilks.com/_next/image?url=https%3A%2F%2Fapi.kalyansilks.com%2Fmedia%2Fvegam%2Fhomepage%2Fimages%2F1920_x1040_-_Main_Banner_-_03_1.jpg&w=1920&q=75",
    title: "Festive Collection",
    subtitle: "Adorn yourself in ceremonial splendor"
  }
];

const featuredCollections = [
  {
    title: "Wedding Silks",
    description: "Exquisite silk sarees and attire for your special day",
    link: "/featured/wedding",
    image: "https://images.pexels.com/photos/2060240/pexels-photo-2060240.jpeg"
  },
  {
    title: "Bridal Blouse Sets",
    description: "Intricately designed blouses to complement your sarees",
    link: "/featured/blouse-sets",
    image: "https://images.pexels.com/photos/2960800/pexels-photo-2960800.jpeg"
  },
  {
    title: "Festival Picks",
    description: "Vibrant collections for all your celebration needs",
    link: "/featured/festive",
    image: "https://images.pexels.com/photos/1677923/pexels-photo-1677923.jpeg"
  }
];

const categories = [
  {
    title: "Sarees",
    img: "https://cdn.pixabay.com/photo/2015/05/15/06/50/indian-767880_960_720.jpg",
    link: "/category/sarees",
    description: "Traditional and contemporary sarees for every occasion"
  },
  {
    title: "Women's Collections",
    img: "https://byshree.com/cdn/shop/articles/Trendy-Ethnic-Sets-Exploring-the-Latest-Ethnic-Wear-Online.jpg",
    link: "/category/women",
    description: "Kurtas, salwars, lehengas and more"
  },
  {
    title: "Men's Collections",
    img: "https://www.ratanjaipur.com/cdn/shop/articles/Blog_Banner_-_Latest_Men_s_Collection_1.jpg?v=1726216596&width=2048",
    link: "/category/men",
    description: "Traditional and fusion wear for the modern man"
  }
];

const testimonials = [
  {
    name: "Priya Sharma",
    comment: "The quality of silk sarees from Kasavu Aalayam is unmatched. I received so many compliments at my daughter's wedding.",
    rating: 5,
    location: "Mumbai"
  },
  {
    name: "Rahul Menon",
    comment: "Excellent craftsmanship and timely delivery. The traditional wear collection here preserves our cultural heritage beautifully.",
    rating: 5,
    location: "Kochi"
  },
  {
    name: "Ananya Patel",
    comment: "I've been a loyal customer for years. Their attention to detail and customer service sets them apart from other stores.",
    rating: 4,
    location: "Bangalore"
  }
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const swiperRef = useRef(null);
  
  // Animation refs
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
  
  const [testimonialRef, testimonialInView] = useInView({ 
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

  // Lazy loading images
  const [imagesLoaded, setImagesLoaded] = useState({});
  
  const handleImageLoad = useCallback((index) => {
    setImagesLoaded(prev => ({ ...prev, [index]: true }));
  }, []);

  // Accessibility improvements
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

  return (
    <div className="font-sans">
      <Helmet>
        <title>Kasavu Aalayam | Home of Traditional Indian Wear</title>
        <meta name="description" content="Discover the finest traditional Indian wear at Kasavu Aalayam. Explore premium silk sarees, ethnic wear collections for men and women, and exquisite bridal wear." />
        <meta name="keywords" content="kasavu, sarees, traditional wear, indian fashion, silk sarees, ethnic wear" />
        <link rel="canonical" href="https://kasavuaalayam.com" />
      </Helmet>

      {isScrolled ? <ScrolledNavbar /> : <Navbar />}

      {/* Hero Section with Enhanced Carousel */}
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
            renderBullet: (index, className) => {
              return `<span class="${className}" aria-label="Go to slide ${index + 1}"></span>`;
            }
          }}
          speed={1000}
          loop={true}
          spaceBetween={0}
          slidesPerView={1}
          className="w-full h-screen"
          onSlideChange={handleSlideChange}
        >
          {heroImages.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-screen overflow-hidden">
                <img 
                  src={img.url} 
                  alt={`${img.title} - ${img.subtitle}`} 
                  className="w-full h-full object-cover"
                  onLoad={() => handleImageLoad(`hero-${index}`)}
                />
                {!imagesLoaded[`hero-${index}`] && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-30" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 30 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="max-w-4xl"
                  >
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{img.title}</h1>
                    <p className="text-xl md:text-2xl text-white mb-8 poppins-regular">{img.subtitle}</p>
                    <button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105">
                      Explore Collection
                    </button>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <div className="absolute bottom-12 left-0 right-0 flex justify-center z-10">
          <div className="flex space-x-3">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => swiperRef.current?.swiper.slideTo(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={currentSlide === index ? 'true' : 'false'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section 
        ref={categoriesRef}
        className="py-16 px-6 md:px-20 bg-gray-50"
        aria-labelledby="categories-heading"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: categoriesInView ? 1 : 0, y: categoriesInView ? 0 : 40 }}
          transition={{ duration: 0.7 }}
        >
          <h2 id="categories-heading" className="text-4xl font-semibold text-center mb-3 poppins-regular">Our Collections</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">Discover our curated collections of traditional and contemporary Indian wear</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* About / Brand Statement */}
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
          <h2 id="about-heading" className="text-3xl font-bold mb-6">A Legacy of Tradition</h2>
          <p className="text-gray-700 text-lg mb-8 leading-relaxed poppins-regular">
            At <span className="font-semibold">Kasavu Aalayam</span>, we bring you the finest traditional wear rooted in the rich heritage of Indian craftsmanship.
            Every thread tells a story of cultural significance, passed down through generations of skilled artisans.
            From elegant kasavu sarees to premium wedding collections, we invite you to explore timeless fashion redefined for the modern era.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg w-40">
              <span className="text-3xl font-bold text-amber-600">30+</span>
              <span className="text-sm text-gray-600 mt-2">Years of Excellence</span>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg w-40">
              <span className="text-3xl font-bold text-amber-600">15k+</span>
              <span className="text-sm text-gray-600 mt-2">Happy Customers</span>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg w-40">
              <span className="text-3xl font-bold text-amber-600">200+</span>
              <span className="text-sm text-gray-600 mt-2">Artisan Partners</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Collections - Enhanced */}
      <section 
        ref={featuredRef}
        className="py-16 px-6 md:px-20 bg-gray-100"
        aria-labelledby="featured-heading"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: featuredInView ? 1 : 0, y: featuredInView ? 0 : 40 }}
          transition={{ duration: 0.7 }}
        >
          <h2 id="featured-heading" className="text-4xl font-semibold text-center mb-3 poppins-regular">Featured Collections</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">Handpicked selections for every occasion</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </motion.div>
      </section>
      
      {/* Testimonials Section */}
      <section 
        ref={testimonialRef}
        className="py-16 px-6 md:px-20 bg-white"
        aria-labelledby="testimonials-heading"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: testimonialInView ? 1 : 0, y: testimonialInView ? 0 : 40 }}
          transition={{ duration: 0.7 }}
        >
          <h2 id="testimonials-heading" className="text-4xl font-semibold text-center mb-3 poppins-regular">What Our Customers Say</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">Cherished experiences from our valued patrons</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: testimonialInView ? 1 : 0, y: testimonialInView ? 0 : 30 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-amber-50 py-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-700 mb-8">Subscribe to receive updates on new collections and exclusive offers</p>
          
          <form className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 md:w-64 w-full"
              aria-label="Email address"
              required
            />
            <button 
              type="submit" 
              className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4">We respect your privacy and will never share your information</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const CategoryCard = ({ title, img, link, description, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <Link 
      to={link} 
      className="group relative block overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-96 rounded-lg"
    >
      <div className="overflow-hidden h-full">
        <img 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-all duration-300 group-hover:translate-y-0">
        <h3 className="text-white text-2xl font-semibold mb-2">
          {title}
        </h3>
        <p className="text-white/90 mb-4 poppins-regular opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {description}
        </p>
        <span className="inline-block px-4 py-2 bg-white/20 text-white rounded backdrop-blur-sm text-sm font-medium transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          Explore Collection
        </span>
      </div>
    </Link>
  );
};

const FeaturedCard = ({ title, description, link, image }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <Link to={link} className="block overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
      <div className="relative h-64">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>
      <div className="p-6 bg-white">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 poppins-regular">{description}</p>
        <div className="flex items-center text-amber-700 font-medium">
          <span>Explore Collection</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${i < testimonial.rating ? 'text-amber-500' : 'text-gray-300'}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-gray-700 mb-4 italic poppins-regular">{testimonial.comment}</p>
      <div className="flex justify-between items-center">
        <span className="font-semibold">{testimonial.name}</span>
        <span className="text-sm text-gray-500">{testimonial.location}</span>
      </div>
    </div>
  );
};

export default HomePage;