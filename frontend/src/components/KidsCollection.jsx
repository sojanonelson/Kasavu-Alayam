// components/KidsCollection.js
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown, Filter, Heart, ShoppingBag, X, Search,
  Grid3X3, List, ChevronLeft, ChevronRight, ChevronUp
} from 'lucide-react';
import Navbar from './Navbar';
import ScrolledNavbar from './ScrolledNavbar';
import products from '../Data/kids-collection'; // Import kids collection data
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/features/cart/cartSlice';
import { Helmet } from 'react-helmet';

// Rest of the component code remains the same, but update the Helmet title and meta tags as needed
const KidsCollection = () => {
  // Component logic remains the same
};

export default KidsCollection;
