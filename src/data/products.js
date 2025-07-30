// Sample product data with location information
export const products = [
  // Rice Varieties
  {
    id: 1,
    name: 'Sona Masoori Rice',
    category: 'Cereals',
    subcategory: 'Rice Varieties',
    variety: 'Sona Masoori',
    price: 45.50,
    unit: 'kg',
    minOrder: 10,
    location: 'Andhra Pradesh',
    seller: 'Sri Lakshmi Farms',
    rating: 4.5,
    stock: 500,
    organic: true,
    image: '/images/rice-sona-masoori.jpg',
    description: 'Premium quality Sona Masoori rice, known for its pleasant aroma and taste.'
  },
  {
    id: 2,
    name: 'Basmati 370 Rice',
    category: 'Cereals',
    subcategory: 'Rice Varieties',
    variety: 'Basmati 370',
    price: 85.00,
    unit: 'kg',
    minOrder: 5,
    location: 'Punjab',
    seller: 'Punjab Agro',
    rating: 4.7,
    stock: 300,
    organic: false,
    image: '/images/rice-basmati.jpg',
    description: 'Long grain aromatic basmati rice, perfect for biryanis and pulao.'
  },
  
  // Wheat
  {
    id: 3,
    name: 'Sharbati Wheat',
    category: 'Cereals',
    subcategory: 'Wheat',
    variety: 'Sharbati',
    price: 28.75,
    unit: 'kg',
    minOrder: 25,
    location: 'Madhya Pradesh',
    seller: 'MP Agro',
    rating: 4.4,
    stock: 1000,
    organic: true,
    image: '/images/wheat-sharbati.jpg',
    description: 'Premium quality Sharbati wheat, known for its golden color and rich taste.'
  },
  
  // Pulses
  {
    id: 4,
    name: 'Toor Dal',
    category: 'Pulses',
    subcategory: 'Toor Dal (Pigeon Pea)',
    variety: 'Maruti',
    price: 120.00,
    unit: 'kg',
    minOrder: 5,
    location: 'Maharashtra',
    seller: 'Maharashtra Agro',
    rating: 4.3,
    stock: 200,
    organic: false,
    image: '/images/toor-dal.jpg',
    description: 'High protein toor dal, perfect for sambar and dal tadka.'
  },
  
  // Oilseeds
  {
    id: 5,
    name: 'Groundnut',
    category: 'Oilseeds',
    subcategory: 'Groundnut',
    variety: 'TMV 2',
    price: 95.00,
    unit: 'kg',
    minOrder: 10,
    location: 'Gujarat',
    seller: 'Gujarat Agro',
    rating: 4.6,
    stock: 150,
    organic: true,
    image: '/images/groundnut.jpg',
    description: 'Premium quality groundnuts, rich in protein and healthy fats.'
  },
  
  // Cash Crops
  {
    id: 6,
    name: 'Cotton',
    category: 'Cash Crops',
    subcategory: 'Cotton',
    variety: 'BT Cotton',
    price: 6500.00,
    unit: 'quintal',
    minOrder: 1,
    location: 'Punjab',
    seller: 'Punjab Cotton Mills',
    rating: 4.2,
    stock: 50,
    organic: false,
    image: '/images/cotton.jpg',
    description: 'High yield BT Cotton with excellent fiber quality.'
  },
  
  // Spices
  {
    id: 7,
    name: 'Red Chilies',
    category: 'Spices',
    subcategory: 'Chilies',
    variety: 'Byadgi',
    price: 180.00,
    unit: 'kg',
    minOrder: 2,
    location: 'Karnataka',
    seller: 'Karnataka Spices',
    rating: 4.8,
    stock: 75,
    organic: true,
    image: '/images/byadgi-chilies.jpg',
    description: 'Famous Byadgi chilies known for their deep red color and mild heat.'
  },
  
  // Additional products...
  {
    id: 8,
    name: 'Soybean',
    category: 'Oilseeds',
    subcategory: 'Soybean',
    variety: 'JS 335',
    price: 48.00,
    unit: 'kg',
    minOrder: 20,
    location: 'Madhya Pradesh',
    seller: 'MP Agro',
    rating: 4.5,
    stock: 300,
    organic: false,
    image: '/images/soybean.jpg',
    description: 'High protein soybean, suitable for oil extraction and animal feed.'
  },
  {
    id: 9,
    name: 'Sugarcane',
    category: 'Cash Crops',
    subcategory: 'Sugarcane',
    variety: 'Co 0238',
    price: 320.00,
    unit: 'quintal',
    minOrder: 5,
    location: 'Uttar Pradesh',
    seller: 'UP Sugarcane Coop',
    rating: 4.3,
    stock: 100,
    organic: true,
    image: '/images/sugarcane.jpg',
    description: 'High sucrose content sugarcane, excellent for sugar production.'
  },
  {
    id: 10,
    name: 'Black Pepper',
    category: 'Spices',
    subcategory: 'Pepper',
    variety: 'Black Pepper',
    price: 480.00,
    unit: 'kg',
    minOrder: 1,
    location: 'Kerala',
    seller: 'Kerala Spices',
    rating: 4.7,
    stock: 40,
    organic: true,
    image: '/images/black-pepper.jpg',
    description: 'Premium quality black pepper with strong aroma and flavor.'
  }
];

// Get unique locations for filters
export const locations = [...new Set(products.map(product => product.location))].sort();
