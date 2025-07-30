import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Grid, Paper, Button, Divider, TextField,
  FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox,
  Stepper, Step, StepLabel, Card, CardContent, Radio, RadioGroup, useMediaQuery, useTheme
} from '@mui/material';
import {
  LocalShipping, Payment, CheckCircle, ShoppingCart,
  Home, Business, LocationOn, Phone, Email, ArrowBack
} from '@mui/icons-material';

// Mock payment gateways
const paymentMethods = [
  { id: 'razorpay', name: 'Razorpay', icon: 'https://razorpay.com/favicon.png' },
  { id: 'stripe', name: 'Stripe', icon: 'https://stripe.com/favicon.ico' },
  { id: 'paypal', name: 'PayPal', icon: 'https://www.paypalobjects.com/webstatic/icon/pp196.png' },
  { id: 'cod', name: 'Cash on Delivery', icon: '💰' },
];

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get product from navigation state or redirect
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(5);
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [address, setAddress] = useState({
    fullName: '',
    mobile: '',
    pincode: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    addressType: 'home',
  });
  
  const steps = ['Shipping Address', 'Payment', 'Confirmation'];
  
  useEffect(() => {
    if (state?.product) {
      setProduct(state.product);
      setQuantity(state.quantity || 5);
    } else {
      // Redirect if no product in state
      navigate('/products');
    }
  }, [state, navigate]);
  
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
    
    // If this is the last step, process the order
    if (activeStep === steps.length - 2) {
      processOrder();
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const processOrder = () => {
    // In a real app, this would communicate with your backend
    console.log('Processing order with:', { product, quantity, address, paymentMethod });
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would handle the payment gateway integration here
      console.log('Order processed successfully!');
    }, 2000);
  };
  
  const handlePaymentSuccess = () => {
    // This would be called by the payment gateway's success callback
    console.log('Payment successful!');
  };
  
  const renderStepContent = (step) => {
    if (!product) return null;
    
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom>Contact Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleAddressChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Mobile Number"
                      name="mobile"
                      value={address.mobile}
                      onChange={handleAddressChange}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
                
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Shipping Address</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Pincode"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleAddressChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Address Line 1"
                      name="addressLine1"
                      value={address.addressLine1}
                      onChange={handleAddressChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address Line 2 (Optional)"
                      name="addressLine2"
                      value={address.addressLine2}
                      onChange={handleAddressChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Landmark (Optional)"
                      name="landmark"
                      value={address.landmark}
                      onChange={handleAddressChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="City"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel>State</InputLabel>
                      <Select
                        name="state"
                        value={address.state}
                        onChange={handleAddressChange}
                        label="State"
                      >
                        {[
                          'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
                          'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
                          'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
                          'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
                          'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
                          'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
                          'Ladakh', 'Lakshadweep', 'Puducherry'
                        ].map((state) => (
                          <MenuItem key={state} value={state}>{state}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Address Type</Typography>
                <RadioGroup
                  row
                  name="addressType"
                  value={address.addressType}
                  onChange={handleAddressChange}
                >
                  <FormControlLabel
                    value="home"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Home sx={{ mr: 1 }} /> Home
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="work"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Business sx={{ mr: 1 }} /> Work
                      </Box>
                    }
                  />
                </RadioGroup>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!address.fullName || !address.mobile || !address.pincode || !address.addressLine1 || !address.city || !address.state}
                  >
                    Continue to Payment
                  </Button>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <OrderSummary product={product} quantity={quantity} />
            </Grid>
          </Grid>
        );
        
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom>Select Payment Method</Typography>
                
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {paymentMethods.map((method) => (
                    <Paper
                      key={method.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        border: '1px solid',
                        borderColor: paymentMethod === method.id ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      }}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Radio
                          checked={paymentMethod === method.id}
                          value={method.id}
                          name="payment-method"
                          sx={{ mr: 2 }}
                        />
                        <img 
                          src={method.icon} 
                          alt={method.name} 
                          style={{ 
                            height: 24, 
                            width: method.id === 'cod' ? 'auto' : 24,
                            marginRight: 12,
                            objectFit: 'contain'
                          }} 
                        />
                        <Typography>{method.name}</Typography>
                      </Box>
                    </Paper>
                  ))}
                </RadioGroup>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="I agree to the Terms & Conditions and Privacy Policy"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button onClick={handleBack}>
                    Back to Shipping
                  </Button>
                  <Button 
                    variant="contained"
                    onClick={handleNext}
                    disabled={!paymentMethod}
                  >
                    Place Order
                  </Button>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <OrderSummary product={product} quantity={quantity} />
            </Grid>
          </Grid>
        );
        
      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
            <Typography variant="h4" gutterBottom>Order Placed Successfully!</Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Thank you for your order. Your order has been received.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Order ID: KRISHI{Math.floor(100000 + Math.random() * 900000)}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We've sent you an email with order confirmation and details.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/')}
              sx={{ mt: 3 }}
            >
              Continue Shopping
            </Button>
          </Box>
        );
        
      default:
        return 'Unknown step';
    }
  };
  
  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Loading your order...</Typography>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {renderStepContent(activeStep)}
    </Container>
  );
};

const OrderSummary = ({ product, quantity }) => {
  const subtotal = product.price * quantity;
  const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over ₹1000
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;
  
  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" gutterBottom>Order Summary</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ 
              width: 60, 
              height: 60, 
              objectFit: 'cover',
              borderRadius: 1,
              marginRight: 2
            }} 
          />
          <Box>
            <Typography variant="subtitle2">{product.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {quantity} × ₹{product.price.toLocaleString('en-IN')}
            </Typography>
          </Box>
        </Box>
        <Typography variant="subtitle2">
          ₹{(product.price * quantity).toLocaleString('en-IN')}
        </Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Subtotal</Typography>
          <Typography variant="body2">₹{subtotal.toLocaleString('en-IN')}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Shipping</Typography>
          <Typography variant="body2">
            {shipping === 0 ? 'Free' : `₹${shipping}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Tax (GST 18%)</Typography>
          <Typography variant="body2">₹{tax.toFixed(2)}</Typography>
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1">Total</Typography>
        <Typography variant="subtitle1">
          ₹{total.toFixed(2)}
        </Typography>
      </Box>
      
      <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
        <Typography variant="body2" color="success.dark">
          <strong>Free shipping</strong> on orders over ₹1000
        </Typography>
      </Box>
    </Paper>
  );
};

export default Checkout;
