import React, { useState } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent, CardMedia,
  CardActions, Button, TextField, InputAdornment, Chip, Avatar,
  Tabs, Tab, Divider, Rating, useMediaQuery, useTheme
} from '@mui/material';
import { Search, LocationOn, Email, Phone, Star, StarBorder } from '@mui/icons-material';

// Mock farmer data
const mockFarmers = [
  {
    id: 1,
    name: 'Organic Farms Co.',
    location: 'Springfield, CA',
    rating: 4.7,
    products: ['Tomatoes', 'Cucumbers', 'Bell Peppers', 'Lettuce'],
    image: 'https://source.unsplash.com/random/300x200?farm',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    joined: '2020',
    about: 'Family-owned organic farm specializing in fresh, seasonal produce grown with sustainable practices.'
  },
  {
    id: 2,
    name: 'Green Valley Farms',
    location: 'Shelbyville, CA',
    rating: 4.9,
    products: ['Apples', 'Pears', 'Cherries', 'Peaches'],
    image: 'https://source.unsplash.com/random/300x200?orchard',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    joined: '2018',
    about: 'Third-generation orchard producing premium quality fruits using eco-friendly farming methods.'
  },
  {
    id: 3,
    name: 'Sunny Acres',
    location: 'Ogdenville, CA',
    rating: 4.5,
    products: ['Carrots', 'Beets', 'Radishes', 'Turnips'],
    image: 'https://source.unsplash.com/random/300x200?vegetable-farm',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    joined: '2019',
    about: 'Specializing in root vegetables and seasonal produce, grown with care for the environment.'
  },
  {
    id: 4,
    name: 'Berry Good Farms',
    location: 'North Haverbrook, CA',
    rating: 4.8,
    products: ['Strawberries', 'Blueberries', 'Raspberries', 'Blackberries'],
    image: 'https://source.unsplash.com/random/300x200?berries',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    joined: '2021',
    about: 'Boutique berry farm known for our sweet, juicy berries grown with organic practices.'
  },
];

const Farmers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const filteredFarmers = mockFarmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.products.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleContactFarmer = (farmerId) => {
    console.log(`Contacting farmer ${farmerId}`);
    // Implement contact logic here
  };

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} color="primary" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Star key={i} color="primary" style={{ opacity: 0.5 }} />);
      } else {
        stars.push(<StarBorder key={i} color="primary" />);
      }
    }
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Box sx={{ display: 'flex' }}>{stars}</Box>
        <Typography variant="body2" sx={{ ml: 1 }}>{rating.toFixed(1)}</Typography>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '80vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Meet Our Farmers
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Connect with local farmers committed to sustainable agriculture
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: 2,
          mb: 4
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search farmers by name, location, or products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            sx: { maxWidth: 600 }
          }}
        />
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons={isMobile ? 'auto' : false}
          allowScrollButtonsMobile
          sx={{ minHeight: 'auto' }}
        >
          <Tab label="All Farmers" />
          <Tab label="Organic" />
          <Tab label="Local" />
          <Tab label="New" />
        </Tabs>
      </Box>

      {/* Farmers Grid */}
      <Grid container spacing={3}>
        {filteredFarmers.length > 0 ? (
          filteredFarmers.map((farmer) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={farmer.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={farmer.image}
                  alt={farmer.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
                  <Avatar 
                    src={farmer.avatar} 
                    alt={farmer.name}
                    sx={{
                      width: 80,
                      height: 80,
                      border: '4px solid white',
                      position: 'absolute',
                      top: -40,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      boxShadow: 3,
                    }}
                  />
                  <Box sx={{ mt: 5, textAlign: 'center' }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {farmer.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <LocationOn color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                        {farmer.location}
                      </Typography>
                    </Box>
                    {renderRating(farmer.rating)}
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {farmer.about}
                    </Typography>
                    
                    <Box sx={{ mt: 2, mb: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Products:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                        {farmer.products.map((product, index) => (
                          <Chip 
                            key={index} 
                            label={product} 
                            size="small" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Member since {farmer.joined}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, justifyContent: 'center' }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<Email />}
                    onClick={() => handleContactFarmer(farmer.id)}
                  >
                    Contact
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small"
                    startIcon={<Phone />}
                    sx={{ ml: 1 }}
                    onClick={() => handleContactFarmer(farmer.id)}
                  >
                    Call
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No farmers found matching your search.
            </Typography>
          </Box>
        )}
      </Grid>
    </Container>
  );
};

export default Farmers;
