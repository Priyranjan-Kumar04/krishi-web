import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Grid, Card, CardContent, CardMedia,
  CardActions, Button, TextField, InputAdornment, Select, MenuItem,
  FormControl, InputLabel, Pagination, Rating, Chip, useMediaQuery, useTheme,
  IconButton, Slider, Drawer, List, ListItem, ListItemText, Checkbox, FormGroup, FormControlLabel
} from '@mui/material';
import {
  Search, FilterList, ShoppingCart, Favorite, Share,
  NavigateBefore, NavigateNext, Close, Star, StarBorder, LocalShipping, VerifiedUser
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  position: 'relative',
}));

const CarouselContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  margin: '20px 0',
  padding: '10px 0',
});

const CarouselTrack = styled(Box)({
  display: 'flex',
  transition: 'transform 0.5s ease',
  gap: '15px',
  padding: '10px 0',
});

const CarouselItem = styled(Box)({
  minWidth: '200px',
  flex: '0 0 auto',
  cursor: 'pointer',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.03)',
  },
});

const NavButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  zIndex: 2,
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },
  '&.prev': {
    left: 10,
  },
  '&.next': {
    right: 10,
  },
}));

// Mock product data - Tamil Nadu Crops (100+ varieties)
export const mockProducts = [
  // ===== CEREALS (1-15) =====
  {
    id: 1,
    name: 'Sona Masoori Rice',
    price: 65,
    rating: 4.6,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?sona-masoori-rice',
    inStock: true,
    isOrganic: true,
    isBestSeller: true,
    farmer: 'Muthuvel',
    location: 'Thanjavur, Tamil Nadu',
    unit: 'kg',
    moq: '10',
    stock: 5000,
    description: 'Premium quality Sona Masoori rice, known for its pleasant taste and easy digestibility. Grown in the fertile Cauvery delta region.'
  },
  {
    id: 2,
    name: 'Ponni Rice',
    price: 60,
    rating: 4.5,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?rice-field',
    inStock: true,
    isOrganic: true,
    farmer: 'Rajendran',
    location: 'Thanjavur, Tamil Nadu',
    unit: 'kg',
    moq: '10',
    stock: 4000,
    description: 'Traditional Ponni rice, a staple in Tamil Nadu households, known for its soft texture and quick cooking time.'
  },
  {
    id: 3,
    name: 'Kichili Samba Rice',
    price: 85,
    rating: 4.7,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?rice',
    inStock: true,
    isOrganic: true,
    isBestSeller: true,
    farmer: 'Karuppasamy',
    location: 'Thiruvannamalai, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 2500,
    description: 'Aromatic Kichili Samba rice, known for its unique fragrance and taste, perfect for traditional Tamil dishes.'
  },
  {
    id: 4,
    name: 'Seeraga Samba Rice',
    price: 120,
    rating: 4.8,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?basmati-rice',
    inStock: true,
    isOrganic: true,
    farmer: 'Sundar',
    location: 'Ramanathapuram, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1800,
    description: 'Premium Seeraga Samba rice, known for its unique aroma and flavor, often used in biryanis.'
  },
  {
    id: 5,
    name: 'Red Rice',
    price: 95,
    rating: 4.4,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?red-rice',
    inStock: true,
    isOrganic: true,
    farmer: 'Manohar',
    location: 'Tirunelveli, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1500,
    description: 'Nutrient-rich red rice, packed with antioxidants and fiber, grown organically in southern Tamil Nadu.'
  },
  {
    id: 6,
    name: 'Mappillai Samba Rice',
    price: 110,
    rating: 4.6,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?brown-rice',
    inStock: true,
    isOrganic: true,
    farmer: 'Kannan',
    location: 'Tirunelveli, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1200,
    description: 'Traditional Mappillai Samba rice, known for its high nutritional value and rich taste.'
  },
  {
    id: 7,
    name: 'Brown Rice',
    price: 90,
    rating: 4.3,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?brown-rice',
    inStock: true,
    isOrganic: true,
    farmer: 'Suresh',
    location: 'Erode, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 2000,
    description: 'Healthy brown rice with bran and germ intact, rich in fiber and essential nutrients.'
  },
  {
    id: 8,
    name: 'Black Rice (Kavuni Arisi)',
    price: 250,
    rating: 4.7,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?black-rice',
    inStock: true,
    isOrganic: true,
    isBestSeller: true,
    farmer: 'Arun',
    location: 'Tirunelveli, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 800,
    description: 'Rare black rice variety, rich in antioxidants and anthocyanins, known for its nutty flavor.'
  },
  {
    id: 9,
    name: 'Maize (Corn)',
    price: 45,
    rating: 4.2,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?corn',
    inStock: true,
    isOrganic: false,
    farmer: 'Prakash',
    location: 'Dharmapuri, Tamil Nadu',
    unit: 'kg',
    moq: '10',
    stock: 3000,
    description: 'Fresh sweet corn, perfect for boiling, grilling, or making corn-based dishes.'
  },
  {
    id: 10,
    name: 'Ragi (Finger Millet)',
    price: 55,
    rating: 4.5,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?millet',
    inStock: true,
    isOrganic: true,
    farmer: 'Ramesh',
    location: 'Dharmapuri, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1800,
    description: 'Nutrient-dense ragi, rich in calcium and iron, ideal for porridge and traditional sweets.'
  },
  {
    id: 11,
    name: 'Varagu (Kodo Millet)',
    price: 75,
    rating: 4.4,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?millet',
    inStock: true,
    isOrganic: true,
    farmer: 'Kumar',
    location: 'Krishnagiri, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1500,
    description: 'Ancient grain varagu, gluten-free and rich in fiber, perfect for a healthy diet.'
  },
  {
    id: 12,
    name: 'Samai (Little Millet)',
    price: 70,
    rating: 4.3,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?millet',
    inStock: true,
    isOrganic: true,
    farmer: 'Senthil',
    location: 'Dharmapuri, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1200,
    description: 'Nutritious samai millet, rich in B-vitamins and minerals, great for upma and pongal.'
  },
  {
    id: 13,
    name: 'Thinai (Foxtail Millet)',
    price: 80,
    rating: 4.5,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?millet',
    inStock: true,
    isOrganic: true,
    farmer: 'Ganesh',
    location: 'Krishnagiri, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1600,
    description: 'Ancient thinai millet, gluten-free and rich in protein, perfect for traditional recipes.'
  },
  {
    id: 14,
    name: 'Kambu (Pearl Millet)',
    price: 65,
    rating: 4.3,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?millet',
    inStock: true,
    isOrganic: true,
    farmer: 'Murugan',
    location: 'Dharmapuri, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1400,
    description: 'Nutrient-rich kambu, excellent for making porridge and traditional flatbreads.'
  },
  {
    id: 15,
    name: 'Cholam (Sorghum)',
    price: 60,
    rating: 4.4,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?sorghum',
    inStock: true,
    isOrganic: true,
    farmer: 'Karuppasamy',
    location: 'Salem, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1800,
    description: 'Traditional cholam, rich in antioxidants and fiber, perfect for making rotis and porridge.'
  },

  // ===== PULSES (16-30) =====
  {
    id: 16,
    name: 'Toor Dal (Tuvaram Paruppu)',
    price: 110,
    rating: 4.5,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?pigeon-peas',
    inStock: true,
    isOrganic: true,
    farmer: 'Mani',
    location: 'Dharmapuri, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 2000,
    description: 'High-quality toor dal, a staple in South Indian cooking, known for its rich flavor and high protein content.'
  },
  {
    id: 17,
    name: 'Moong Dal (Paasi Paruppu)',
    price: 95,
    rating: 4.4,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?mung-beans',
    inStock: true,
    isOrganic: true,
    farmer: 'Rajesh',
    location: 'Salem, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1800,
    description: 'Premium quality moong dal, easily digestible and rich in protein, perfect for dals and sweets.'
  },
  {
    id: 18,
    name: 'Urad Dal (Ulundhu)',
    price: 120,
    rating: 4.6,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?black-gram',
    inStock: true,
    isOrganic: true,
    farmer: 'Karthik',
    location: 'Tirunelveli, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1500,
    description: 'Premium quality urad dal, essential for making idli, dosa, and vada batters.'
  },
  {
    id: 19,
    name: 'Chana Dal (Kadalai Paruppu)',
    price: 100,
    rating: 4.4,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?chickpeas',
    inStock: true,
    isOrganic: true,
    farmer: 'Suresh',
    location: 'Coimbatore, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1600,
    description: 'High-quality chana dal, rich in protein and fiber, perfect for curries and snacks.'
  },
  {
    id: 20,
    name: 'Masoor Dal',
    price: 90,
    rating: 4.3,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?lentils',
    inStock: true,
    isOrganic: true,
    farmer: 'Arun',
    location: 'Erode, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1400,
    description: 'Rich and nutritious masoor dal, cooks quickly and is packed with protein and iron.'
  },
  {
    id: 21,
    name: 'Green Gram (Pachai Payaru)',
    price: 85,
    rating: 4.5,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?mung-beans',
    inStock: true,
    isOrganic: true,
    farmer: 'Prakash',
    location: 'Theni, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1700,
    description: 'Fresh green gram, rich in protein and fiber, perfect for sprouts and curries.'
  },
  {
    id: 22,
    name: 'Black Eyed Beans (Karamani)',
    price: 95,
    rating: 4.3,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?black-eyed-peas',
    inStock: true,
    isOrganic: true,
    farmer: 'Kannan',
    location: 'Madurai, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1200,
    description: 'Nutritious black-eyed beans, rich in protein and fiber, great for salads and curries.'
  },
  {
    id: 23,
    name: 'Rajma (Red Kidney Beans)',
    price: 130,
    rating: 4.4,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?kidney-beans',
    inStock: true,
    isOrganic: true,
    farmer: 'Sundar',
    location: 'The Nilgiris, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1000,
    description: 'Premium quality rajma, perfect for making North Indian style rajma masala.'
  },
  {
    id: 24,
    name: 'Black Chana (Kala Chana)',
    price: 95,
    rating: 4.3,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?chickpeas',
    inStock: true,
    isOrganic: true,
    farmer: 'Ramesh',
    location: 'Dindigul, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1500,
    description: 'Protein-rich black chana, perfect for curries, snacks, and chaats.'
  },
  {
    id: 25,
    name: 'Cowpea (Karamani)',
    price: 85,
    rating: 4.2,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?cowpeas',
    inStock: true,
    isOrganic: true,
    farmer: 'Murugan',
    location: 'Tiruppur, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1300,
    description: 'Fresh cowpeas, rich in protein and fiber, great for curries and sundal.'
  },
  {
    id: 26,
    name: 'Horse Gram (Kollu)',
    price: 110,
    rating: 4.4,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?horse-gram',
    inStock: true,
    isOrganic: true,
    farmer: 'Karuppasamy',
    location: 'Dharmapuri, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1100,
    description: 'Nutrient-dense horse gram, known for its medicinal properties and rich flavor.'
  },
  {
    id: 27,
    name: 'Green Peas (Pattani)',
    price: 70,
    rating: 4.3,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?peas',
    inStock: true,
    isOrganic: true,
    farmer: 'Manohar',
    location: 'The Nilgiris, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 900,
    description: 'Fresh green peas, sweet and tender, perfect for curries and rice dishes.'
  },
  {
    id: 28,
    name: 'Moth Beans (Matki)',
    price: 100,
    rating: 4.2,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?moth-beans',
    inStock: true,
    isOrganic: true,
    farmer: 'Ganesh',
    location: 'Krishnagiri, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1000,
    description: 'Protein-rich moth beans, great for sprouts, curries, and salads.'
  },
  {
    id: 29,
    name: 'Lima Beans (Mochai)',
    price: 120,
    rating: 4.5,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?lima-beans',
    inStock: true,
    isOrganic: true,
    farmer: 'Senthil',
    location: 'Dindigul, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 800,
    description: 'Creamy lima beans, rich in protein and fiber, perfect for traditional Tamil dishes.'
  },
  {
    id: 30,
    name: 'Soya Chunks',
    price: 180,
    rating: 4.4,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?soy-chunks',
    inStock: true,
    isOrganic: true,
    farmer: 'Kumar',
    location: 'Salem, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 1200,
    description: 'High-protein soya chunks, perfect for curries and biryanis as a meat substitute.'
  },

  // ===== OILSEEDS (31-45) =====
  {
    id: 2,
    name: 'Ponni Rice',
    price: 60,
    rating: 4.5,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?rice-field',
    inStock: true,
    isOrganic: true,
    farmer: 'Rajendran',
    location: 'Thanjavur, Tamil Nadu',
    unit: 'kg',
    moq: '10',
    stock: 4000,
    description: 'Traditional Ponni rice, a staple in Tamil Nadu households, known for its soft texture and quick cooking time.'
  },
  {
    id: 3,
    name: 'Kichili Samba Rice',
    price: 85,
    rating: 4.7,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?rice',
    inStock: true,
    isOrganic: true,
    isBestSeller: true,
    farmer: 'Karuppasamy',
    location: 'Thiruvannamalai, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 2500,
    description: 'Aromatic Kichili Samba rice, known for its unique fragrance and taste, perfect for traditional Tamil dishes.'
  },
  
  // ===== PULSES (16-25) =====
  {
    id: 4,
    name: 'Black Urad Dal',
    price: 120,
    rating: 4.4,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?black-gram',
    inStock: true,
    isOrganic: true,
    farmer: 'Manickam',
    location: 'Dharmapuri, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1500,
    description: 'Premium quality black urad dal with the husk, rich in protein and essential nutrients.'
  },
  {
    id: 5,
    name: 'Toor Dal',
    price: 95,
    rating: 4.3,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?pigeon-peas',
    inStock: true,
    isOrganic: false,
    farmer: 'Sundaram',
    location: 'Salem, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 2000,
    description: 'High-quality toor dal, a staple in South Indian cooking, known for its rich flavor and high protein content.'
  },
  
  // ===== VEGETABLES (26-45) =====
  {
    id: 6,
    name: 'Kodaikanal Potato',
    price: 45,
    rating: 4.4,
    category: 'Vegetables',
    image: 'https://source.unsplash.com/random/300x200?potato',
    inStock: true,
    isOrganic: true,
    farmer: 'Murugan',
    location: 'Kodaikanal, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1500,
    description: 'Organic potatoes grown in the cool climate of Kodaikanal hills, known for their excellent taste and texture.'
  },
  {
    id: 7,
    name: 'Ooty Carrot',
    price: 55,
    rating: 4.5,
    category: 'Vegetables',
    image: 'https://source.unsplash.com/random/300x200?carrot',
    inStock: true,
    isOrganic: true,
    farmer: 'Rajendran',
    location: 'Ooty, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 900,
    description: 'Sweet and crunchy carrots grown in the cool climate of Ooty, rich in beta-carotene.'
  },
  {
    id: 8,
    name: 'Krishnagiri Tomato',
    price: 35,
    rating: 4.2,
    category: 'Vegetables',
    image: 'https://source.unsplash.com/random/300x200?tomato',
    inStock: true,
    isOrganic: false,
    farmer: 'Prakash',
    location: 'Krishnagiri, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 2500,
    description: 'Fresh and juicy tomatoes grown in the fertile lands of Krishnagiri district.'
  },
  
  // ===== FRUITS (46-65) =====
  {
    id: 9,
    name: 'Madurai Mango (Alphonso)',
    price: 750,
    rating: 4.8,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?mango',
    inStock: true,
    isSeasonal: true,
    season: 'Summer',
    farmer: 'Pandian',
    location: 'Madurai, Tamil Nadu',
    unit: 'dozen',
    moq: '1',
    stock: 200,
    description: 'Sweet and fiberless Alphonso mangoes, known as the king of fruits. Grown in the fertile lands of Madurai.'
  },
  {
    id: 10,
    name: 'Sengottai Banana',
    price: 50,
    rating: 4.6,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?banana',
    inStock: true,
    isOrganic: true,
    farmer: 'Mani',
    location: 'Tirunelveli, Tamil Nadu',
    unit: 'dozen',
    moq: '2',
    stock: 800,
    description: 'Sweet and nutritious bananas grown in the fertile lands of Tirunelveli district.'
  },
  {
    id: 11,
    name: 'Krishnagiri Mango (Totapuri)',
    price: 65,
    rating: 4.3,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?mango',
    inStock: true,
    isSeasonal: true,
    season: 'Summer',
    farmer: 'Ramesh',
    location: 'Krishnagiri, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1200,
    description: 'Totapuri mangoes known for their unique shape and tangy-sweet taste, perfect for pickles and juices.'
  },
  {
    id: 12,
    name: 'Cumbum Grapes',
    price: 95,
    rating: 4.7,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?grapes',
    inStock: true,
    isSeasonal: true,
    season: 'Winter',
    farmer: 'Muthu',
    location: 'Theni, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 600,
    description: 'Sweet and seedless grapes grown in the Cumbum valley, known for their unique taste and high sugar content.'
  },
  
  // ===== SPICES (66-85) =====
  {
    id: 13,
    name: 'Coimbatore Turmeric',
    price: 220,
    rating: 4.7,
    category: 'Spices',
    image: 'https://source.unsplash.com/random/300x200?turmeric',
    inStock: true,
    isOrganic: true,
    farmer: 'Karthikeyan',
    location: 'Coimbatore, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 800,
    description: 'Fragrant and rich in curcumin, known for its medicinal properties and vibrant color.'
  },
  {
    id: 14,
    name: 'Virudhunagar Chilli',
    price: 180,
    rating: 4.4,
    category: 'Spices',
    image: 'https://source.unsplash.com/random/300x200?chilli',
    inStock: true,
    isOrganic: false,
    farmer: 'Senthil',
    location: 'Virudhunagar, Tamil Nadu',
    unit: 'kg',
    moq: '1',
    stock: 400,
    description: 'Famous Gundu chillies known for their vibrant red color and medium heat, perfect for sambar and chutneys.'
  },
  {
    id: 15,
    name: 'Sathyamangalam Tamarind',
    price: 320,
    rating: 4.6,
    category: 'Spices',
    image: 'https://source.unsplash.com/random/300x200?tamarind',
    inStock: true,
    isOrganic: true,
    farmer: 'Karuppasamy',
    location: 'Erode, Tamil Nadu',
    unit: 'kg',
    moq: '1',
    stock: 300,
    description: 'Organic tamarind known for its rich flavor and deep brown color, grown in the Sathyamangalam region.'
  },
  {
    id: 16,
    name: 'Avinashi Ginger',
    price: 85,
    rating: 4.5,
    category: 'Spices',
    image: 'https://source.unsplash.com/random/300x200?ginger',
    inStock: true,
    isOrganic: true,
    farmer: 'Ganesan',
    location: 'Tiruppur, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 700,
    description: 'Aromatic ginger with high oil content, known for its strong flavor and medicinal properties.'
  },
  {
    id: 17,
    name: 'Dindigul Garlic',
    price: 110,
    rating: 4.4,
    category: 'Spices',
    image: 'https://source.unsplash.com/random/300x200?garlic',
    inStock: true,
    isOrganic: false,
    farmer: 'Kumar',
    location: 'Dindigul, Tamil Nadu',
    unit: 'kg',
    moq: '1',
    stock: 500,
    description: 'Pungent and flavorful garlic bulbs, essential for South Indian cooking and traditional medicine.'
  },
  
  // ===== FIBER CROPS (86-90) =====
  {
    id: 18,
    name: 'Kancheepuram Silk Cotton',
    price: 3200,
    rating: 4.5,
    category: 'Fiber Crops',
    image: 'https://source.unsplash.com/random/300x200?cotton',
    inStock: true,
    isOrganic: true,
    isBestSeller: true,
    farmer: 'Arunachalam',
    location: 'Kancheepuram, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1000,
    description: 'Premium quality cotton used in famous Kancheepuram silk sarees. Grown organically with traditional methods.'
  },
  {
    id: 19,
    name: 'Erode Jute',
    price: 2800,
    rating: 4.3,
    category: 'Fiber Crops',
    image: 'https://source.unsplash.com/random/300x200?jute',
    inStock: true,
    isOrganic: true,
    farmer: 'Ravi',
    location: 'Erode, Tamil Nadu',
    unit: 'quintal',
    moq: '1',
    stock: 50,
    description: 'High-quality jute fiber, perfect for making eco-friendly bags and textiles.'
  },
  
  // ===== BEVERAGES (91-95) =====
  {
    id: 20,
    name: 'Yercaud Coffee',
    price: 850,
    rating: 4.8,
    category: 'Beverages',
    image: 'https://source.unsplash.com/random/300x200?coffee-beans',
    inStock: true,
    isOrganic: true,
    isBestSeller: true,
    farmer: 'Sundar',
    location: 'Yercaud, Tamil Nadu',
    unit: 'kg',
    moq: '0.25',
    stock: 200,
    description: 'Premium Arabica coffee beans grown in the misty hills of Yercaud, known for their rich aroma and balanced flavor.'
  },
  // ===== OILSEEDS (96-100) =====
  {
    id: 21,
    name: 'Coonoor Tea',
    price: 1200,
    rating: 4.7,
    category: 'Beverages',
    image: 'https://source.unsplash.com/random/300x200?tea-leaves',
    inStock: true,
    isOrganic: true,
    farmer: 'Meenakshi',
    location: 'Coonoor, Tamil Nadu',
    unit: 'kg',
    moq: '0.25',
    stock: 150,
    description: 'Finest quality tea leaves from the Nilgiri hills, known for their bright color and brisk flavor.'
  },
  
  // ===== OILSEEDS =====
  {
    id: 22,
    name: 'Groundnut',
    price: 110,
    rating: 4.3,
    category: 'Oilseeds',
    image: 'https://source.unsplash.com/random/300x200?peanuts',
    inStock: true,
    isOrganic: false,
    farmer: 'Palanisamy',
    location: 'Vellore, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 2000,
    description: 'High-quality groundnuts, rich in protein and healthy fats, perfect for oil extraction and snacks.'
  },
  {
    id: 23,
    name: 'Coconut',
    price: 25,
    rating: 4.6,
    category: 'Oilseeds',
    image: 'https://source.unsplash.com/random/300x200?coconut',
    inStock: true,
    isOrganic: true,
    farmer: 'Murugesan',
    location: 'Thanjavur, Tamil Nadu',
    unit: 'piece',
    moq: '10',
    stock: 5000,
    description: 'Fresh organic coconuts from the Cauvery delta, perfect for cooking and extracting virgin coconut oil.'
  },
  
  // ===== FLOWERS =====
  {
    id: 24,
    name: 'Madurai Malli (Jasmine)',
    price: 400,
    rating: 4.8,
    category: 'Flowers',
    image: 'https://source.unsplash.com/random/300x200?jasmine',
    inStock: true,
    isOrganic: true,
    isBestSeller: true,
    farmer: 'Lakshmi',
    location: 'Madurai, Tamil Nadu',
    unit: 'kg',
    moq: '0.5',
    stock: 200,
    description: 'Fragrant Madurai malli jasmine flowers, known for their rich aroma and long shelf life.'
  },
  {
    id: 25,
    name: 'Kancheepuram Rose',
    price: 350,
    rating: 4.5,
    category: 'Flowers',
    image: 'https://source.unsplash.com/random/300x200?rose',
    inStock: true,
    isOrganic: true,
    farmer: 'Geetha',
    location: 'Kancheepuram, Tamil Nadu',
    unit: 'kg',
    moq: '0.5',
    stock: 150,
    description: 'Beautiful and fragrant roses used for religious offerings and decoration.'
  },
  
  // ===== MEDICINAL PLANTS =====
  {
    id: 26,
    name: 'Nilgiri Tulsai',
    price: 150,
    rating: 4.6,
    category: 'Medicinal',
    image: 'https://source.unsplash.com/random/300x200?holy-basil',
    inStock: true,
    isOrganic: true,
    farmer: 'Rajamani',
    location: 'The Nilgiris, Tamil Nadu',
    unit: 'bunch',
    moq: '5',
    stock: 300,
    description: 'Sacred tulsi leaves with medicinal properties, used in Ayurveda for various remedies.'
  },
  {
    id: 27,
    name: 'Aloe Vera',
    price: 40,
    rating: 4.4,
    category: 'Medicinal',
    image: 'https://source.unsplash.com/random/300x200?aloe-vera',
    inStock: true,
    isOrganic: true,
    farmer: 'Kavitha',
    location: 'Coimbatore, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 500,
    description: 'Fresh aloe vera leaves, rich in vitamins and minerals, used in cosmetics and traditional medicine.'
  },
  
  // ===== CASH CROPS =====
  {
    id: 28,
    name: 'Sugarcane',
    price: 35,
    rating: 4.2,
    category: 'Cash Crops',
    image: 'https://source.unsplash.com/random/300x200?sugarcane',
    inStock: true,
    isOrganic: false,
    farmer: 'Maniyappan',
    location: 'Tiruvallur, Tamil Nadu',
    unit: 'kg',
    moq: '10',
    stock: 10000,
    description: 'Sweet and juicy sugarcane, perfect for juice extraction and direct consumption.'
  },
  {
    id: 29,
    name: 'Tobacco',
    price: 2800,
    rating: 4.0,
    category: 'Cash Crops',
    image: 'https://source.unsplash.com/random/300x200?tobacco',
    inStock: true,
    isOrganic: false,
    farmer: 'Karunanithi',
    location: 'Dindigul, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 2000,
    description: 'Premium quality tobacco leaves, sun-cured and ready for processing.'
  },
  
  // ===== TUBERS =====
  {
    id: 30,
    name: 'Tapioca',
    price: 28,
    rating: 4.1,
    category: 'Tubers',
    image: 'https://source.unsplash.com/random/300x200?cassava',
    inStock: true,
    isOrganic: true,
    farmer: 'Pandi',
    location: 'Salem, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 3000,
    description: 'Fresh tapioca roots, a staple food in Tamil Nadu, rich in carbohydrates.'
  },
  {
    id: 31,
    name: 'Sweet Potato',
    price: 40,
    rating: 4.3,
    category: 'Tubers',
    image: 'https://source.unsplash.com/random/300x200?sweet-potato',
    inStock: true,
    isOrganic: true,
    farmer: 'Selvam',
    location: 'Namakkal, Tamil Nadu',
    unit: 'kg',
    moq: '3',
    stock: 1500,
    description: 'Naturally sweet and nutritious sweet potatoes, rich in fiber and vitamins.'
  },
  
  // ===== DRY FRUITS =====
  {
    id: 32,
    name: 'Cashew Nut',
    price: 850,
    rating: 4.7,
    category: 'Dry Fruits',
    image: 'https://source.unsplash.com/random/300x200?cashew',
    inStock: true,
    isOrganic: true,
    farmer: 'Kannan',
    location: 'Cuddalore, Tamil Nadu',
    unit: 'kg',
    moq: '0.5',
    stock: 500,
    description: 'Premium quality cashew nuts, rich in healthy fats and protein.'
  },
  {
    id: 33,
    name: 'Almonds',
    price: 950,
    rating: 4.8,
    category: 'Dry Fruits',
    image: 'https://source.unsplash.com/random/300x200?almonds',
    inStock: true,
    isOrganic: true,
    farmer: 'Arun',
    location: 'Dharmapuri, Tamil Nadu',
    unit: 'kg',
    moq: '0.5',
    stock: 300,
    description: 'Premium quality almonds, a rich source of healthy fats, protein, and vitamin E.'
  },
  
  // ===== LEAFY VEGETABLES =====
  {
    id: 34,
    name: 'Moringa (Drumstick Leaves)',
    price: 60,
    rating: 4.6,
    category: 'Leafy Vegetables',
    image: 'https://source.unsplash.com/random/300x200?moringa',
    inStock: true,
    isOrganic: true,
    farmer: 'Vasanthi',
    location: 'Villupuram, Tamil Nadu',
    unit: 'bunch',
    moq: '5',
    stock: 1000,
    description: 'Nutrient-rich moringa leaves, packed with vitamins and minerals, perfect for soups and curries.'
  },
  {
    id: 35,
    name: 'Curry Leaves',
    price: 40,
    rating: 4.5,
    category: 'Leafy Vegetables',
    image: 'https://source.unsplash.com/random/300x200?curry-leaves',
    inStock: true,
    isOrganic: true,
    farmer: 'Meenakshi',
    location: 'Karur, Tamil Nadu',
    unit: 'bunch',
    moq: '10',
    stock: 2000,
    description: 'Aromatic curry leaves, essential for tempering and flavoring South Indian dishes.'
  },
  
  // ===== GOURDS =====
  {
    id: 36,
    name: 'Bitter Gourd',
    price: 50,
    rating: 4.0,
    category: 'Vegetables',
    image: 'https://source.unsplash.com/random/300x200?bitter-gourd',
    inStock: true,
    isOrganic: true,
    farmer: 'Suresh',
    location: 'Tirunelveli, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 800,
    description: 'Organic bitter gourd, known for its blood sugar regulating properties and distinct flavor.'
  },
  {
    id: 37,
    name: 'Bottle Gourd',
    price: 35,
    rating: 4.2,
    category: 'Vegetables',
    image: 'https://source.unsplash.com/random/300x200?bottle-gourd',
    inStock: true,
    isOrganic: true,
    farmer: 'Ravi',
    location: 'Erode, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 1000,
    description: 'Fresh bottle gourd, low in calories and rich in water content, perfect for curries and soups.'
  },
  
  // ===== CITRUS FRUITS =====
  {
    id: 38,
    name: 'Nagpur Orange',
    price: 65,
    rating: 4.5,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?orange',
    inStock: true,
    isSeasonal: true,
    season: 'Winter',
    farmer: 'Prakash',
    location: 'Dharmapuri, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 1200,
    description: 'Juicy and sweet Nagpur oranges, rich in vitamin C and antioxidants.'
  },
  {
    id: 39,
    name: 'Lemon',
    price: 45,
    rating: 4.4,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?lemon',
    inStock: true,
    isOrganic: true,
    farmer: 'Mani',
    location: 'Tiruchirapalli, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 1500,
    description: 'Fresh organic lemons, rich in vitamin C and perfect for culinary and medicinal uses.'
  },
  
  // ===== ROOT VEGETABLES =====
  {
    id: 40,
    name: 'Beetroot',
    price: 40,
    rating: 4.3,
    category: 'Vegetables',
    image: 'https://source.unsplash.com/random/300x200?beetroot',
    inStock: true,
    isOrganic: true,
    farmer: 'Kumar',
    location: 'Kanchipuram, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 800,
    description: 'Fresh organic beetroots, rich in iron and antioxidants, perfect for salads and juices.'
  },
  {
    id: 41,
    name: 'Radish',
    price: 30,
    rating: 4.1,
    category: 'Vegetables',
    image: 'https://source.unsplash.com/random/300x200?radish',
    inStock: true,
    isOrganic: true,
    farmer: 'Sundar',
    location: 'Vellore, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 1000,
    description: 'Crisp and mildly pungent radishes, perfect for salads and South Indian dishes.'
  },
  
  // ===== LEGUMES =====
  {
    id: 42,
    name: 'Green Gram (Moong Dal)',
    price: 95,
    rating: 4.4,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?mung-beans',
    inStock: true,
    isOrganic: true,
    farmer: 'Rajendran',
    location: 'Tiruvannamalai, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 1200,
    description: 'High-quality green gram, rich in protein and fiber, perfect for dals and sprouts.'
  },
  {
    id: 43,
    name: 'Chickpeas (Kabuli Chana)',
    price: 110,
    rating: 4.5,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?chickpeas',
    inStock: true,
    isOrganic: false,
    farmer: 'Mohan',
    location: 'Salem, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 1500,
    description: 'Premium quality chickpeas, perfect for making chana masala and other Indian dishes.'
  },
  
  // ===== CEREALS (CONTINUED) =====
  {
    id: 44,
    name: 'Ragi (Finger Millet)',
    price: 55,
    rating: 4.6,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?finger-millet',
    inStock: true,
    isOrganic: true,
    farmer: 'Karuppiah',
    location: 'Dharmapuri, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 2000,
    description: 'Nutrient-dense ragi flour, rich in calcium and iron, perfect for porridge and traditional dishes.'
  },
  {
    id: 45,
    name: 'Foxtail Millet (Thinai)',
    price: 75,
    rating: 4.5,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?millet',
    inStock: true,
    isOrganic: true,
    farmer: 'Mariyappan',
    location: 'Dharmapuri, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 1800,
    description: 'Ancient grain rich in protein and fiber, gluten-free and perfect for a healthy diet.'
  },
  
  // ===== OILSEEDS (CONTINUED) =====
  {
    id: 46,
    name: 'Sesame Seeds (Til)',
    price: 180,
    rating: 4.4,
    category: 'Oilseeds',
    image: 'https://source.unsplash.com/random/300x200?sesame',
    inStock: true,
    isOrganic: true,
    farmer: 'Ramesh',
    location: 'Vellore, Tamil Nadu',
    unit: 'kg',
    moq: '1',
    stock: 900,
    description: 'Nutrient-rich sesame seeds, perfect for oil extraction and culinary uses.'
  },
  {
    id: 47,
    name: 'Sunflower Seeds',
    price: 150,
    rating: 4.3,
    category: 'Oilseeds',
    image: 'https://source.unsplash.com/random/300x200?sunflower-seeds',
    inStock: true,
    isOrganic: true,
    farmer: 'Senthil',
    location: 'Theni, Tamil Nadu',
    unit: 'kg',
    moq: '1',
    stock: 700,
    description: 'Premium quality sunflower seeds, rich in healthy fats and vitamin E.'
  },
  
  // ===== SPICES (CONTINUED) =====
  {
    id: 48,
    name: 'Coriander Seeds',
    price: 95,
    rating: 4.4,
    category: 'Spices',
    image: 'https://source.unsplash.com/random/300x200?coriander-seeds',
    inStock: true,
    isOrganic: true,
    farmer: 'Manoharan',
    location: 'Erode, Tamil Nadu',
    unit: 'kg',
    moq: '1',
    stock: 800,
    description: 'Aromatic coriander seeds, essential for South Indian tempering and spice blends.'
  },
  
  // ===== FRUITS (CONTINUED) =====
  {
    id: 49,
    name: 'Guava',
    price: 60,
    rating: 4.5,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?guava',
    inStock: true,
    isOrganic: true,
    farmer: 'Prakash',
    location: 'Dindigul, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 900,
    description: 'Sweet and nutritious guavas, rich in vitamin C and dietary fiber.'
  },
  
  // ===== VEGETABLES (CONTINUED) =====
  {
    id: 50,
    name: 'Brinjal (Eggplant)',
    price: 45,
    rating: 4.2,
    category: 'Vegetables',
    image: 'https://source.unsplash.com/random/300x200?eggplant',
    inStock: true,
    isOrganic: true,
    farmer: 'Karthik',
    location: 'Tiruvannamalai, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 1200,
    description: 'Fresh and tender brinjals, perfect for making traditional South Indian curries and sambar.'
  },
  {
    id: 42,
    name: 'Coimbatore Turmeric',
    price: 220,
    rating: 4.7,
    category: 'Spices',
    image: 'https://source.unsplash.com/random/300x200?turmeric',
    inStock: true,
    isOrganic: true,
    farmer: 'Karthikeyan',
    location: 'Coimbatore, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 800,
    description: 'Fragrant and rich in curcumin, known for its medicinal properties and vibrant color.'
  },
  {
    id: 4,
    name: 'Madurai Mango (Alphonso)',
    price: 750,
    rating: 4.8,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?mango',
    inStock: true,
    isSeasonal: true,
    season: 'Summer',
    farmer: 'Pandian',
    location: 'Madurai, Tamil Nadu',
    unit: 'dozen',
    moq: '1',
    stock: 200,
    description: 'Sweet and fiberless Alphonso mangoes, known as the king of fruits. Grown in the fertile lands of Madurai.'
  },
  {
    id: 5,
    name: 'Kodaikanal Potato',
    price: 45,
    rating: 4.4,
    category: 'Vegetables',
    image: 'https://source.unsplash.com/random/300x200?potato',
    inStock: true,
    isOrganic: true,
    farmer: 'Murugan',
    location: 'Kodaikanal, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1500,
    description: 'Organic potatoes grown in the cool climate of Kodaikanal hills, known for their excellent taste and texture.'
  },
  {
    id: 6,
    name: 'Sengottai Banana',
    price: 50,
    rating: 4.6,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?banana',
    inStock: true,
    isOrganic: true,
    farmer: 'Mani',
    location: 'Tirunelveli, Tamil Nadu',
    unit: 'dozen',
    moq: '2',
    stock: 800,
    description: 'Sweet and nutritious bananas grown in the fertile lands of Tirunelveli district.'
  },
  {
    id: 7,
    name: 'Krishnagiri Mango (Totapuri)',
    price: 65,
    rating: 4.3,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?mango',
    inStock: true,
    isSeasonal: true,
    season: 'Summer',
    farmer: 'Ramesh',
    location: 'Krishnagiri, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1200,
    description: 'Totapuri mangoes known for their unique shape and tangy-sweet taste, perfect for pickles and juices.'
  },
  {
    id: 8,
    name: 'Ooty Carrot',
    price: 55,
    rating: 4.5,
    category: 'Vegetables',
    image: 'https://source.unsplash.com/random/300x200?carrot',
    inStock: true,
    isOrganic: true,
    farmer: 'Rajendran',
    location: 'Ooty, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 900,
    description: 'Sweet and crunchy carrots grown in the cool climate of Ooty, rich in beta-carotene.'
  },
  {
    id: 9,
    name: 'Virudhunagar Chilli',
    price: 180,
    rating: 4.4,
    category: 'Spices',
    image: 'https://source.unsplash.com/random/300x200?chilli',
    inStock: true,
    isOrganic: false,
    farmer: 'Senthil',
    location: 'Virudhunagar, Tamil Nadu',
    unit: 'kg',
    moq: '1',
    stock: 400,
    description: 'Famous Gundu chillies known for their vibrant red color and medium heat, perfect for sambar and chutneys.'
  },
  {
    id: 10,
    name: 'Sathyamangalam Tamarind',
    price: 320,
    rating: 4.6,
    category: 'Spices',
    image: 'https://source.unsplash.com/random/300x200?tamarind',
    inStock: true,
    isOrganic: true,
    farmer: 'Karuppasamy',
    location: 'Erode, Tamil Nadu',
    unit: 'kg',
    moq: '1',
    stock: 300,
    description: 'Organic tamarind known for its rich flavor and deep brown color, grown in the Sathyamangalam region.'
  },
  {
    id: 11,
    name: 'Cumbum Grapes',
    price: 95,
    rating: 4.7,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?grapes',
    inStock: true,
    isSeasonal: true,
    season: 'Winter',
    farmer: 'Muthu',
    location: 'Theni, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 600,
    description: 'Sweet and seedless grapes grown in the Cumbum valley, known for their unique taste and high sugar content.'
  },
  // ===== GINGER =====
  {
    id: 12,
    name: 'Avinashi Ginger',
    price: 85,
    rating: 4.5,
    category: 'Spices',
    image: 'https://source.unsplash.com/random/300x200?ginger',
    inStock: true,
    isOrganic: true,
    farmer: 'Ganesan',
    location: 'Tiruppur, Tamil Nadu',
    unit: 'kg',
    moq: '2',
    stock: 700,
    description: 'Aromatic ginger with high oil content, known for its strong flavor and medicinal properties.'
  },
  {
    id: 13,
    name: 'Dindigul Garlic',
    price: 110,
    rating: 4.4,
    category: 'Spices',
    image: 'https://source.unsplash.com/random/300x200?garlic',
    inStock: true,
    isOrganic: false,
    farmer: 'Kumar',
    location: 'Dindigul, Tamil Nadu',
    unit: 'kg',
    moq: '1',
    stock: 500,
    description: 'Pungent and flavorful garlic bulbs, essential for South Indian cooking and traditional medicine.'
  },
  {
    id: 14,
    name: 'Kancheepuram Silk Cotton',
    price: 3200,
    rating: 4.5,
    category: 'Fiber Crops',
    image: 'https://source.unsplash.com/random/300x200?cotton',
    inStock: true,
    isOrganic: true,
    isBestSeller: true,
    farmer: 'Arunachalam',
    location: 'Kancheepuram, Tamil Nadu',
    unit: 'kg',
    moq: '5',
    stock: 1000,
    description: 'Premium quality cotton used in famous Kancheepuram silk sarees. Grown organically with traditional methods.'
  },
  {
    id: 15,
    name: 'Salem Mango (Malgova)',
    price: 800,
    rating: 4.9,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?alphonso-mango',
    inStock: true,
    farmer: 'Sunita Patil',
    location: 'Ratnagiri, Maharashtra',
    unit: 'dozen',
    moq: '1',
    stock: 200,
    description: 'Premium Alphonso mangoes, famously known as Hapus, directly from the orchards of Ratnagiri. Sweet, fiberless and full of flavor.',
    specifications: {
      'Variety': 'Alphonso',
      'Grade': 'A',
      'Weight': '250-300g per piece',
      'Shelf Life': '5-7 days at room temperature',
      'Packing': 'Wooden box with straw padding'
    },
    farmerDetails: {
      name: 'Sunita Patil',
      experience: '12 years',
      farmSize: '15 acres',
      rating: 4.9,
      about: 'Award-winning mango farmer specializing in organic Alphonso cultivation. Follows traditional farming methods.'
    }
  },
  {
    id: 3,
    name: 'Sharbati Wheat',
    price: 35,
    rating: 4.6,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?wheat-field',
    inStock: true,
    farmer: 'Vijay Singh',
    location: 'Sehore, Madhya Pradesh',
    unit: 'kg',
    moq: '10 kg',
    stock: 2000,
    description: 'Premium quality Sharbati wheat, known for its golden color and high protein content. Ideal for making soft chapatis.',
    specifications: {
      'Type': 'Sharbati',
      'Protein': '12-14%',
      'Moisture': '10%',
      'Gluten': '10-12%',
      'Packing': 'Jute bags',
      'Shelf Life': '12 months'
    },
    farmerDetails: {
      name: 'Vijay Singh',
      experience: '20 years',
      farmSize: '50 acres',
      rating: 4.6,
      about: 'Progressive farmer practicing sustainable agriculture. Specializes in premium quality wheat production.'
    }
  },
  {
    id: 4,
    name: 'Darjeeling Tea',
    price: 1200,
    rating: 4.8,
    category: 'Beverages',
    image: 'https://source.unsplash.com/random/300x200?darjeeling-tea',
    inStock: true,
    farmer: 'Amitava Choudhury',
    location: 'Darjeeling, West Bengal',
    unit: '100g',
    moq: '1',
    stock: 150,
    description: 'First flush Darjeeling tea leaves, known as the "Champagne of Teas". Floral aroma and muscatel flavor.',
    specifications: {
      'Type': 'Black Tea',
      'Flush': 'First Flush',
      'Grade': 'FTGFOP1',
      'Caffeine': 'Medium',
      'Origin': 'Darjeeling',
      'Harvest': 'Spring 2024'
    },
    farmerDetails: {
      name: 'Amitava Choudhury',
      experience: '25 years',
      farmSize: '30 acres',
      rating: 4.8,
      about: 'Fourth generation tea planter managing a heritage tea estate in Darjeeling. Focuses on sustainable and ethical tea production.'
    }
  },
  {
    id: 5,
    name: 'Kashmiri Saffron',
    price: 2500,
    rating: 4.9,
    category: 'Spices',
    image: 'https://source.unsplash.com/random/300x200?saffron',
    inStock: true,
    farmer: 'Iqbal Wani',
    location: 'Pampore, Jammu & Kashmir',
    unit: '1g',
    moq: '1g',
    stock: 500,
    description: 'Premium Kashmiri saffron (Mongra variety) known for its deep red color, strong aroma, and rich flavor. Hand-picked from the saffron fields of Pampore.',
    specifications: {
      'Type': 'Mongra',
      'Color': 'Deep Red',
      'Aroma': 'Strong',
      'Purity': '100% Pure',
      'Origin': 'Pampore, Kashmir',
      'Harvest': 'Autumn 2023'
    },
    farmerDetails: {
      name: 'Iqbal Wani',
      experience: '30 years',
      farmSize: '2 acres',
      rating: 4.9,
      about: 'Third generation saffron farmer from Pampore. Specializes in premium quality Kashmiri saffron production using traditional methods.'
    }
  },
  {
    id: 6,
    name: 'Alphonso Mango',
    price: 800,
    rating: 4.9,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?mango',
    inStock: true,
    farmer: 'Sunita Patil',
    location: 'Ratnagiri, Maharashtra',
    unit: 'dozen',
    moq: '1',
    stock: 150,
    description: 'Premium Alphonso mangoes, famously known as Hapus, directly from the orchards of Ratnagiri. Sweet, fiberless and full of flavor.',
    specifications: {
      'Variety': 'Alphonso',
      'Grade': 'A',
      'Weight': '250-300g per piece',
      'Shelf Life': '5-7 days at room temperature',
      'Packing': 'Wooden box with straw padding'
    },
    farmerDetails: {
      name: 'Sunita Patil',
      experience: '12 years',
      farmSize: '15 acres',
      rating: 4.9,
      about: 'Award-winning mango farmer specializing in organic Alphonso cultivation. Follows traditional farming methods.'
    }
  },
  // ===== WHEAT =====
  {
    id: 7,
    name: 'Sharbati Wheat',
    price: 35,
    rating: 4.6,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?wheat',
    inStock: true,
    farmer: 'Vijay Singh',
    location: 'Sehore, Madhya Pradesh',
    unit: 'kg',
    moq: '10 kg',
    stock: 1500,
    description: 'Premium quality Sharbati wheat, known for its golden color and high protein content. Ideal for making soft chapatis.',
    specifications: {
      'Type': 'Sharbati',
      'Protein': '12-14%',
      'Moisture': '10%',
      'Gluten': '10-12%',
      'Packing': 'Jute bags',
      'Shelf Life': '12 months'
    },
    farmerDetails: {
      name: 'Vijay Singh',
      experience: '20 years',
      farmSize: '50 acres',
      rating: 4.6,
      about: 'Progressive farmer practicing sustainable agriculture. Specializes in premium quality wheat production.'
    }
  },
  {
    id: 8,
    name: 'Chana Dal',
    price: 120,
    rating: 4.4,
    category: 'Pulses',
    image: 'https://source.unsplash.com/random/300x200?chana-dal',
    inStock: true,
    farmer: 'Ramesh Patel',
    location: 'Indore, Madhya Pradesh',
    unit: 'kg',
    moq: '5 kg',
    stock: 800,
    description: 'High-quality split chickpeas, rich in protein and fiber. Perfect for making traditional Indian dishes like chana masala and dal.',
    specifications: {
      'Type': 'Kabuli Chana',
      'Protein': '20-22g per 100g',
      'Fiber': '10-12g per 100g',
      'Packing': 'Plastic-free packaging',
      'Shelf Life': '12 months',
      'Origin': 'Madhya Pradesh'
    },
    farmerDetails: {
      name: 'Ramesh Patel',
      experience: '18 years',
      farmSize: '40 acres',
      rating: 4.4,
      about: 'Experienced pulse farmer focused on sustainable farming practices. Specializes in high-protein pulse varieties.'
    }
  },
  {
    id: 9,
    name: 'Sugarcane',
    price: 35,
    rating: 4.3,
    category: 'Cash Crops',
    image: 'https://source.unsplash.com/random/300x200?sugarcane',
    inStock: true,
    farmer: 'Rajesh Yadav',
    location: 'Meerut, Uttar Pradesh',
    unit: 'kg',
    moq: '20 kg',
    stock: 5000,
    description: 'Fresh, sweet sugarcane grown in the fertile plains of Uttar Pradesh. Perfect for juicing or chewing.',
    specifications: {
      'Variety': 'Co 0238',
      'Sucrose Content': '18-20%',
      'Fiber': '12-14%',
      'Packing': 'Bundles of 10kg',
      'Shelf Life': '7-10 days',
      'Harvest': 'November to March'
    },
    farmerDetails: {
      name: 'Rajesh Yadav',
      experience: '15 years',
      farmSize: '30 acres',
      rating: 4.3,
      about: 'Progressive sugarcane farmer using modern irrigation techniques. Focuses on high-yield, high-sucrose varieties.'
    }
  },
  {
    id: 10,
    name: 'Cotton',
    price: 6500,
    rating: 4.2,
    category: 'Cash Crops',
    image: 'https://source.unsplash.com/random/300x200?cotton',
    inStock: true,
    farmer: 'Prakash Patel',
    location: 'Vidarbha, Maharashtra',
    unit: 'quintal',
    moq: '1 quintal',
    stock: 100,
    description: 'Premium quality cotton with long staple length, ideal for textile industry. Grown using sustainable farming practices.',
    specifications: {
      'Type': 'BT Cotton',
      'Staple Length': '28-30mm',
      'Micronaire': '3.8-4.2',
      'Strength': '28-30 g/tex',
      'Packing': 'Standard bales',
      'Harvest': 'October to February'
    },
    farmerDetails: {
      name: 'Prakash Patel',
      experience: '22 years',
      farmSize: '35 acres',
      rating: 4.2,
      about: 'Cotton farming expert focused on sustainable and high-yield cotton production. Uses integrated pest management techniques.'
    }
  },
  {
    id: 11,
    name: 'Jute',
    price: 5800,
    rating: 4.1,
    category: 'Cash Crops',
    image: 'https://source.unsplash.com/random/300x200?jute',
    inStock: true,
    farmer: 'Amit Das',
    location: 'Nadia, West Bengal',
    unit: 'quintal',
    moq: '1 quintal',
    stock: 75,
    description: 'Golden fiber jute, known as the "golden fiber of India", grown in the fertile Gangetic plains. Used for making eco-friendly packaging materials.',
    specifications: {
      'Type': 'Tossa Jute',
      'Fiber Length': '6-8 feet',
      'Color': 'Golden Brown',
      'Tensile Strength': 'High',
      'Packing': 'Standard bales',
      'Harvest': 'July to September'
    },
    farmerDetails: {
      name: 'Amit Das',
      experience: '18 years',
      farmSize: '15 acres',
      rating: 4.1,
      about: 'Traditional jute farmer committed to sustainable agriculture. Specializes in high-quality jute fiber production.'
    }
  },
  // ===== OILSEEDS =====
  {
    id: 12,
    name: 'Mustard Seeds',
    price: 95,
    rating: 4.0,
    category: 'Oilseeds',
    image: 'https://source.unsplash.com/random/300x200?mustard-seeds',
    inStock: true,
    farmer: 'Harpreet Kaur',
    location: 'Bathinda, Punjab',
    unit: 'kg',
    moq: '10',
    stock: 2000,
    description: 'High-quality mustard seeds with excellent oil content. Ideal for oil extraction and culinary uses.',
    specifications: {
      'Type': 'Pusa Bold',
      'Oil Content': '42-44%',
      'Moisture': '8% max',
      'Purity': '99%',
      'Packing': 'Jute bags',
      'Shelf Life': '12 months'
    },
    farmerDetails: {
      name: 'Harpreet Kaur',
      experience: '14 years',
      farmSize: '25 acres',
      rating: 4.0,
      about: 'Progressive oilseed farmer using modern agricultural practices. Specializes in high-yield mustard varieties.'
    }
  },
  
  // ===== FRUITS (101-120) =====
  {
    id: 101,
    name: 'Alphonso Mango',
    price: 250,
    rating: 4.8,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?alphonso-mango',
    inStock: true,
    isOrganic: true,
    isBestSeller: true,
    farmer: 'Rajesh Patil',
    location: 'Ratnagiri, Maharashtra',
    unit: 'kg',
    moq: '5',
    stock: 1000,
    description: 'Premium Alphonso mangoes, known as the king of fruits, with rich flavor and smooth texture.'
  },
  {
    id: 102,
    name: 'Nagpur Orange',
    price: 80,
    rating: 4.5,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?orange',
    inStock: true,
    isOrganic: true,
    farmer: 'Vijay Deshmukh',
    location: 'Nagpur, Maharashtra',
    unit: 'kg',
    moq: '5',
    stock: 1500,
    description: 'Juicy Nagpur oranges, rich in vitamin C and known for their sweet-tangy flavor.'
  },
  {
    id: 103,
    name: 'Shimla Apple',
    price: 120,
    rating: 4.6,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?apple',
    inStock: true,
    isOrganic: true,
    farmer: 'Ramesh Thakur',
    location: 'Shimla, Himachal Pradesh',
    unit: 'kg',
    moq: '2',
    stock: 2000,
    description: 'Crisp and juicy Shimla apples, grown in the Himalayan foothills.'
  },
  {
    id: 104,
    name: 'Banarasi Langda Mango',
    price: 180,
    rating: 4.7,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?mango',
    inStock: true,
    isOrganic: true,
    farmer: 'Rahul Singh',
    location: 'Varanasi, Uttar Pradesh',
    unit: 'kg',
    moq: '5',
    stock: 1200,
    description: 'Famous Banarasi Langda mangoes, known for their unique flavor and fiberless pulp.'
  },
  {
    id: 105,
    name: 'Dusseheri Mango',
    price: 200,
    rating: 4.6,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?mango',
    inStock: true,
    isOrganic: true,
    farmer: 'Amit Verma',
    location: 'Malihabad, Uttar Pradesh',
    unit: 'kg',
    moq: '5',
    stock: 1500,
    description: 'Premium Dusseheri mangoes, known for their sweet aroma and rich taste.'
  },
  
  // ===== VEGETABLES (106-125) =====
  {
    id: 106,
    name: 'Punjab Bhindi (Okra)',
    price: 60,
    rating: 4.3,
    category: 'Vegetables',
    image: 'https://source.unsplash.com/random/300x200?okra',
    inStock: true,
    isOrganic: true,
    farmer: 'Gurpreet Singh',
    location: 'Ludhiana, Punjab',
    unit: 'kg',
    moq: '5',
    stock: 1000,
    description: 'Fresh and tender Punjab Bhindi, perfect for stir-fries and curries.'
  },
  {
    id: 107,
    name: 'Kashmiri Rajma',
    price: 140,
    rating: 4.6,
    category: 'Vegetables',
    image: 'https://source.unsplash.com/random/300x200?kidney-beans',
    inStock: true,
    isOrganic: true,
    farmer: 'Iqbal Ahmed',
    location: 'Srinagar, Jammu & Kashmir',
    unit: 'kg',
    moq: '2',
    stock: 800,
    description: 'Premium Kashmiri Rajma, known for its large size and creamy texture.'
  },
  {
    id: 108,
    name: 'Maharashtra Alphonso Mango',
    price: 280,
    rating: 4.8,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?alphonso-mango',
    inStock: true,
    isOrganic: true,
    isBestSeller: true,
    farmer: 'Sunil Patil',
    location: 'Ratnagiri, Maharashtra',
    unit: 'kg',
    moq: '5',
    stock: 1500,
    description: 'Premium quality Alphonso mangoes from the Konkan region of Maharashtra.'
  },
  {
    id: 109,
    name: 'Nashik Grapes',
    price: 85,
    rating: 4.5,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?grapes',
    inStock: true,
    isOrganic: true,
    farmer: 'Rahul Patil',
    location: 'Nashik, Maharashtra',
    unit: 'kg',
    moq: '2',
    stock: 2000,
    description: 'Sweet and juicy Nashik grapes, perfect for fresh consumption and winemaking.'
  },
  {
    id: 110,
    name: 'Coorg Orange',
    price: 90,
    rating: 4.4,
    category: 'Fruits',
    image: 'https://source.unsplash.com/random/300x200?orange',
    inStock: true,
    isOrganic: true,
    farmer: 'Manoj Gowda',
    location: 'Madikeri, Karnataka',
    unit: 'kg',
    moq: '2',
    stock: 1200,
    description: 'Tangy and sweet Coorg oranges, grown in the Western Ghats.'
  },
  
  // ===== SPICES (111-125) =====
  {
    id: 111,
    name: 'Kashmiri Saffron',
    price: 2500,
    rating: 4.9,
    category: 'Spices',
    image: 'https://source.unsplash.com/random/300x200?saffron',
    inStock: true,
    isOrganic: true,
    isBestSeller: true,
    farmer: 'Tariq Ahmed',
    location: 'Pampore, Jammu & Kashmir',
    unit: 'g',
    moq: '10',
    stock: 500,
    description: 'Premium Kashmiri saffron, known for its rich aroma, color, and flavor.'
  },
  {
    id: 112,
    name: 'Malabar Black Pepper',
    price: 450,
    rating: 4.7,
    category: 'Spices',
    image: 'https://source.unsplash.com/random/300x200?black-pepper',
    inStock: true,
    isOrganic: true,
    farmer: 'Rajeev Menon',
    location: 'Wayanad, Kerala',
    unit: 'kg',
    moq: '1',
    stock: 800,
    description: 'Aromatic Malabar black pepper, handpicked and sun-dried for maximum flavor.'
  },
  {
    id: 113,
    name: 'Alleppey Green Cardamom',
    price: 1800,
    rating: 4.8,
    category: 'Spices',
    image: 'https://source.unsplash.com/random/300x200?cardamom',
    inStock: true,
    isOrganic: true,
    farmer: 'Suresh Nair',
    location: 'Idukki, Kerala',
    unit: 'kg',
    moq: '0.5',
    stock: 300,
    description: 'Premium Alleppey green cardamom, known for its strong aroma and flavor.'
  },
  {
    id: 114,
    name: 'Byadgi Red Chilli',
    price: 320,
    rating: 4.5,
    category: 'Spices',
    image: 'https://source.unsplash.com/random/300x200?red-chilli',
    inStock: true,
    isOrganic: true,
    farmer: 'Prakash Hegde',
    location: 'Haasan, Karnataka',
    unit: 'kg',
    moq: '1',
    stock: 1000,
    description: 'Famous Byadgi chillies, known for their deep red color and mild heat.'
  },
  {
    id: 115,
    name: 'Tellicherry Black Pepper',
    price: 550,
    rating: 4.7,
    category: 'Spices',
    image: 'https://source.unsplash.com/random/300x200?pepper',
    inStock: true,
    isOrganic: true,
    farmer: 'Ramesh Nair',
    location: 'Kannur, Kerala',
    unit: 'kg',
    moq: '1',
    stock: 600,
    description: 'Premium Tellicherry black pepper, known for its large size and bold flavor.'
  }
];

