import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Agriculture as AgricultureIcon,
  LocalShipping as LogisticsIcon,
  Storefront as MarketplaceIcon,
  EmojiNature as OrganicIcon,
  SupportAgent as SupportIcon,
  Security as SecurityIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const About = () => {
  const theme = useTheme();

  return (
    <Box sx={{ pt: 8, pb: 8, backgroundColor: theme.palette.background.default }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box textAlign="center" mb={8}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
              mb: 2
            }}
          >
            About Krishi Bazaar
          </Typography>
          <Typography 
            variant="h6" 
            color="textSecondary" 
            sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}
          >
            Empowering Indian Farmers, Nourishing the Nation
          </Typography>
        </Box>

        {/* Mission Section */}
        <Box mb={8}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              textAlign: 'center',
              fontWeight: 600,
              mb: 4,
              color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
            }}
          >
            Our Mission
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ 
              textAlign: 'center', 
              maxWidth: '800px', 
              mx: 'auto',
              fontSize: '1.1rem',
              lineHeight: 1.8
            }}
          >
            At Krishi Bazaar, we're committed to revolutionizing the agricultural supply chain in India. 
            Our platform connects farmers directly with consumers, eliminating middlemen and ensuring fair 
            compensation for farmers while providing fresh, high-quality produce to our customers.
          </Typography>
        </Box>

        {/* Values Section */}
        <Box mb={8}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              textAlign: 'center',
              fontWeight: 600,
              mb: 6,
              color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
            }}
          >
            Our Values
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: <AgricultureIcon fontSize="large" color="primary" />,
                title: 'Farmer First',
                description: 'We prioritize the welfare of our farmers by ensuring they receive fair prices for their hard work.',
              },
              {
                icon: <MarketplaceIcon fontSize="large" color="primary" />,
                title: 'Market Access',
                description: 'Providing farmers with direct access to a wider market and better price realization.',
              },
              {
                icon: <OrganicIcon fontSize="large" color="primary" />,
                title: 'Organic Focus',
                description: 'Promoting sustainable and organic farming practices across India.',
              },
              {
                icon: <LogisticsIcon fontSize="large" color="primary" />,
                title: 'Efficient Logistics',
                description: 'Ensuring fresh produce reaches consumers quickly with minimal wastage.',
              },
              {
                icon: <SecurityIcon fontSize="large" color="primary" />,
                title: 'Secure Transactions',
                description: 'Safe and transparent payment solutions for all transactions.',
              },
              {
                icon: <SupportIcon fontSize="large" color="primary" />,
                title: '24/7 Support',
                description: 'Round-the-clock assistance for farmers and customers.',
              },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <StyledCard>
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box sx={{ mb: 2 }}>{item.icon}</Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team Section */}
        <Box mb={8}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              textAlign: 'center',
              fontWeight: 600,
              mb: 6,
              color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
            }}
          >
            Our Team
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                name: 'Priyranjan Kumar',
                role: 'Full Stack Developer',
                description: 'Expert in building scalable web applications with modern technologies.'
              },
              {
                name: 'Rohith M',
                role: 'Frontend Developer',
                description: 'Specialist in creating responsive and intuitive user interfaces.'
              },
              {
                name: 'Sujith S',
                role: 'Backend Developer',
                description: 'Skilled in server-side development and database management.'
              },
              {
                name: 'Srithar S',
                role: 'UI/UX Designer',
                description: 'Passionate about creating beautiful and user-friendly experiences.'
              },
            ].map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, textAlign: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mb: 2,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '2.5rem'
                    }}
                  >
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography color="primary" gutterBottom>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {member.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Info */}
        <Box textAlign="center" mt={8}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              mb: 4,
              color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
            }}
          >
            Get In Touch
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <LocationIcon color="primary" fontSize="large" sx={{ mb: 1 }} />
                <Typography variant="subtitle1" gutterBottom>Our Office</Typography>
                <Typography variant="body2" color="textSecondary" align="center">
                  123 Agri-Tech Park, Sector 62
                  <br />
                  Noida, Uttar Pradesh 201309
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PhoneIcon color="primary" fontSize="large" sx={{ mb: 1 }} />
                <Typography variant="subtitle1" gutterBottom>Call Us</Typography>
                <Typography variant="body2" color="textSecondary">
                  +91 98765 43210
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  +91 11 2345 6789
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <EmailIcon color="primary" fontSize="large" sx={{ mb: 1 }} />
                <Typography variant="subtitle1" gutterBottom>Email Us</Typography>
                <Typography variant="body2" color="textSecondary">
                  info@krishibazaar.com
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  support@krishibazaar.com
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
