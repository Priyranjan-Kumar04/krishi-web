import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme, styled } from '@mui/material/styles';
import {
  Container, Typography, Box, Grid, Card, CardContent, CardMedia,
  CardActions, Button, TextField, Select, MenuItem, Avatar,
  FormControl, InputLabel, Pagination, Rating, useMediaQuery,
  IconButton, Slider, Snackbar, Alert, Dialog, DialogTitle, 
  DialogContent, DialogActions, Divider, CardActionArea
} from '@mui/material';
import {
  Search, ShoppingCart, TrendingUp, Add, Remove, ShoppingCartCheckout, Close, InfoOutlined
} from '@mui/icons-material';

// Import crop categories
import { cropCategories } from '../components/CropCategories';
import { products as allProducts, locations } from '../data/products';

// Cart Context
const CartContext = createContext();
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      return existingItem
        ? prevItems.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...prevItems, { ...product, quantity }];
    });
  };

  const updateCartItem = (productId, quantity) => {
    setCartItems(prevItems => 
      quantity > 0
        ? prevItems.map(item => 
            item.id === productId ? { ...item, quantity } : item
          )
        : prevItems.filter(item => item.id !== productId)
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateCartItem }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

// Using products from the imported data file

const Products = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams] = useSearchParams();
  const { cartItems, addToCart, updateCartItem } = useCart();
  
  // Get category from URL
  const category = searchParams.get('category') || 'All';
  
  const [filters, setFilters] = useState({
    category: category,
    priceRange: [0, 10000],
    rating: 0,
    inStock: false,
    organic: false,
  });
  
  // Update filters when URL changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: category
    }));
  }, [category]);

  // State
  const [products] = useState(allProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showPriceAnalysis, setShowPriceAnalysis] = useState(false);
  
  // Get all unique categories and subcategories from products
  const allCategories = React.useMemo(() => 
    ['All', ...new Set(products.map(p => p.category).filter(Boolean))], 
    [products]
  );
  
  const allSubcategories = React.useMemo(
    () => [...new Set(products.flatMap(p => p.subcategory).filter(Boolean))],
    [products]
  );

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    setFilters(prev => ({
      ...prev,
      category: newCategory
    }));
    setPage(1);
  };

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  // Handle price range change
  const handlePriceRangeChange = (event, newValue) => {
    setFilters(prev => ({
      ...prev,
      priceRange: newValue
    }));
    setPage(1);
  };

  // Handle add to cart
  const handleAddToCart = useCallback((product, quantity = 1, isBuyNow = false) => {
    if (!product || !product.id || !product.name || !product.unit) {
      console.error('Invalid product data:', product);
      setSnackbar({
        open: true,
        message: 'Error: Invalid product data',
        severity: 'error'
      });
      return;
    }
    
    const qty = Number(quantity) || 1;
    addToCart(product, qty);
    
    setSnackbar({
      open: true,
      message: `Added ${qty} ${product.unit} of ${product.name} to cart`,
      severity: 'success'
    });
    
    if (isBuyNow) {
      navigate('/checkout');
    }
  }, [addToCart, navigate]);

  // Handle quantity change
  const handleQuantityChange = useCallback((product, change) => {
    if (!product?.id) return;
    
    const cartItem = cartItems.find(item => item.id === product.id);
    const currentQty = cartItem?.quantity || 0;
    const newQuantity = Math.max(0, currentQty + change);
    
    if (newQuantity > 0) {
      updateCartItem(product.id, newQuantity);
    } else if (cartItem) {
      updateCartItem(product.id, 0);
    }
  }, [cartItems, updateCartItem]);

  // Group products by location for recommendations
  const productsByLocation = React.useMemo(() => {
    return products.reduce((acc, product) => {
      if (!product.location) return acc;
      if (!acc[product.location]) {
        acc[product.location] = [];
      }
      acc[product.location].push(product);
      return acc;
    }, {});
  }, [products]);

  // Get recommended locations based on search term
  const getRecommendedLocations = useCallback((searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) return [];
    const searchLower = searchTerm.toLowerCase();
    return Object.keys(productsByLocation)
      .filter(location => location.toLowerCase().includes(searchLower))
      .sort()
      .slice(0, 5); // Show top 5 matches
  }, [productsByLocation]);

  // Get products from recommended locations
  const getRecommendedProducts = useCallback((location) => {
    if (!location) return [];
    const recommendedLocations = getRecommendedLocations(location);
    return recommendedLocations.flatMap(loc => productsByLocation[loc] || []);
  }, [getRecommendedLocations, productsByLocation]);

  // Filter products based on selected filters
  const filteredProducts = useCallback(() => {
    const searchLower = searchTerm.toLowerCase();
    
    // First, try exact location match
    const exactLocationMatch = products.filter(product => {
      if (selectedLocation === 'All') return false;
      return product.location && product.location.toLowerCase() === selectedLocation.toLowerCase();
    });

    // If no exact matches, show recommendations
    const showRecommendations = selectedLocation !== 'All' && exactLocationMatch.length === 0;
    const productsToFilter = showRecommendations 
      ? getRecommendedProducts(selectedLocation)
      : products;

    return productsToFilter.filter(product => {
      // Search filter - search in name, description, and variety
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.variety && product.variety.toLowerCase().includes(searchLower));
        
      // Category filter from URL or state
      const matchesCategory = 
        filters.category === 'All' || 
        product.category === filters.category ||
        (product.subcategory && product.subcategory === filters.category);
        
      // Location filter - already handled above
      const matchesLocation = selectedLocation === 'All' || true;
      
      // Price range filter
      const matchesPrice = 
        product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1];
        
      // Rating filter
      const matchesRating = product.rating >= filters.rating;
      
      // Stock filter
      const matchesStock = !filters.inStock || product.inStock;
      
      // Organic filter
      const matchesOrganic = !filters.organic || product.isOrganic;
      
      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesPrice &&
        matchesRating &&
        matchesStock &&
        matchesOrganic
      );
    });
  }, [products, searchTerm, filters, selectedLocation, getRecommendedProducts]);

  // Show recommendation message if no exact matches but there are recommendations
  const showRecommendationMessage = selectedLocation !== 'All' && 
    filteredProducts().length > 0 && 
    !products.some(p => p.location && p.location.toLowerCase() === selectedLocation.toLowerCase());

  // Calculate total products after filtering
  const totalProducts = filteredProducts().length;

  // Calculate pagination
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const paginatedProducts = filteredProducts().slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Fresh from Indian Farms
        </Typography>
        <Typography color="text.secondary">
          Discover the finest agricultural produce directly from farmers across India
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by product name, variety, or description..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
            sx={{ maxWidth: 500 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              label="Category"
              onChange={(e) => {
                setFilters(prev => ({
                  ...prev,
                  category: e.target.value
                }));
                setPage(1);
              }}
            >
              <MenuItem value="All">All Categories</MenuItem>
              {cropCategories.map((category) => (
                <React.Fragment key={category.id}>
                  <MenuItem value={category.name} sx={{ fontWeight: 'bold' }}>
                    {category.name}
                  </MenuItem>
                  {category.subcategories.map(subcategory => (
                    <MenuItem 
                      key={`${category.id}-${subcategory.name}`} 
                      value={subcategory.name} 
                      sx={{ pl: 4 }}
                    >
                      {subcategory.name}
                    </MenuItem>
                  ))}
                </React.Fragment>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Location</InputLabel>
            <Select
              value={selectedLocation}
              label="Location"
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="All">All Locations</MenuItem>
              {locations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button 
              variant="outlined" 
              onClick={() => {
                setSearchTerm('');
                setSelectedLocation('All');
                setFilters({
                  category: 'All',
                  priceRange: [0, 10000],
                  rating: 0,
                  inStock: false,
                  organic: false,
                });
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </Box>
      </Box>
      
      {/* Price Range Filter */}
      <Box sx={{ mb: 4, width: '100%', maxWidth: 400, px: 2 }}>
        <Typography gutterBottom>Price Range</Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          min={0}
          max={10000}
          step={100}
          valueLabelFormat={(value) => `₹${value}`}
          sx={{ width: '90%' }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
          <Typography variant="caption">₹{filters.priceRange[0]}</Typography>
          <Typography variant="caption">₹{filters.priceRange[1]}+</Typography>
        </Box>
      </Box>

      {/* Recommendation Message */}
      {showRecommendationMessage && (
        <Box sx={{ 
          mb: 2, 
          p: 2, 
          bgcolor: 'info.light', 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <InfoOutlined color="info" />
          <Typography variant="body2">
            No products found in "{selectedLocation}". Showing products from similar locations.
          </Typography>
        </Box>
      )}

      {/* Results Summary */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {Math.min((page - 1) * itemsPerPage + 1, totalProducts)}-{Math.min(page * itemsPerPage, totalProducts)} of {totalProducts} products
        </Typography>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value="featured"
            label="Sort By"
            onChange={(e) => {
              // Add sorting logic here
            }}
          >
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="priceLow">Price: Low to High</MenuItem>
            <MenuItem value="priceHigh">Price: High to Low</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
            <MenuItem value="newest">Newest Arrivals</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {paginatedProducts.length === 0 ? (
          <Box width="100%" textAlign="center" py={6}>
            <Box sx={{ maxWidth: 400, mx: 'auto', p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
              <Search sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.primary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                We couldn't find any products matching your search criteria.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedLocation('All');
                  setFilters(prev => ({
                    ...prev,
                    category: 'All',
                    rating: 0,
                    inStock: false,
                    organic: false
                  }));
                  setPriceRange([0, 10000]);
                }}
              >
                Clear all filters
              </Button>
            </Box>
          </Box>
        ) : (
          paginatedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <StyledCard>
                <CardActionArea onClick={() => setQuickViewProduct(product)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" component="div">
                        {product.name}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickViewProduct(product);
                          setShowPriceAnalysis(true);
                        }}
                        title="View price analysis"
                      >
                        <TrendingUp fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      By {product.farmer}, {product.location}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                      <Rating value={product.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.rating})
                      </Typography>
                    </Box>
                    
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ₹{product.price} / {product.unit}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      MOQ: {product.moq} {product.unit} | In Stock: {product.stock} {product.unit}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                
                <CardActions sx={{ mt: 'auto', p: 2, pt: 0 }}>
                  {cartItems.some(item => item.id === product.id) ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleQuantityChange(product, -1)}
                        disabled={cartItems.find(item => item.id === product.id)?.quantity <= 1}
                      >
                        <Remove />
                      </IconButton>
                      <Typography sx={{ mx: 1 }}>
                        {cartItems.find(item => item.id === product.id)?.quantity}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleQuantityChange(product, 1)}
                      >
                        <Add />
                      </IconButton>
                      <Button 
                        variant="contained" 
                        size="small" 
                        sx={{ ml: 'auto' }}
                        onClick={() => navigate('/checkout')}
                      >
                        Checkout
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(product, 1)}
                    >
                      Add to Cart
                    </Button>
                  )}
                </CardActions>
              </StyledCard>
            </Grid>
          ))
        )}
      </Grid>

      {/* Product Details Dialog */}
      <Dialog 
        open={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)}
        maxWidth="md"
        fullWidth
      >
        {quickViewProduct && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                {quickViewProduct.name}
                <Typography variant="body2" color="text.secondary">
                  {quickViewProduct.category} • {quickViewProduct.subcategory}
                </Typography>
              </Box>
              <IconButton 
                onClick={() => setQuickViewProduct(null)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <CardMedia
                    component="img"
                    image={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    sx={{ 
                      width: '100%', 
                      maxHeight: 400, 
                      objectFit: 'contain',
                      borderRadius: 1
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={quickViewProduct.rating} precision={0.1} readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({quickViewProduct.rating} • {quickViewProduct.reviews || 0} reviews)
                      </Typography>
                    </Box>
                    
                    <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
                      ₹{quickViewProduct.price} / {quickViewProduct.unit}
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>Availability</Typography>
                      <Typography color={quickViewProduct.inStock ? 'success.main' : 'error.main'}> 
                        {quickViewProduct.inStock 
                          ? `In Stock (${quickViewProduct.stock} ${quickViewProduct.unit} available)` 
                          : 'Out of Stock'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Minimum Order: {quickViewProduct.moq} {quickViewProduct.unit}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>Product Details</Typography>
                      <Typography variant="body1" paragraph>
                        {quickViewProduct.description || 'No description available.'}
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>Category:</strong> {quickViewProduct.category}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>Subcategory:</strong> {quickViewProduct.subcategory}
                          </Typography>
                        </Grid>
                        {quickViewProduct.variety && (
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Variety:</strong> {quickViewProduct.variety}
                            </Typography>
                          </Grid>
                        )}
                        {quickViewProduct.grade && (
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Grade:</strong> {quickViewProduct.grade}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>Retailer Details</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar 
                          src={quickViewProduct.farmerAvatar} 
                          sx={{ width: 40, height: 40, mr: 2 }}
                        >
                          {quickViewProduct.farmer?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{quickViewProduct.farmer}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {quickViewProduct.location}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Rating 
                          value={quickViewProduct.retailerRating || 4.5} 
                          precision={0.5} 
                          size="small" 
                          readOnly 
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({quickViewProduct.retailerReviews || 'No'} reviews)
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <IconButton 
                          onClick={() => handleQuantityChange(quickViewProduct, -1)}
                          disabled={!quickViewProduct.inStock}
                        >
                          <Remove />
                        </IconButton>
                        <Typography sx={{ px: 2 }}>
                          {cartItems.find(item => item.id === quickViewProduct.id)?.quantity || 1}
                        </Typography>
                        <IconButton 
                          onClick={() => handleQuantityChange(quickViewProduct, 1)}
                          disabled={!quickViewProduct.inStock}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                      
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<ShoppingCart />}
                        onClick={() => {
                          handleAddToCart(quickViewProduct, 1);
                          setQuickViewProduct(null);
                        }}
                        disabled={!quickViewProduct.inStock}
                        sx={{ flex: 1 }}
                      >
                        {quickViewProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                      
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => setShowPriceAnalysis(true)}
                        startIcon={<TrendingUp />}
                      >
                        Price Trend
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            
            {/* Price Analysis Dialog */}
            <Dialog 
              open={showPriceAnalysis} 
              onClose={() => setShowPriceAnalysis(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Price Analysis - {quickViewProduct.name}</DialogTitle>
              <DialogContent>
                <Typography variant="h6" gutterBottom>Current Price: ₹{quickViewProduct.price} / {quickViewProduct.unit}</Typography>
                <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover', borderRadius: 1, mb: 2 }}>
                  <Typography color="text.secondary">Price trend chart will be displayed here</Typography>
                </Box>
                <Typography variant="body1" gutterBottom>Price History (Last 30 days):</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Highest: ₹{Math.round(quickViewProduct.price * 1.2)}</Typography>
                  <Typography variant="body2">Average: ₹{quickViewProduct.price}</Typography>
                  <Typography variant="body2">Lowest: ₹{Math.round(quickViewProduct.price * 0.9)}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Prices are updated daily. This product is currently priced {Math.random() > 0.5 ? 'below' : 'above'} the 30-day average.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowPriceAnalysis(false)}>Close</Button>
                <Button 
                  variant="contained" 
                  onClick={() => {
                    handleAddToCart(quickViewProduct, 1);
                    setShowPriceAnalysis(false);
                  }}
                >
                  Add to Cart
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Dialog>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(e, value) => setPage(value)} 
            color="primary"
            showFirstButton 
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'text.primary',
              },
              '& .Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          />
        </Box>
      )}
    </Container>
  );
};

// Wrap with CartProvider
export default function ProductsPage() {
  return (
    <CartProvider>
      <Products />
    </CartProvider>
  );
}