// Categories and filters
const categories = [
  'All', 
  'Cereals', 
  'Pulses', 
  'Vegetables', 
  'Fruits', 
  'Spices', 
  'Beverages',
  'Organic'
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Name (A-Z)' }
];

// Crop Categories for Carousel
const cropCategories = [
  { id: 1, name: 'Rice', image: 'https://source.unsplash.com/random/300x200?rice-field' },
  { id: 2, name: 'Wheat', image: 'https://source.unsplash.com/random/300x200?wheat' },
  { id: 3, name: 'Pulses', image: 'https://source.unsplash.com/random/300x200?lentils' },
  { id: 4, name: 'Vegetables', image: 'https://source.unsplash.com/random/300x200?vegetables' },
  { id: 5, name: 'Fruits', image: 'https://source.unsplash.com/random/300x200?fruits' },
  { id: 6, name: 'Spices', image: 'https://source.unsplash.com/random/300x200?spices' },
  { id: 7, name: 'Tea', image: 'https://source.unsplash.com/random/300x200?tea-plantation' },
  { id: 8, name: 'Coffee', image: 'https://source.unsplash.com/random/300x200?coffee-beans' },
  { id: 9, name: 'Sugarcane', image: 'https://source.unsplash.com/random/300x200?sugarcane' },
  { id: 10, name: 'Cotton', image: 'https://source.unsplash.com/random/300x200?cotton-field' },
  { id: 11, name: 'Jute', image: 'https://source.unsplash.com/random/300x200?jute' },
  { id: 12, name: 'Oilseeds', image: 'https://source.unsplash.com/random/300x200?sunflower' },
  { id: 13, name: 'Millets', image: 'https://source.unsplash.com/random/300x200?millet' },
  { id: 14, name: 'Maize', image: 'https://source.unsplash.com/random/300x200?corn-field' },
  { id: 15, name: 'Herbs', image: 'https://source.unsplash.com/random/300x200?herbs' },
  { id: 16, name: 'Floriculture', image: 'https://source.unsplash.com/random/300x200?flower-farm' },
  { id: 17, name: 'Organic', image: 'https://source.unsplash.com/random/300x200?organic-farming' },
  { id: 18, name: 'Dairy', image: 'https://source.unsplash.com/random/300x200?dairy-farm' },
  { id: 19, name: 'Poultry', image: 'https://source.unsplash.com/random/300x200?poultry-farm' },
  { id: 20, name: 'Honey', image: 'https://source.unsplash.com/random/300x200?honey' },
];

