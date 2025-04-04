import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import { Autoplay, EffectFade } from 'swiper/modules';
import Navbar from '../components/Navbar';

const heroImages = [
  "https://images.unsplash.com/photo-1614951841462-92cb7e25f7fb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

  "https://cdn.pixabay.com/photo/2024/10/28/18/06/elegant-woman-9156877_960_720.jpg",
  "https://cdn.pixabay.com/photo/2024/10/28/18/07/elegant-woman-9156887_1280.jpg"
];


const HomePage = () => {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <Navbar/>
      <section className="relative">
        <Swiper
          modules={[Autoplay, EffectFade]}
          autoplay={{ 
            delay: 4000, 
            disableOnInteraction: false,
            pauseOnMouseEnter: false 
          }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1000}
          loop={true}
          className="w-full h-[90vh]"
        >
          {heroImages.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[90vh]">
                <img src={img} alt={`Slide ${index + 1}`} className="w-full h-full object-cover transition-opacity duration-500" />
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20 flex items-center justify-center">
                  <h1 className="text-white text-4xl md:text-6xl font-bold text-center drop-shadow-lg">
                    Discover Timeless Elegance
                  </h1>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>


      {/* Categories Section */}
      <section className="py-12 px-6 md:px-20 bg-gray-100">
        <h2 className="text-3xl font-semibold text-center mb-10">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategoryCard
            title="Sarees"
            img="https://cdn.pixabay.com/photo/2015/05/15/06/50/indian-767880_960_720.jpg"
            link="/category/sarees"
          />
          <CategoryCard
            title="Women's Collections"
            img="https://apisap.fabindia.com/medias/wmn-clp-mob-sec1-28mar25-1.jpg?context=bWFzdGVyfGltYWdlc3w2MTUxM3xpbWFnZS9qcGVnfGFEYzJMMmcwTnk4NE56QTNORE14TnpZek1UVXhPQzkzYlc0dFkyeHdMVzF2WWkxelpXTXhMVEk0YldGeU1qVXRNUzVxY0djfDRiODhlNjU5ZjQ3OTM1MTQ4YTU4ZDBkYTYyM2M4MjYzZDk0NTNmYzllNjQyYmIzMDQzMzgxYmVlZDJhMGJiYjA"
            link="/category/women"
          />
          <CategoryCard
            title="Men's Collections"
            img="https://www.ratanjaipur.com/cdn/shop/articles/Blog_Banner_-_Latest_Men_s_Collection_1.jpg?v=1726216596&width=2048"
            link="/category/men"
          />
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-12 px-6 md:px-20">
        <h2 className="text-3xl font-semibold text-center mb-10">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeaturedCard title="Wedding Silks" link="/featured/wedding" />
          <FeaturedCard title="Bridal Blouse Sets" link="/featured/blouse-sets" />
          <FeaturedCard title="Festival Picks" link="/featured/festive" />
        </div>
      </section>

      {/* About / Brand Statement */}
      <section className="bg-white py-12 px-6 md:px-20 text-center">
        <h2 className="text-2xl font-bold mb-4">A Legacy of Tradition</h2>
        <p className="text-gray-700 text-lg max-w-3xl mx-auto">
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

const CategoryCard = ({ title, img, link }) => (
  <Link to={link} className="bg-white shadow-md rounded-lg overflow-hidden  transition">
    <img src={img} alt={title} className="w-full h-64 object-cover" />
    <div className="p-4 text-center">
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
  </Link>
);

const FeaturedCard = ({ title, link }) => (
  <Link to={link} className="bg-gray-100 p-6 rounded-lg text-center hover:bg-gray-200 transition">
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">Explore Now</p>
  </Link>
);

export default HomePage;