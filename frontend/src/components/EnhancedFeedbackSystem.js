import React, { useState,useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
const allFeedbacks = [
  {
    id: 1,
    name: "Priya Sharma",
    comment: "The quality of silk sarees from Kasavu Aalayam is unmatched. I received so many compliments at my daughter's wedding.",
    rating: 5,
    location: "Mumbai",
    date: "15 Apr 2025",
    verified: true,
    productType: "Wedding Saree"
  },
  {
    id: 2,
    name: "Rahul Menon",
    comment: "Excellent craftsmanship and timely delivery. The traditional wear collection here preserves our cultural heritage beautifully.",
    rating: 5,
    location: "Kochi",
    date: "12 Apr 2025",
    verified: true,
    productType: "Men's Kurta"
  },
  {
    id: 3,
    name: "Ananya Patel",
    comment: "I've been a loyal customer for years. Their attention to detail and customer service sets them apart from other stores.",
    rating: 4,
    location: "Bangalore",
    date: "10 Apr 2025",
    verified: true,
    productType: "Silk Saree"
  },
  {
    id: 4,
    name: "Vikram Singh",
    comment: "The wedding collection exceeded my expectations. The materials are premium and the designs are timeless.",
    rating: 5,
    location: "Delhi",
    date: "8 Apr 2025",
    verified: true,
    productType: "Wedding Attire"
  },
  {
    id: 5,
    name: "Meera Joshi",
    comment: "Love their festival collection! The colors are vibrant and the fabric quality is excellent. Will definitely shop again.",
    rating: 5,
    location: "Pune",
    date: "5 Apr 2025",
    verified: true,
    productType: "Festival Saree"
  },
  {
    id: 6,
    name: "Arjun Kumar",
    comment: "The men's kurta I purchased fits perfectly. The stitching quality is superb. Highly recommend!",
    rating: 4,
    location: "Chennai",
    date: "3 Apr 2025",
    verified: true,
    productType: "Men's Kurta"
  },
  {
    id: 7,
    name: "Divya Nair",
    comment: "Fast delivery and excellent packaging. The saree was even more beautiful than it appeared online.",
    rating: 5,
    location: "Trivandrum",
    date: "1 Apr 2025",
    verified: true,
    productType: "Silk Saree"
  },
  {
    id: 8,
    name: "Rajesh Iyer",
    comment: "Great customer service. Had an issue with sizing but the team was very helpful in resolving it quickly.",
    rating: 4,
    location: "Hyderabad",
    date: "30 Mar 2025",
    verified: true,
    productType: "Men's Dhoti"
  },
  {
    id: 9,
    name: "Sunita Reddy",
    comment: "The blouse designs are unique and beautifully crafted. Perfect complement to the sarees.",
    rating: 5,
    location: "Mysore",
    date: "28 Mar 2025",
    verified: true,
    productType: "Blouse Set"
  },
  {
    id: 10,
    name: "Kiran Desai",
    comment: "Love the traditional motifs and patterns. These sarees remind me of my grandmother's collection.",
    rating: 5,
    location: "Ahmedabad",
    date: "25 Mar 2025",
    verified: true,
    productType: "Traditional Saree"
  },
  {
    id: 11,
    name: "Lakshmi Rajan",
    comment: "The Kasavu saree I bought for Onam was perfect. The gold border work is exquisite and authentic.",
    rating: 5,
    location: "Calicut",
    date: "23 Mar 2025",
    verified: true,
    productType: "Kasavu Saree"
  },
  {
    id: 12,
    name: "Aditya Varma",
    comment: "Bought a complete wedding ensemble and couldn't be happier. Everyone asked where I got it from!",
    rating: 5,
    location: "Jaipur",
    date: "20 Mar 2025",
    verified: true,
    productType: "Wedding Collection"
  },
  {
    id: 13,
    name: "Roshni Gupta",
    comment: "The lehenga I purchased for my sister's wedding was stunning. The embroidery detail is remarkable.",
    rating: 4,
    location: "Lucknow",
    date: "18 Mar 2025",
    verified: true,
    productType: "Lehenga"
  },
  {
    id: 14,
    name: "Mohan Pillai",
    comment: "First time ordering traditional wear online and I'm impressed with the quality and fit. Will be a repeat customer.",
    rating: 5,
    location: "Thrissur",
    date: "15 Mar 2025",
    verified: true,
    productType: "Men's Traditional Set"
  },
  {
    id: 15,
    name: "Aarushi Shah",
    comment: "The silk is butter soft and drapes beautifully. Worth every rupee spent!",
    rating: 5,
    location: "Surat",
    date: "12 Mar 2025",
    verified: true,
    productType: "Silk Saree"
  },
  {
    id: 16,
    name: "Varun Nambiar",
    comment: "The mundu and shirt set was perfect for my temple visit. Comfortable material that stays in place.",
    rating: 5,
    location: "Palakkad",
    date: "10 Mar 2025",
    verified: true,
    productType: "Men's Traditional Wear"
  },
  {
    id: 17,
    name: "Nandini Krishnan",
    comment: "Ordered matching outfits for the whole family for Diwali and everyone loved them!",
    rating: 4,
    location: "Coimbatore",
    date: "8 Mar 2025",
    verified: true,
    productType: "Family Collection"
  },
  {
    id: 18,
    name: "Deepak Chowdhury",
    comment: "The craftsmanship of the Banarasi silk saree is exceptional. A true heirloom piece.",
    rating: 5,
    location: "Varanasi",
    date: "5 Mar 2025",
    verified: true,
    productType: "Banarasi Saree"
  },
  {
    id: 19,
    name: "Jaya Thakur",
    comment: "Purchased for my daughter's graduation and the compliments haven't stopped! Beautiful contemporary designs.",
    rating: 5,
    location: "Kolkata",
    date: "3 Mar 2025",
    verified: true,
    productType: "Contemporary Saree"
  },
  {
    id: 20,
    name: "Vijay Sharma",
    comment: "The cotton kurta is perfect for daily wear. Comfortable, stylish, and durable.",
    rating: 4,
    location: "Nagpur",
    date: "1 Mar 2025",
    verified: true,
    productType: "Cotton Kurta"
  },
  {
    id: 21,
    name: "Kavita Menon",
    comment: "Their jewelry selection complements the sarees perfectly. One-stop shop for all traditional needs.",
    rating: 5,
    location: "Cochin",
    date: "25 Feb 2025",
    verified: true,
    productType: "Traditional Jewelry"
  },
  {
    id: 22,
    name: "Sanjay Rathore",
    comment: "The festive collection for men is outstanding. Modern cuts with traditional aesthetics.",
    rating: 5,
    location: "Bhopal",
    date: "22 Feb 2025",
    verified: true,
    productType: "Men's Festival Wear"
  },
  {
    id: 23,
    name: "Preethi Suresh",
    comment: "The bridal blouse was custom-stitched perfectly to my measurements. Excellent tailoring service!",
    rating: 5,
    location: "Madurai",
    date: "20 Feb 2025",
    verified: true,
    productType: "Bridal Blouse"
  }
];

const EnhancedFeedbackSystem = () => {
  const [activeFeedbacks,] = useState(allFeedbacks);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  // Animation ref
  const [feedbackRef, feedbackInView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const swiperRef = useRef(null);

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (feedbackInput && userRating && userName) {
      // In a real app, you would send this to your backend
      console.log({
        name: userName,
        comment: feedbackInput,
        rating: userRating,
        date: new Date().toLocaleDateString()
      });

      // Reset form and show thank you message
      setFeedbackInput('');
      setUserRating(0);
      setUserName('');
      setShowThankYou(true);

      setTimeout(() => {
        setShowThankYou(false);
      }, 3000);
    }
  };

  return (
    <section
      ref={feedbackRef}
      className="py-16 px-6 md:px-20 "
      aria-labelledby="feedback-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: feedbackInView ? 1 : 0, y: feedbackInView ? 0 : 40 }}
        transition={{ duration: 0.7 }}
      >
        <h2 id="feedback-heading" className="text-4xl font-semibold text-center mb-3 poppins-regular">
          Customer Experiences
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-6">
          Hear from our community of satisfied customers across India
        </p>

        {/* Statistics Overview */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
            <span className="text-3xl font-bold text-amber-600">{allFeedbacks.length}+</span>
            <span className="text-sm text-gray-600">Happy Customers</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
            <span className="text-3xl font-bold text-amber-600">4.8</span>
            <span className="text-sm text-gray-600">Average Rating</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
            <span className="text-3xl font-bold text-amber-600">98%</span>
            <span className="text-sm text-gray-600">Would Recommend</span>
          </div>
        </div>
        <div className="mb-12">
          <Swiper
            ref={swiperRef}
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true
            }}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 20 }
            }}
            loop={true}
            className="pb-12"
          >
            {activeFeedbacks.map((feedback) => (
              <SwiperSlide key={feedback.id}>
                <TestimonialCard feedback={feedback} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </motion.div>
    </section>
  );
};

const TestimonialCard = ({ feedback }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Header with customer info */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold">{feedback.name}</h3>
          <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
            <span>{feedback.location}</span>
            <span>•</span>
            <span>{feedback.date}</span>
            {feedback.verified && (
              <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">Verified</span>
            )}
          </div>
        </div>
        <span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-full">
          {feedback.productType}
        </span>
      </div>
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${i < feedback.rating ? 'text-amber-500' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-gray-700 text-sm italic flex-grow poppins-regular mb-3">"{feedback.comment}"</p>
      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
        <div className="flex space-x-2">
          <button className="text-gray-400 hover:text-amber-600 transition-colors text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            Helpful
          </button>
        </div>
        <span className="text-xs text-gray-400">Purchased item</span>
      </div>
    </div>
  );
};

export default EnhancedFeedbackSystem;
