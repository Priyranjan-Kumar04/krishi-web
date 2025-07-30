import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Avatar, 
  Button, 
  TextField, 
  Grid,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { Person, Lock, ShoppingBag, Favorite, LocationOn, Payment } from '@mui/icons-material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

const ProfilePage = () => {
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
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    address: '123 Farm Street, Agricultural Area, Maharashtra 400001'
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Avatar 
          src="/images/avatar.jpg" 
          sx={{ width: 100, height: 100, border: '3px solid', borderColor: 'primary.main' }} 
        />
        <Box>
          <Typography variant="h4">{profile.name}</Typography>
          <Typography color="text.secondary">{profile.email}</Typography>
          <Typography color="text.secondary">{profile.phone}</Typography>
        </Box>
      </Box>

      <Paper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="profile tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<Person />} label="Profile" {...a11yProps(0)} />
            <Tab icon={<ShoppingBag />} label="My Orders" {...a11yProps(1)} />
            <Tab icon={<Favorite />} label="Wishlist" {...a11yProps(2)} />
            <Tab icon={<LocationOn />} label="Addresses" {...a11yProps(3)} />
            <Tab icon={<Payment />} label="Payment Methods" {...a11yProps(4)} />
            <Tab icon={<Lock />} label="Change Password" {...a11yProps(5)} />
          </Tabs>
        </Box>

        {/* Profile Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>Personal Information</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary">
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* My Orders Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>Recent Orders</Typography>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography fontWeight="bold">Order #KR12345</Typography>
              <Typography color="primary">Delivered on Jul 28, 2025</Typography>
            </Box>
            <Typography color="text.secondary">3 items • ₹1,245.00</Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" size="small" sx={{ mr: 1 }}>Track Order</Button>
              <Button variant="contained" size="small">Buy Again</Button>
            </Box>
          </Paper>
          
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography fontWeight="bold">Order #KR12344</Typography>
              <Typography color="primary">Delivered on Jul 15, 2025</Typography>
            </Box>
            <Typography color="text.secondary">5 items • ₹2,310.00</Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" size="small" sx={{ mr: 1 }}>View Details</Button>
              <Button variant="contained" size="small">Reorder</Button>
            </Box>
          </Paper>
        </TabPanel>

        {/* Wishlist Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Your Wishlist</Typography>
          <Typography color="text.secondary">Your wishlist is currently empty.</Typography>
        </TabPanel>

        {/* Addresses Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>Saved Addresses</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%', border: '1px solid', borderColor: 'primary.main' }}>
                <Typography fontWeight="bold">Home</Typography>
                <Typography>{profile.address}</Typography>
                <Typography>Mumbai, Maharashtra 400001</Typography>
                <Typography>Phone: {profile.phone}</Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button size="small" color="primary">Edit</Button>
                  <Button size="small" color="error">Remove</Button>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 200, border: '1px dashed', borderColor: 'text.secondary' }}>
                <Button startIcon={<Add />} color="primary">
                  Add New Address
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Payment Methods Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>Payment Methods</Typography>
          <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontWeight="bold">VISA ending in 1234</Typography>
              <Typography color="text.secondary">Expires 12/25</Typography>
            </Box>
            <Button color="error" size="small">Remove</Button>
          </Paper>
          <Button variant="outlined" startIcon={<Add />}>
            Add Payment Method
          </Button>
        </TabPanel>

        {/* Change Password Tab */}
        <TabPanel value={tabValue} index={5}>
          <Typography variant="h6" gutterBottom>Change Password</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                margin="normal"
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                margin="normal"
              />
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Update Password
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
