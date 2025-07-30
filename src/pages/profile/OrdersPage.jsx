import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Divider, 
  Grid, 
  Chip,
  Avatar,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import { ShoppingBag, LocalShipping, CheckCircle, Cancel } from '@mui/icons-material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`orders-tabpanel-${index}`}
      aria-labelledby={`orders-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `orders-tab-${index}`,
    'aria-controls': `orders-tabpanel-${index}`,
  };
}

const orders = [
  {
    id: 'KR12345',
    date: 'Jul 28, 2025',
    status: 'Delivered',
    statusColor: 'success',
    items: 3,
    amount: '1,245.00',
    itemsList: [
      { name: 'Organic Basmati Rice', quantity: 2, price: '400.00', image: '/images/rice.jpg' },
      { name: 'Fresh Apples', quantity: 1, price: '120.00', image: '/images/apples.jpg' },
      { name: 'Organic Wheat Flour', quantity: 2, price: '305.00', image: '/images/flour.jpg' }
    ]
  },
  {
    id: 'KR12344',
    date: 'Jul 15, 2025',
    status: 'Cancelled',
    statusColor: 'error',
    items: 5,
    amount: '2,310.00',
    itemsList: [
      { name: 'Fresh Tomatoes', quantity: 3, price: '150.00', image: '/images/tomatoes.jpg' },
      { name: 'Organic Potatoes', quantity: 2, price: '80.00', image: '/images/potatoes.jpg' }
    ]
  },
  {
    id: 'KR12340',
    date: 'Jul 5, 2025',
    status: 'In Transit',
    statusColor: 'info',
    items: 2,
    amount: '890.00',
    itemsList: [
      { name: 'Fresh Mangoes', quantity: 5, price: '500.00', image: '/images/mangoes.jpg' },
      { name: 'Organic Bananas', quantity: 2, price: '390.00', image: '/images/bananas.jpg' }
    ]
  }
];

const OrdersPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      navigate('/login');
    } else {
      setIsLoading(false);
    }
  }, [user, loading, navigate]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress />
      </Box>
    );
  }
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredOrders = activeTab === 0 
    ? orders 
    : orders.filter(order => 
        activeTab === 1 ? order.status === 'In Transit' : 
        activeTab === 2 ? order.status === 'Delivered' : 
        order.status === 'Cancelled'
      );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <ShoppingBag fontSize="large" color="primary" />
        <Typography variant="h4">My Orders</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          aria-label="order status tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Orders" {...a11yProps(0)} />
          <Tab icon={<LocalShipping />} label="In Transit" {...a11yProps(1)} />
          <Tab icon={<CheckCircle />} label="Delivered" {...a11yProps(2)} />
          <Tab icon={<Cancel />} label="Cancelled" {...a11yProps(3)} />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <OrderList orders={filteredOrders} />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <OrderList orders={filteredOrders} />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <OrderList orders={filteredOrders} />
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <OrderList orders={filteredOrders} />
        </TabPanel>
      </Paper>
    </Container>
  );
};

const OrderList = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <ShoppingBag sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6">No orders found</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          You haven't placed any orders yet.
        </Typography>
        <Button variant="contained" href="/products">
          Start Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {orders.map((order, index) => (
        <React.Fragment key={order.id}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Box>
                <Typography variant="subtitle1" component="span" sx={{ mr: 2 }}>
                  Order #{order.id}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="span">
                  Placed on {order.date}
                </Typography>
              </Box>
              <Box>
                <Chip 
                  label={order.status} 
                  color={order.statusColor}
                  size="small"
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                {order.itemsList.map((item, itemIndex) => (
                  <Box key={itemIndex} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                    <Avatar 
                      src={item.image} 
                      variant="rounded"
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Qty: {item.quantity} × ₹{item.price}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    ₹{order.amount}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      disabled={order.status === 'Cancelled'}
                    >
                      Track Order
                    </Button>
                    <Button 
                      variant="contained" 
                      size="small"
                      disabled={order.status === 'Cancelled'}
                    >
                      {order.status === 'Delivered' ? 'Reorder' : 'View Details'}
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {index < orders.length - 1 && <Divider sx={{ my: 2 }} />}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default OrdersPage;
