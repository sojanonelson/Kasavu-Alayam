import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import { Autoplay } from 'swiper/modules';
import Navbar from '../components/Navbar';
import ScrolledNavbar from '../components/ScrolledNavbar'

const heroImages = [
  {
    url: "https://kalyansilks.com/_next/image?url=https%3A%2F%2Fapi.kalyansilks.com%2Fmedia%2Fvegam%2Fhomepage%2Fimages%2FDesktop_Banner-_1920_x_1040_px_1.jpg&w=1920&q=75",
    title: "Premium Silk Collection"
  },
  {
    url: "https://kalyansilks.com/_next/image?url=https%3A%2F%2Fapi.kalyansilks.com%2Fmedia%2Fvegam%2Fhomepage%2Fimages%2F1920_x1040_-_Main_Banner_-_01_1.jpg&w=1920&q=75",
    title: "Traditional Wear"
  },
  {
    url: "https://kalyansilks.com/_next/image?url=https%3A%2F%2Fapi.kalyansilks.com%2Fmedia%2Fvegam%2Fhomepage%2Fimages%2F1920_x1040_-_Main_Banner_-_03_1.jpg&w=1920&q=75",
    title: "Festive Collection"
  }
];

const HomePage = () => {
  const [currentTitle, setCurrentTitle] = useState(heroImages[0].title);

  const handleSlideChange = (swiper) => {
    setCurrentTitle(heroImages[swiper.realIndex].title);
  };

  const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY >600);
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

console.log("scroll:", window.scrollY)


  return (
    <div className="font-sans">
      {/* Helmet for dynamic title */}
      <Helmet>
        <title>Kasavu Aalayam | Home</title>
      </Helmet>

      {/* Hero Section */}
      {isScrolled ? <ScrolledNavbar /> : <Navbar />}

      <section className="relative">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ 
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          speed={1000}
          loop={true}
          spaceBetween={0}
          slidesPerView={1}
          className="w-full h-[100vh]"
          onSlideChange={handleSlideChange}
        >
          {heroImages.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[100vh]">
                <img 
                  src={img.url} 
                  alt={`Slide ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-6 md:px-20 bg-gray-100">
        <h2 className="text-3xl font-semibold text-center mb-10 poppins-regular">Our Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategoryCard
            title="Sarees"
            img="https://cdn.pixabay.com/photo/2015/05/15/06/50/indian-767880_960_720.jpg"
            link="/category/sarees"
            index={0}
          />
          <CategoryCard
            title="Women's Collections"
            img="https://byshree.com/cdn/shop/articles/Trendy-Ethnic-Sets-Exploring-the-Latest-Ethnic-Wear-Online.jpg"
            link="/category/women"
            index={1}
          />
          <CategoryCard
            title="Men's Collections"
            img="https://www.ratanjaipur.com/cdn/shop/articles/Blog_Banner_-_Latest_Men_s_Collection_1.jpg?v=1726216596&width=2048"
            link="/category/men"
            index={2}
          />
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-12 px-6 md:px-20">
        <h2 className="text-3xl font-semibold text-center mb-10 poppins-regular">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeaturedCard title="Wedding Silks" link="/featured/wedding" />
          <FeaturedCard title="Bridal Blouse Sets" link="/featured/blouse-sets" />
          <FeaturedCard title="Festival Picks" link="/featured/festive" />
        </div>
      </section>

      {/* About / Brand Statement */}
      <section className="bg-white py-12 px-6 md:px-20 text-center">
        <h2 className="text-2xl font-bold mb-4">A Legacy of Tradition</h2>
        <p className="text-gray-700 text-lg max-w-3xl mx-auto poppins-regular">
          At Kasavu Alayam, we bring you the finest traditional wear rooted in the rich heritage of Indian craftsmanship.
          From elegant kasavu sarees to premium wedding collections, explore timeless fashion redefined.
        </p>
      </section>

      {/* Footer Call to Action */}
      <section className="bg-black text-white py-10 text-center">
        <h2 className="text-xl mb-2">Stay Updated With New Arrivals</h2>
        <button className="bg-white text-black px-6 py-2 rounded-full mt-4 hover:bg-gray-200">
          Subscribe Now
        </button>
      </section>
    </div>
  );
};

const CategoryCard = ({ title, img, link, index }) => (
  <Link 
    to={link} 
    className={`group relative block overflow-hidden shadow-md hover:shadow-lg ${
      index === 0 ? 'rounded-tl-lg rounded-bl-lg' : 
      index === 2 ? 'rounded-tr-lg rounded-br-lg' : 
      'rounded-none'
    }`}
  >
    <div className="overflow-hidden">
      <img 
        src={img} 
        alt={title} 
        className={`w-full h-72 object-cover transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105 ${
          index === 0 ? 'rounded-tl-2xl rounded-bl-2xl' : 
          index === 2 ? 'rounded-tr-2xl rounded-br-2xl' : 
          'rounded-none'
        }`}
      />
    </div>
    
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
      <h3 className="text-white text-2xl poppins-regular font-semibold text-left">
        {title}
      </h3>
    </div>
  </Link>
);

const FeaturedCard = ({ title, link }) => (
  <Link to={link} className="bg-gray-100 p-6 rounded-lg text-center hover:bg-gray-200 transition">
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600 poppins-regular">Explore Now</p>
  </Link>
);

export default HomePage;