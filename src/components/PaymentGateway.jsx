import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, Divider, Paper
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CreditCard,
  AccountBalanceWallet,
  CardGiftcard
} from '@mui/icons-material';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe('your_publishable_key_here');

const PaymentGateway = ({ open, onClose, product, quantity }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });

  const handlePayment = async () => {
    if (!product) return;
    
    setLoading(true);
    try {
      const stripe = await stripePromise;
      
      // Create payment intent on your backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: product.price * quantity * 100, // in paise
          currency: 'inr',
          productId: product.id,
          quantity: quantity
        })
      });
      
      const { clientSecret } = await response.json();
      
      // Confirm the payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: 'Customer Name' }
        }
      });
      
      if (result.error) throw result.error;
      
      if (result.paymentIntent.status === 'succeeded') {
        onClose(true); // Success
      }
    } catch (error) {
      console.error('Payment error:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const totalAmount = product ? (product.price * quantity).toLocaleString('en-IN') : 0;

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Complete Your Purchase</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Order Summary</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>{product?.name} x {quantity} {product?.unit}</Typography>
            <Typography>₹{totalAmount}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <Typography>Total Amount:</Typography>
            <Typography>₹{totalAmount}</Typography>
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
                  border: `1px solid ${paymentMethod === method.id ? 'primary.main' : 'divider'}`,
                  '&:hover': { borderColor: 'primary.main' },
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
            <TextField
              fullWidth
              label="Card Number"
              name="number"
              value={cardDetails.number}
              onChange={handleCardChange}
              placeholder="1234 5678 9012 3456"
              margin="normal"
              variant="outlined"
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                label="Expiry Date"
                name="expiry"
                value={cardDetails.expiry}
                onChange={handleCardChange}
                placeholder="MM/YY"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="CVV"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleCardChange}
                placeholder="123"
                variant="outlined"
              />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={() => onClose(false)} color="inherit">
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handlePayment}
          startIcon={<PaymentIcon />}
          disabled={loading}
          fullWidth
        >
          {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentGateway;
