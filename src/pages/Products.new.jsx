import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Container, Typography, Box, Grid, Card, CardContent, CardMedia,
  CardActions, Button, TextField, InputAdornment, Select, MenuItem,
  FormControl, InputLabel, Pagination, Rating, Chip, useMediaQuery,
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

const NavButton = styled(IconButton)(({ theme, direction }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
  zIndex: 2,
  [direction === 'left' ? 'left' : 'right']: 0,
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
}));

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: 'Basmati Rice',
    price: 120,
    rating: 4.7,
    category: 'Cereals',
    image: 'https://source.unsplash.com/random/300x200?rice',
    inStock: true,
    isBestSeller: true,
    isOrganic: true,
    farmer: 'Rajesh Kumar',
    location: 'Dehradun, Uttarakhand',
    unit: 'kg',
    moq: '5',
    description: 'Premium quality Basmati rice with long grains and aromatic fragrance.',
  },
  // Add more mock products as needed
];

// Categories for filtering
const categories = [
  'All',
  'Cereals',
  'Pulses',
  'Vegetables',
  'Fruits',
  'Spices',
  'Nuts',
  'Herbs',
  'Dairy',
  'Grains',
  'Tea & Coffee',
];

// Sort options
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'top-rated', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

// Crop categories for carousel
const cropCategories = [
  { id: 1, name: 'Cereals', image: 'https://source.unsplash.com/random/300x200?cereals' },
  { id: 2, name: 'Pulses', image: 'https://source.unsplash.com/random/300x200?lentils' },
  { id: 3, name: 'Vegetables', image: 'https://source.unsplash.com/random/300x200?vegetables' },
  { id: 4, name: 'Fruits', image: 'https://source.unsplash.com/random/300x200?fruits' },
  { id: 5, name: 'Spices', image: 'https://source.unsplash.com/random/300x200?spices' },
  { id: 6, name: 'Nuts', image: 'https://source.unsplash.com/random/300x200?nuts' },
  { id: 7, name: 'Herbs', image: 'https://source.unsplash.com/random/300x200?herbs' },
  { id: 8, name: 'Dairy', image: 'https://source.unsplash.com/random/300x200?dairy' },
  { id: 9, name: 'Grains', image: 'https://source.unsplash.com/random/300x200?grains' },
  { id: 10, name: 'Tea & Coffee', image: 'https://source.unsplash.com/random/300x200?tea' },
];

const Products = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const carouselRef = useRef(null);
  
  // State for products and filters
  const [products] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  
  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [filters, setFilters] = useState({
    organic: false,
    bestSeller: false,
    inStock: false,
  });
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  // Calculate carousel transform
  const carouselTransform = `translateX(-${carouselIndex * 33.33}%)`;

  // Handle carousel navigation
  const handleNext = () => {
    if (carouselIndex < cropCategories.length - 3) {
      setCarouselIndex(carouselIndex + 1);
    }
  };

  const handlePrev = () => {
    if (carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
    }
  };

  // Toggle wishlist
  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Reset all filters
  const resetFilters = () => {
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
  };

  // Handle crop category selection
  const handleCropSelect = (crop) => {
    setSelectedCategory(crop.name);
    if (isMobile) {
      setShowFilters(false);
    }
  };

  // Filter and sort products
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.farmer.toLowerCase().includes(term) ||
          product.location.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply price range filter
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply additional filters
    if (filters.organic) {
      result = result.filter(product => product.isOrganic);
    }
    if (filters.bestSeller) {
      result = result.filter(product => product.isBestSeller);
    }
    if (filters.inStock) {
      result = result.filter(product => product.inStock);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'top-rated':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'featured':
        default:
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.rating - a.rating;
      }
    });
    
    setFilteredProducts(result);
    setPage(1);
  }, [products, searchTerm, selectedCategory, sortBy, priceRange, filters]);
  
  // Pagination
  useEffect(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const paginated = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    setPaginatedProducts(paginated);
  }, [filteredProducts, page]);

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
            <NavButton className="prev" onClick={handlePrev} direction="left">
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
            <NavButton className="next" onClick={handleNext} direction="right">
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
              <StyledCard>
                {product.isBestSeller && (
                  <Chip 
                    label="Best Seller" 
                    color="secondary" 
                    size="small" 
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10, 
                      zIndex: 1,
                      fontWeight: 'bold'
                    }} 
                  />
                )}
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
                <CardActionArea>
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
                        gutterBottom 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '1rem',
                          lineHeight: 1.3,
                          WebkitLineClamp: 2,
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          height: '2.6em',
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
                        color={wishlist.includes(product.id) ? 'error' : 'default'}
                        sx={{ ml: 1 }}
                      >
                        {wishlist.includes(product.id) ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {[...Array(5)].map((_, i) => (
                        <Box key={i} component="span">
                          {i < Math.floor(product.rating) ? (
                            <Star color="warning" fontSize="small" />
                          ) : (
                            <StarBorder color="disabled" fontSize="small" />
                          )}
                        </Box>
                      ))}
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                        ({product.rating})
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <LocationOn color="action" fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        {product.location}
                        <VerifiedUser 
                          color="primary" 
                          fontSize="inherit" 
                          sx={{ ml: 0.5, fontSize: '0.9rem' }} 
                        />
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      mb: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      height: '2.8em',
                    }}>
                      By {product.farmer}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Box>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          ₹{product.price.toLocaleString()}
                          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                            /{product.unit}
                          </Typography>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          MOQ: {product.moq} {product.unit}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={!product.inStock}
                        startIcon={<ShoppingCart />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add to cart logic here
                        }}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </StyledCard>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products found matching your criteria
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={resetFilters}
                sx={{ mt: 2 }}
              >
                Clear Filters
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Pagination */}
      {filteredProducts.length > itemsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(filteredProducts.length / itemsPerPage)}
            page={page}
            onChange={(e, value) => {
              setPage(value);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            color="primary"
            showFirstButton
            showLastButton
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Filters
          </Typography>
          <IconButton onClick={() => setShowFilters(false)}>
            <Close />
          </IconButton>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Price Range (₹)
          </Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={5000}
              step={50}
              valueLabelFormat={(value) => `₹${value}`}
              sx={{ mt: 3 }}
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
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Filters
          </Typography>
          <FormGroup>
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={filters.organic} 
                  onChange={(e) => setFilters({...filters, organic: e.target.checked})} 
                />
              } 
              label="Organic Only" 
            />
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={filters.bestSeller} 
                  onChange={(e) => setFilters({...filters, bestSeller: e.target.checked})} 
                />
              } 
              label="Best Sellers" 
            />
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={filters.inStock} 
                  onChange={(e) => setFilters({...filters, inStock: e.target.checked})} 
                />
              } 
              label="In Stock Only" 
            />
          </FormGroup>
        </Box>
        
        <Box sx={{ mt: 'auto', pt: 2, display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            fullWidth 
            onClick={resetFilters}
            startIcon={<Close />}
          >
            Reset
          </Button>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={() => setShowFilters(false)}
            startIcon={<Check />}
          >
            Apply
          </Button>
        </Box>
      </Drawer>
    </Container>
  );
};

export default Products;
