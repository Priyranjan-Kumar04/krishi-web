import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  useTheme,
  InputAdornment,
  Divider,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  LocationOn as LocationIcon, 
  Phone as PhoneIcon, 
  Email as EmailIcon, 
  Schedule as ScheduleIcon,
  Send as SendIcon
} from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const ContactCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  height: '100%',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const Contact = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      alert('Thank you for your message! We will get back to you soon.');
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <LocationIcon color="primary" fontSize="large" />,
      title: 'Our Office',
      description: '123 Agri-Tech Park, Sector 62\nNoida, Uttar Pradesh 201309',
      link: 'https://maps.google.com',
      linkText: 'View on Map'
    },
    {
      icon: <PhoneIcon color="primary" fontSize="large" />,
      title: 'Phone',
      description: '+91 98765 43210\n+91 11 2345 6789',
      link: 'tel:+919876543210',
      linkText: 'Call Now'
    },
    {
      icon: <EmailIcon color="primary" fontSize="large" />,
      title: 'Email',
      description: 'info@krishibazaar.com\nsupport@krishibazaar.com',
      link: 'mailto:info@krishibazaar.com',
      linkText: 'Send Email'
    },
    {
      icon: <ScheduleIcon color="primary" fontSize="large" />,
      title: 'Working Hours',
      description: 'Monday - Saturday: 9:00 AM - 8:00 PM\nSunday: 10:00 AM - 4:00 PM',
      link: '',
      linkText: ''
    }
  ];

  return (
    <Box sx={{ 
      py: 8,
      backgroundColor: theme.palette.background.default,
      minHeight: 'calc(100vh - 64px)'
    }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
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
            Contact Us
          </Typography>
          <Typography 
            variant="h6" 
            color="textSecondary"
            sx={{ maxWidth: '700px', mx: 'auto' }}
          >
            We'd love to hear from you! Reach out to us with any questions, feedback, or partnership inquiries.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'sticky', top: '100px' }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  mb: 4,
                  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
                }}
              >
                Get in Touch
              </Typography>
              
              <Grid container spacing={3}>
                {contactInfo.map((item, index) => (
                  <Grid item xs={12} sm={6} md={12} key={index}>
                    <ContactCard>
                      <Box sx={{ color: 'primary.main', mb: 2 }}>{item.icon}</Box>
                      <Typography variant="h6" component="h3" gutterBottom align="center">
                        {item.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="textSecondary" 
                        align="center"
                        sx={{ whiteSpace: 'pre-line', mb: 1 }}
                      >
                        {item.description}
                      </Typography>
                      {item.link && (
                        <Button 
                          href={item.link} 
                          color="primary" 
                          size="small"
                          sx={{ mt: 1 }}
                        >
                          {item.linkText}
                        </Button>
                      )}
                    </ContactCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <StyledPaper elevation={3}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  mb: 4,
                  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
                }}
              >
                Send us a Message
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="name"
                      name="name"
                      label="Your Name"
                      variant="outlined"
                      value={formData.name}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      name="email"
                      label="Email Address"
                      type="email"
                      variant="outlined"
                      value={formData.email}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="phone"
                      name="phone"
                      label="Phone Number (with country code)"
                      variant="outlined"
                      value={formData.phone}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="subject"
                      name="subject"
                      label="Subject"
                      variant="outlined"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="message"
                      name="message"
                      label="Your Message"
                      multiline
                      rows={5}
                      variant="outlined"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.15)',
                        },
                      }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </StyledPaper>
          </Grid>
        </Grid>

        {/* Map Section */}
        <Box mt={8}>
          <iframe
            title="Krishi Bazaar Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.876885150818!2d77.36786031508265!3d28.60282698242848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a4315237b9%3A0x1e3c5f6f8b8b8b8b!2sNoida%2C%20Uttar%20Pradesh%20201309!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: theme.shape.borderRadius * 2 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </Box>
      </Container>
    </Box>
  );
};

// Add missing icon import
const PersonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default Contact;
