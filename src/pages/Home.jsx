import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1932&q=80)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(15, 2),
  textAlign: 'center',
  marginBottom: theme.spacing(6),
}));

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md">
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 3 }}
          >
            Fresh Produce, Direct from Farm to Your Doorstep
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4 }}>
            Supporting local farmers with the freshest, organic fruits and vegetables
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/products"
              sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
            >
              Shop Now
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              component={RouterLink}
              to="/farmers"
            >
              Meet Our Farmers
            </Button>
          </Box>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          Why Choose Us?
        </Typography>
        <Grid container spacing={4}>
          {[
            { title: 'Fresh Produce', description: 'Direct from local farms' },
            { title: 'Fast Delivery', description: 'To your doorstep' },
            { title: 'Support Farmers', description: 'Fair prices for farmers' },
            { title: '100% Organic', description: 'Natural and healthy' },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box textAlign="center" p={3} boxShadow={2} borderRadius={2} height="100%">
                <Typography variant="h6" gutterBottom>{feature.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