const Products = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [filters, setFilters] = useState({
    organic: false,
    bestSeller: false,
    inStock: false,
  });
  
  const itemsPerPage = 9; // 3 items per row * 3 rows
  
  // Handle carousel navigation
  const handlePrev = () => {
    setCarouselIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    setCarouselIndex(prev => Math.min(cropCategories.length - 3, prev + 1));
  };
  
  // Filter and sort products
  const filteredProducts = mockProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesFilters = 
        (!filters.organic || product.isOrganic) &&
        (!filters.bestSeller || product.isBestSeller) &&
        (!filters.inStock || product.stock > 0);
      
      return matchesSearch && matchesCategory && matchesPrice && matchesFilters;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id;
        default: // featured
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.rating - a.rating;
      }
    });
  
  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle wishlist toggle
  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  
  // Handle filter change
  const handleFilterChange = (filter) => (event) => {
    setFilters(prev => ({
      ...prev,
      [filter]: event.target.checked,
    }));
    setPage(1);
  };
  
  // Handle price range change
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };
  
  // Handle crop category selection
  const handleCropSelect = (crop) => {
    setSelectedCategory(crop.name);
    setPage(1);
  };
  
  // Reset all filters - only one instance should exist
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('featured');
    setPriceRange([0, 5000]);
    setFilters({
      organic: false,
      bestSeller: false,
      inStock: false,
    });
    setPage(1);
  }, [setSearchTerm, setSelectedCategory, setSortBy, setPriceRange, setFilters, setPage]);

  // Calculate carousel transform
  const carouselTransform = `translateX(-${carouselIndex * 33.33}%)`;

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '80vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 700, 
          color: 'primary.main',
          background: 'linear-gradient(45deg, #2e7d32 30%, #81c784 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          Fresh from Indian Farms
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ 
          maxWidth: '800px',
          margin: '0 auto',
          fontSize: '1.1rem',
          lineHeight: 1.6
        }}>
          Discover the finest agricultural produce directly from farmers across India. 
          Each product is carefully selected for quality and freshness.
        </Typography>
      </Box>

      {/* Crop Categories Carousel */}
      <Box sx={{ mb: 6, position: 'relative' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
          Shop by Category
        </Typography>
        <CarouselContainer>
          {carouselIndex > 0 && (
            <NavButton className="prev" onClick={handlePrev}>
              <NavigateBefore />
            </NavButton>
          )}
          
          <CarouselTrack style={{ transform: carouselTransform }} ref={carouselRef}>
            {cropCategories.map((crop) => (
              <CarouselItem 
                key={crop.id} 
                onClick={() => handleCropSelect(crop)}
                sx={{ 
                  border: selectedCategory === crop.name ? `2px solid ${theme.palette.primary.main}` : 'none',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <Card>
                  <CardMedia
                    component="img"
                    height="120"
                    image={crop.image}
                    alt={crop.name}
                  />
                  <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {crop.name}
                    </Typography>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselTrack>
          
          {carouselIndex < cropCategories.length - 3 && (
            <NavButton className="next" onClick={handleNext}>
              <NavigateNext />
            </NavButton>
          )}
        </CarouselContainer>
      </Box>

      {/* Search and Filter Bar */}
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        alignItems: 'center',
        backgroundColor: 'rgba(233, 245, 233, 0.5)',
        p: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <Box sx={{ display: 'flex', gap: 2, flex: 1, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search products..."
            variant="outlined"
            size="small"
            fullWidth={isMobile}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <Close fontSize="small" />
                </IconButton>
              ),
            }}
            sx={{ flexGrow: 1, maxWidth: isMobile ? '100%' : 400 }}
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ ml: 'auto' }}
          >
            Filters
          </Button>
        </Box>
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 180, ml: 2 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort By"
          >
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
            <MenuItem value="rating">Top Rated</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
          </Select>
        </FormControl>
      
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Shop by Category
      </Typography>
      <CarouselContainer>
        {carouselIndex > 0 && (
          <NavButton className="prev" onClick={handlePrev}>
            <NavigateBefore />
          </NavButton>
        )}
        
        <CarouselTrack style={{ transform: carouselTransform }} ref={carouselRef}>
          {cropCategories.map((crop) => (
            <CarouselItem 
              key={crop.id} 
              onClick={() => handleCropSelect(crop)}
              sx={{ 
                border: selectedCategory === crop.name ? `2px solid ${theme.palette.primary.main}` : 'none',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Card>
                <CardMedia
                  component="img"
                  height="120"
                  image={crop.image}
                  alt={crop.name}
                />
                <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {crop.name}
                  </Typography>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselTrack>
        
        {carouselIndex < cropCategories.length - 3 && (
          <NavButton className="next" onClick={handleNext}>
            <NavigateNext />
          </NavButton>
        )}
      </CarouselContainer>
    </Box>

    {/* Search and Filter Bar */}
    <Box sx={{ 
      mb: 4, 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: 2, 
      alignItems: 'center',
      backgroundColor: 'rgba(233, 245, 233, 0.5)',
      p: 2,
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <Box sx={{ display: 'flex', gap: 2, flex: 1, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search products..."
          variant="outlined"
          size="small"
          fullWidth={isMobile}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
            endAdornment: searchTerm && (
              <IconButton size="small" onClick={() => setSearchTerm('')}>
                <Close fontSize="small" />
              </IconButton>
            ),
          }}
          sx={{ flexGrow: 1, maxWidth: isMobile ? '100%' : 400 }}
        />
        
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => setShowFilters(!showFilters)}
          sx={{ ml: 'auto' }}
        >
          Filters
        </Button>
      </Box>
      
      <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          label="Category"
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          label="Sort By"
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>

    {/* Products Grid */}
    <Grid container spacing={3}>
      {paginatedProducts.length > 0 ? (
        paginatedProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <StyledCard key={product.id}>
              {product.isOrganic && (
                <Chip 
                  label="Organic" 
                  color="success" 
                  size="small" 
                  sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    left: 10, 
                    zIndex: 1,
                    fontWeight: 'bold'
                  }} 
                />
              )}
              <CardMedia
                component="img"
                height="220"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography 
                    component="div" 
                    sx={{ 
                      fontWeight: 600,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      height: '3.2em',
                      lineHeight: '1.1'
                    }}
                  >
                    {product.name}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <Favorite 
                        color={wishlist.includes(product.id) ? 'error' : 'action'} 
                        fill={wishlist.includes(product.id) ? 'currentColor' : 'none'}
                      />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating 
                      value={product.rating} 
                      precision={0.1} 
                      readOnly 
                      size="small"
                      emptyIcon={
                        <StarBorder 
                          fontSize="inherit" 
                          sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)' }} 
                        />
                      }
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {product.rating.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>•</Typography>
                    <LocalShipping fontSize="small" color="action" sx={{ fontSize: 16 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      Free
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <VerifiedUser fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {product.farmer}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minHeight: '2.8em'
                    }}
                  >
                    {product.description}
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mt: 'auto',
                    backgroundColor: 'action.hover',
                    p: 1,
                    borderRadius: 1,
                    marginTop: 'auto'
                  }}>
                    <Box>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        ₹{product.price.toLocaleString()}
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                          /{product.unit}
                        </Typography>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        MOQ: {product.moq}
                      </Typography>
                    </Box>
                    
                    <Button 
                      variant="contained" 
                      color="primary"
                      size="small"
                      startIcon={<ShoppingCart />}
                      disabled={product.stock === 0}
                      sx={{ 
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 2,
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: theme.shadows[3],
                        }
                      }}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No products found matching your criteria
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={resetFilters}
            >
              Clear Filters
            </Button>
          </Box>
        )}
      </Grid>

      {/* Pagination */}
      {filteredProducts.length > itemsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            shape="rounded"
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={isMobile ? 0 : 1}
            sx={{
              '& .MuiPaginationItem-root': {
                fontWeight: 600,
              },
              '& .Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          />
        </Box>
      )}
      
      {/* Filters Drawer */}
      <Drawer 
        anchor="right" 
        open={showFilters} 
        onClose={() => setShowFilters(false)}
        PaperProps={{
          sx: { 
            width: { xs: '100%', sm: 350 },
            p: 2,
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="h6" fontWeight={600}>Filters</Typography>
          <IconButton onClick={() => setShowFilters(false)}>
            <Close />
          </IconButton>
        </Box>
        
        <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
          {/* Price Range */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Price Range
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={5000}
              step={50}
              valueLabelFormat={(value) => `₹${value}`}
              sx={{
                color: 'primary.main',
                '& .MuiSlider-valueLabel': {
                  backgroundColor: 'primary.main',
                  '&:before': {
                    borderTopColor: 'primary.main',
                  },
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
              <Typography variant="caption" color="text.secondary">
                ₹{priceRange[0].toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ₹{priceRange[1].toLocaleString()}
              </Typography>
            </Box>
          </Box>
          
          {/* Filters */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Filters
            </Typography>
            <FormGroup>
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={filters.organic}
                    onChange={handleFilterChange('organic')}
                    size="small"
                    color="primary"
                  />
                } 
                label="Organic"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={filters.bestSeller}
                    onChange={handleFilterChange('bestSeller')}
                    size="small"
                    color="primary"
                  />
                } 
                label="Best Sellers"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={filters.inStock}
                    onChange={handleFilterChange('inStock')}
                    size="small"
                    color="primary"
                  />
                } 
                label="In Stock Only"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
            </FormGroup>
          </Box>
          
          {/* Categories */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Categories
            </Typography>
            <List dense disablePadding>
              {categories.map((category) => (
                <ListItem 
                  key={category} 
                  button 
                  selected={selectedCategory === category}
                  onClick={() => {
                    setSelectedCategory(category);
                    if (isMobile) setShowFilters(false);
                  }}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'primary.dark',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                    },
                  }}
                >
                  <ListItemText 
                    primary={category} 
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: selectedCategory === category ? 600 : 'normal'
                    }} 
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
        
        <Box sx={{ 
          pt: 2, 
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          gap: 2
        }}>
          <Button 
            fullWidth 
            variant="outlined" 
            color="primary"
            onClick={resetFilters}
            sx={{ textTransform: 'none' }}
          >
            Reset All
          </Button>
          <Button 
            fullWidth 
            variant="contained" 
            color="primary"
            onClick={() => setShowFilters(false)}
            sx={{ textTransform: 'none' }}
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>
    </Container>
  );
};

export default Products;
