import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Grid, Button, Divider, Chip, Rating, Avatar,
  TextField, Paper, IconButton, Tabs, Tab, useMediaQuery, useTheme,
  Snackbar, Alert
} from '@mui/material';
import {
  ArrowBack, LocationOn, Phone, Email, ShoppingCart, Favorite,
  Share, LocalShipping, VerifiedUser, Replay, Star, StarBorder
} from '@mui/icons-material';
import PaymentGateway from '../components/PaymentGateway';

// Import mock products data
import { mockProducts } from './Products.backup';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [product, setProduct] = useState(null);
  const [openPayment, setOpenPayment] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  useEffect(() => {
    // Find product by ID from the mock data
    const foundProduct = mockProducts.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      // Set initial quantity to MOQ
      setQuantity(parseInt(foundProduct.moq.split(' ')[0]));
    }
  }, [id]);
  
  if (!product) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Product not found</Typography>
        <Button onClick={() => navigate('/products')} sx={{ mt: 2 }}>
          Back to Products
        </Button>
      </Container>
    );
  }
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    const moq = parseInt(product.moq.split(' ')[0]);
    setQuantity(Math.max(moq, value)); // Ensure not below MOQ
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    const moq = parseInt(product.moq.split(' ')[0]);
    setQuantity(prev => Math.max(moq, prev - 1));
  };
  
  const handleAddToCart = useCallback(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
          unit: product.unit,
          farmer: product.farmer
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      setSnackbar({
        open: true,
        message: 'Product added to cart successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add product to cart. Please try again.',
        severity: 'error'
      });
    }
  }, [product, quantity]);
  
  const handlePlaceOrder = () => {
    setOpenPayment(true);
  };
  
  const handlePaymentSuccess = (success) => {
    setOpenPayment(false);
    if (success) {
      setSnackbar({
        open: true,
        message: 'Order placed successfully!',
        severity: 'success'
      });
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const renderRating = (rating) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Rating value={rating} precision={0.5} readOnly />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          ({rating.toFixed(1)})
        </Typography>
      </Box>
    );
  };

  const renderPaymentDialog = () => (
    <Dialog open={openPaymentDialog} onClose={handleClosePaymentDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Complete Your Purchase</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Order Summary</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>{product.name} x {quantity} {product.unit}</Typography>
            <Typography>₹{(product.price * quantity).toLocaleString('en-IN')}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <Typography>Total Amount:</Typography>
            <Typography>₹{(product.price * quantity).toLocaleString('en-IN')}</Typography>
          </Box>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Select Payment Method</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { id: 'card', label: 'Credit/Debit Card', icon: <CreditCard /> },
              { id: 'upi', label: 'UPI', icon: <AccountBalanceWallet /> },
              { id: 'cod', label: 'Cash on Delivery', icon: <CardGiftcard /> },
            ].map((method) => (
              <Paper 
                key={method.id}
                elevation={paymentMethod === method.id ? 3 : 1}
                onClick={() => setPaymentMethod(method.id)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: `1px solid ${paymentMethod === method.id ? theme.palette.primary.main : theme.palette.divider}`,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {method.icon}
                  <Typography>{method.label}</Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
        
        {paymentMethod === 'card' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Card Details</Typography>
            <TextField
              fullWidth
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              margin="normal"
              variant="outlined"
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                label="Expiry Date"
                placeholder="MM/YY"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="CVV"
                placeholder="123"
                variant="outlined"
              />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClosePaymentDialog} color="inherit">Cancel</Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handlePayment}
          startIcon={<Payment />}
          fullWidth
        >
          Pay ₹{(product.price * quantity).toLocaleString('en-IN')}
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (!product) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Loading product details...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <PaymentGateway
        open={openPayment}
        onClose={handlePaymentSuccess}
        product={product}
        quantity={quantity}
      />
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to Products
      </Button>
      
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '500px',
                objectFit: 'contain' 
              }} 
            />
          </Paper>
        </Grid>
        
        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                {renderRating(product.rating)}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({product.reviews} reviews)
                </Typography>
              </Box>
              <Chip 
                label={product.inStock ? 'In Stock' : 'Out of Stock'} 
                color={product.inStock ? 'success' : 'default'} 
                size="small" 
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="h4" color="primary">
                ₹{product.price.toLocaleString('en-IN')} / {product.unit}
              </Typography>
              {product.stock > 0 && (
                <Typography variant="body2" color="text.secondary">
                  (Available: {product.stock} {product.unit})
                </Typography>
              )}
            </Box>
            
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Farmer Info */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Farmer Details</Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Avatar 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(product.farmerDetails.name)}&background=random`} 
                  alt={product.farmerDetails.name}
                  sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}
                >
                  {product.farmerDetails.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {product.farmerDetails.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {product.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.farmerDetails.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      ({product.farmerDetails.rating.toFixed(1)})
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Experience: {product.farmerDetails.experience} • Farm Size: {product.farmerDetails.farmSize}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                {product.farmerDetails.about}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<Phone fontSize="small" />}
                  href={`tel:+91${Math.floor(1000000000 + Math.random() * 9000000000)}`}
                >
                  Call Farmer
                </Button>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<Email fontSize="small" />}
                  href={`mailto:${product.farmerDetails.name.replace(/\s+/g, '').toLowerCase()}@example.com`}
                >
                  Send Message
                </Button>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<LocationOn fontSize="small" />}
                >
                  View Farm
                </Button>
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Order Section */}
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Quantity</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Button 
                    variant="outlined" 
                    onClick={decrementQuantity}
                    disabled={quantity <= parseInt(product.moq.split(' ')[0])}
                    sx={{ minWidth: '40px' }}
                  >
                    -
                  </Button>
                  <TextField
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    inputProps={{ 
                      min: parseInt(product.moq.split(' ')[0]),
                      style: { textAlign: 'center' }
                    }}
                    sx={{ 
                      width: '80px',
                      '& .MuiOutlinedInput-root': {
                        '& input': {
                          textAlign: 'center',
                          padding: '8.5px 8px'
                        }
                      }
                    }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={incrementQuantity}
                    sx={{ minWidth: '40px' }}
                  >
                    +
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    sx={{ flex: 1, minWidth: '200px' }}
                  >
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    startIcon={<Favorite />}
                    sx={{ flex: 1, minWidth: '200px' }}
                  >
                    Save for Later
                  </Button>
                </Box>
                
                {/* Trust Badges */}
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 2, 
                  mt: 3,
                  '& > *': { 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                    color: 'text.secondary',
                    '& svg': { color: 'success.main' }
                  }
                }}>
                  <Box>
                    <LocalShipping fontSize="small" />
                    <Typography variant="body2">Free shipping on orders over ₹1000</Typography>
                  </Box>
                  <Box>
                    <VerifiedUser fontSize="small" />
                    <Typography variant="body2">100% Authentic Products</Typography>
                  </Box>
                  <Box>
                    <Replay fontSize="small" />
                    <Typography variant="body2">Easy Returns</Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: product.moq.split(' ')[0], max: product.stock }}
                  sx={{ width: '120px' }}
                />
                <Typography variant="body2" color="text.secondary">
                  Min. order: {product.moq}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  fullWidth={isMobile}
                  disabled={!product.inStock}
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary"
                  size="large"
                  onClick={handlePlaceOrder}
                  fullWidth={isMobile}
                  disabled={!product.inStock}
                  sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
                >
                  Buy Now
                </Button>
              </Box>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  size="small" 
                  startIcon={<Favorite />}
                >
                  Save for Later
                </Button>
                <Button 
                  size="small" 
                  startIcon={<Share />}
                >
                  Share
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      {/* Product Details Tabs */}
      <Box sx={{ mt: 6 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Product Details" />
          <Tab label="Specifications" />
          <Tab label="Farmer Info" />
          <Tab label="Reviews (128)" />
        </Tabs>
        
        <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>About this product</Typography>
              <Typography paragraph>{product.description}</Typography>
              <Typography paragraph>
                Our Basmati Rice is carefully selected and processed to maintain its natural aroma and elongated grains. 
                It's perfect for biryanis, pulao, and other traditional Indian dishes.
              </Typography>
            </Box>
          )}
          
          {activeTab === 1 && (
            <Grid container spacing={2}>
              {product.specifications && Object.entries(product.specifications).map(([key, value], index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', py: 1 }}>
                    <Typography variant="subtitle2" sx={{ minWidth: '150px', color: 'text.secondary' }}>
                      {key}:
                    </Typography>
                    <Typography>{value}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
          
          {activeTab === 2 && product.farmerDetails && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexDirection: isMobile ? 'column' : 'row', alignItems: 'flex-start' }}>
                <Avatar 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(product.farmerDetails.name)}&background=random`}
                  alt={product.farmerDetails.name}
                  sx={{ width: 80, height: 80, mr: 3, mb: isMobile ? 2 : 0 }}
                >
                  {product.farmerDetails.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{product.farmerDetails.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{product.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.farmerDetails.rating} precision={0.1} readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.farmerDetails.rating.toFixed(1)})
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>About the Farmer</Typography>
              <Typography paragraph>{product.farmerDetails.about}</Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Experience</Typography>
                  <Typography>{product.farmerDetails.experience}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Farm Size</Typography>
                  <Typography>{product.farmerDetails.farmSize}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                  <Typography>{product.location}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    variant="outlined" 
                    startIcon={<Phone fontSize="small" />}
                    href={`tel:+91${Math.floor(1000000000 + Math.random() * 9000000000)}`}
                    sx={{ mr: 1, mb: 1 }}
                  >
                    Call Farmer
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Email fontSize="small" />}
                    href={`mailto:${product.farmerDetails.name.replace(/\s+/g, '').toLowerCase()}@example.com`}
                    sx={{ mr: 1, mb: 1 }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Customer Reviews</Typography>
              <Box sx={{ display: 'flex', mb: 3, flexDirection: isMobile ? 'column' : 'row' }}>
                <Box sx={{ textAlign: 'center', mr: 4, mb: isMobile ? 2 : 0 }}>
                  <Typography variant="h3">{product.rating?.toFixed(1) || '4.5'}</Typography>
                  <Rating value={product.rating || 4.5} precision={0.5} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {product.reviews || '0'} reviews
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ minWidth: '30px' }}>{star}</Typography>
                      <Star color="primary" fontSize="small" />
                      <Box sx={{ width: '200px', mx: 1, bgcolor: 'divider', height: '8px', borderRadius: 4, overflow: 'hidden' }}>
                        <Box 
                          sx={{ 
                            bgcolor: 'primary.main', 
                            height: '100%', 
                            width: `${(star / 5) * 100}%` 
                          }} 
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {Math.floor((star / 5) * 100)}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              
              <Button variant="outlined" sx={{ mb: 3 }}>Write a Review</Button>
              
              {/* Sample Review */}
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 40, height: 40, mr: 1 }}>JD</Avatar>
                    <Typography>John Doe</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    2 weeks ago
                  </Typography>
                </Box>
                <Rating value={5} readOnly size="small" sx={{ mb: 1 }} />
                <Typography variant="h6" gutterBottom>Excellent Quality Rice</Typography>
                <Typography paragraph sx={{ mb: 1 }}>
                  The Basmati rice has a wonderful aroma and cooks up perfectly. Grains are long and non-sticky. 
                  Will definitely order again!
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label="Verified Purchase" size="small" color="success" variant="outlined" />
                  <Chip label="1kg Purchased" size="small" variant="outlined" />
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      
      {/* Trust Badges */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Why Buy From Us</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 4, mt: 3 }}>
          {[
            { icon: <LocalShipping fontSize="large" color="primary" />, text: 'Free Shipping on orders over ₹1000' },
            { icon: <Replay fontSize="large" color="primary" />, text: '7-Day Easy Returns' },
            { icon: <VerifiedUser fontSize="large" color="primary" />, text: '100% Authentic Products' },
          ].map((item, index) => (
            <Box key={index} sx={{ textAlign: 'center', maxWidth: '200px' }}>
              {item.icon}
              <Typography variant="body2" sx={{ mt: 1 }}>{item.text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetail;
