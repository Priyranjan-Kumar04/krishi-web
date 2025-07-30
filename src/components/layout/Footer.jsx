import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  LocationOn,
  Phone,
  Email,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(6, 0),
  marginTop: 'auto',
  borderTop: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  '& a': {
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    },
  },
}));

const FooterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    marginBottom: 0,
  },
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: 'inherit',
  backgroundColor: theme.palette.action.hover,
  marginRight: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    color: theme.palette.primary.main,
  },
}));

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Facebook />, label: 'Facebook', url: 'https://facebook.com' },
    { icon: <Twitter />, label: 'Twitter', url: 'https://twitter.com' },
    { icon: <Instagram />, label: 'Instagram', url: 'https://instagram.com' },
    { icon: <LinkedIn />, label: 'LinkedIn', url: 'https://linkedin.com' },
  ];

  const quickLinks = [
    { text: 'Home', path: '/' },
    { text: 'Products', path: '/products' },
    { text: 'Farmers', path: '/farmers' },
    { text: 'About Us', path: '/about' },
    { text: 'Contact', path: '/contact' },
  ];

  const legalLinks = [
    { text: 'Privacy Policy', path: '/privacy-policy' },
    { text: 'Terms of Service', path: '/terms' },
    { text: 'Shipping Policy', path: '/shipping' },
    { text: 'Refund Policy', path: '/refund' },
  ];

  return (
    <FooterContainer component="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FooterSection>
              <Typography variant="h6" color="primary" gutterBottom>
                Krishi Bazaar
              </Typography>
              <Typography variant="body2" paragraph>
                Connecting farmers directly to consumers with fresh, organic, and
                locally sourced produce. Supporting sustainable agriculture and
                local communities.
              </Typography>
              <Box>
                {socialLinks.map((social) => (
                  <SocialIcon
                    key={social.label}
                    aria-label={social.label}
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </SocialIcon>
                ))}
              </Box>
            </FooterSection>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FooterSection>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Quick Links
              </Typography>
              <Box component="nav">
                {quickLinks.map((link) => (
                  <Box key={link.text} mb={1}>
                    <Link
                      component={RouterLink}
                      to={link.path}
                      variant="body2"
                      underline="hover"
                    >
                      {link.text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </FooterSection>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FooterSection>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Legal
              </Typography>
              <Box component="nav">
                {legalLinks.map((link) => (
                  <Box key={link.text} mb={1}>
                    <Link
                      component={RouterLink}
                      to={link.path}
                      variant="body2"
                      underline="hover"
                    >
                      {link.text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </FooterSection>
          </Grid>

          <Grid item xs={12} md={4}>
            <FooterSection>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Contact Us
              </Typography>
              <Box display="flex" alignItems="flex-start" mb={2}>
                <LocationOn color="primary" sx={{ mr: 1, mt: 0.5 }} />
                <Typography variant="body2">
                  123 Farm Street, Agricultural Area
                  <br />
                  City, State 12345
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <Phone color="primary" sx={{ mr: 1 }} />
                <Link href="tel:+11234567890" variant="body2">
                  +1 (123) 456-7890
                </Link>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <Email color="primary" sx={{ mr: 1 }} />
                <Link href="mailto:info@krishibazaar.com" variant="body2">
                  info@krishibazaar.com
                </Link>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Monday - Friday: 9:00 AM - 6:00 PM
                </Typography>
              </Box>
            </FooterSection>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box mt={6} textAlign="center">
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body2" color="text.secondary">
            &copy; {currentYear} Krishi Bazaar. All rights reserved.
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary" mt={1}>
            Made with ❤️ for sustainable agriculture
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
