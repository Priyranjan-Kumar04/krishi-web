import React, { useState } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent, CardMedia,
  TextField, Button, Select, MenuItem, FormControl, InputLabel,
  Paper, Divider, Chip, useTheme, useMediaQuery, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Avatar, Snackbar, Alert, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress
} from '@mui/material';
import {
  Search, FilterList, AttachMoney, LocalShipping,
  LocationOn, CalendarToday, TrendingUp, TrendingDown, TrendingFlat,
  Sell, Inventory, Info
} from '@mui/icons-material';

// Mock data for price recommendations
const cropCategories = [
  'All Crops', 'Cereals', 'Pulses', 'Vegetables', 'Fruits', 'Spices', 'Cash Crops'
];

const priceTrends = [
  { id: 1, crop: 'Basmati Rice', location: 'Punjab', currentPrice: 2800, trend: 'up', change: 5.2, unit: 'quintal', image: 'https://source.unsplash.com/random/200x200?basmati-rice' },
  { id: 2, crop: 'Wheat', location: 'Uttar Pradesh', currentPrice: 2100, trend: 'down', change: 2.1, unit: 'quintal', image: 'https://source.unsplash.com/random/200x200?wheat' },
  { id: 3, crop: 'Tomato', location: 'Maharashtra', currentPrice: 1200, trend: 'up', change: 12.5, unit: 'quintal', image: 'https://source.unsplash.com/random/200x200?tomato' },
  { id: 4, crop: 'Potato', location: 'West Bengal', currentPrice: 800, trend: 'down', change: 3.7, unit: 'quintal', image: 'https://source.unsplash.com/random/200x200?potato' },
  { id: 5, crop: 'Sugarcane', location: 'Maharashtra', currentPrice: 320, trend: 'up', change: 1.8, unit: 'quintal', image: 'https://source.unsplash.com/random/200x200?sugarcane' },
  { id: 6, crop: 'Cotton', location: 'Gujarat', currentPrice: 6500, trend: 'up', change: 7.3, unit: 'quintal', image: 'https://source.unsplash.com/random/200x200?cotton' },
];

const PriceRecommendation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [selectedCategory, setSelectedCategory] = useState('All Crops');
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [quantity, setQuantity] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [predictionDialog, setPredictionDialog] = useState({ open: false, data: null });
  const [isLoading, setIsLoading] = useState(false);
  
  const filteredTrends = priceTrends.filter(trend => {
    const matchesCategory = selectedCategory === 'All Crops' || trend.crop.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = trend.crop.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         trend.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSellNow = (crop) => {
    setSnackbar({
      open: true,
      message: `Selling suggestion for ${crop} has been noted. We'll connect you with potential buyers.`,
      severity: 'success'
    });
  };

  const handleHold = (crop) => {
    setSnackbar({
      open: true,
      message: `We've noted your decision to hold ${crop}. We'll notify you when prices improve.`,
      severity: 'info'
    });
  };

  const handleGetPrediction = () => {
    if (!selectedCrop) {
      setSnackbar({
        open: true,
        message: 'Please select a crop',
        severity: 'warning'
      });
      return () => {}; // Return empty cleanup function
    }
    
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid quantity',
        severity: 'warning'
      });
      return () => {}; // Return empty cleanup function
    }

    setIsLoading(true);
    
    // Store timeout ID for cleanup
    const timer = setTimeout(() => {
      try {
        const cropData = priceTrends.find(trend => trend.crop === selectedCrop) || priceTrends[0];
        const prediction = {
          crop: selectedCrop,
          quantity: parseFloat(quantity),
          currentPrice: cropData.currentPrice,
          predictedPrice: cropData.currentPrice * (1 + (Math.random() * 0.2 - 0.1)),
          recommendation: Math.random() > 0.3 ? 'sell' : 'hold',
          confidence: Math.floor(70 + Math.random() * 25),
          bestTimeToSell: new Date(Date.now() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000).toLocaleDateString()
        };
        
        setPredictionDialog({
          open: true,
          data: prediction
        });
      } catch (error) {
        console.error('Error generating prediction:', error);
        setSnackbar({
          open: true,
          message: 'Error generating prediction. Please try again.',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    }, 1500);

    // Return cleanup function
    return () => clearTimeout(timer);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleClosePredictionDialog = () => {
    setPredictionDialog({ ...predictionDialog, open: false });
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="success" />;
      case 'down':
        return <TrendingDown color="error" />;
      default:
        return <TrendingFlat color="action" />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Crop Price Recommendations
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Get the latest price trends and recommendations for your crops
      </Typography>
      
      {/* Search and Filter Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by crop or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search color="action" sx={{ mr: 1 }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Crop Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Crop Category"
                startAdornment={
                  <FilterList color="action" sx={{ mr: 1 }} />
                }
              >
                {cropCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Location</InputLabel>
              <Select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                label="Location"
                startAdornment={
                  <LocationOn color="action" sx={{ mr: 1 }} />
                }
              >
                <MenuItem value="">All Locations</MenuItem>
                <MenuItem value="Punjab">Punjab</MenuItem>
                <MenuItem value="Uttar Pradesh">Uttar Pradesh</MenuItem>
                <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                <MenuItem value="West Bengal">West Bengal</MenuItem>
                <MenuItem value="Gujarat">Gujarat</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                // Handle search
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Price Trends Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Current Market Trends
          </Typography>
          <Chip 
            icon={<CalendarToday fontSize="small" />} 
            label={`Updated: ${new Date().toLocaleDateString()}`} 
            size="small" 
            variant="outlined"
          />
        </Box>
        
        <Grid container spacing={3}>
          {filteredTrends.slice(0, isMobile ? 2 : 3).map((trend) => (
            <Grid item xs={12} sm={6} md={4} key={trend.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={trend.image}
                    alt={trend.crop}
                  />
                  <Chip
                    label={`${trend.trend === 'up' ? '+' : ''}${trend.change}%`}
                    color={trend.trend === 'up' ? 'success' : 'error'}
                    size="small"
                    icon={getTrendIcon(trend.trend)}
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: trend.trend === 'up' ? 'success.light' : 'error.light',
                      color: 'white',
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {trend.crop}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ₹{trend.currentPrice.toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <LocationOn fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    {trend.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Per {trend.unit}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {!isMobile && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Detailed Price Analysis</Typography>
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Crop</TableCell>
                    <TableCell align="right">Current Price (₹/quintal)</TableCell>
                    <TableCell align="right">1 Month Change</TableCell>
                    <TableCell align="right">3 Month Trend</TableCell>
                    <TableCell align="right">Recommended Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTrends.map((trend) => (
                    <TableRow key={trend.id} hover>
                      <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={trend.image} alt={trend.crop} sx={{ width: 32, height: 32, mr: 2 }} />
                        {trend.crop}
                      </TableCell>
                      <TableCell align="right">₹{trend.currentPrice.toLocaleString('en-IN')}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          {getTrendIcon(trend.trend)}
                          <span style={{ color: trend.trend === 'up' ? theme.palette.success.main : theme.palette.error.main }}>
                            {trend.change}%
                          </span>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {trend.trend === 'up' ? 'Increasing' : 'Decreasing'} Demand
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={trend.trend === 'up' ? 'Sell Now' : 'Hold'}
                          color={trend.trend === 'up' ? 'success' : 'warning'}
                          size="small"
                          variant="outlined"
                          onClick={() => trend.trend === 'up' ? handleSellNow(trend.crop) : handleHold(trend.crop)}
                          clickable
                          icon={trend.trend === 'up' ? <Sell fontSize="small" /> : <Inventory fontSize="small" />}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
      
      {/* Price Prediction Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Get Personalized Price Prediction</Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Enter your crop details to get a personalized price prediction and selling recommendation.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Select Crop</InputLabel>
              <Select 
                label="Select Crop"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                <MenuItem value="">Select a crop</MenuItem>
                {Array.from(new Set(priceTrends.map(t => t.crop))).map(crop => (
                  <MenuItem key={crop} value={crop}>{crop}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Quantity (in Quintals)"
              variant="outlined"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              InputProps={{
                endAdornment: <Typography>Qtls</Typography>,
              }}
              inputProps={{
                min: 0,
                step: 0.1
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleGetPrediction}
              disabled={isLoading}
              endIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <TrendingUp />}
            >
              {isLoading ? 'Analyzing...' : 'Get Prediction'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Market Insights */}
      <Box>
        <Typography variant="h6" gutterBottom>Market Insights</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Best Selling Crops This Week</Typography>
              </Box>
              <ul>
                <li><Typography>Basmati Rice - ₹2,850/quintal (Punjab)</Typography></li>
                <li><Typography>Tomato - ₹1,450/quintal (Maharashtra)</Typography></li>
                <li><Typography>Cotton - ₹6,700/quintal (Gujarat)</Typography></li>
              </ul>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingDown color="error" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Prices Dropping</Typography>
              </Box>
              <ul>
                <li><Typography>Potato - Down 3.7% this week</Typography></li>
                <li><Typography>Onion - Down 2.9% this week</Typography></li>
                <li><Typography>Wheat - Down 2.1% this week</Typography></li>
              </ul>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Prediction Result Dialog */}
      <Dialog
        open={predictionDialog.open}
        onClose={handleClosePredictionDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Price Prediction Result</DialogTitle>
        <DialogContent>
          {predictionDialog.data && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  src={priceTrends.find(t => t.crop === predictionDialog.data.crop)?.image}
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">{predictionDialog.data.crop}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {predictionDialog.data.quantity} Quintals
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Current Price:</Typography>
                  <Typography variant="h6" color="primary">
                    ₹{predictionDialog.data.currentPrice.toLocaleString('en-IN')}/quintal
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Predicted Price:</Typography>
                  <Typography 
                    variant="h6" 
                    color={predictionDialog.data.predictedPrice > predictionDialog.data.currentPrice ? 'success.main' : 'error.main'}
                  >
                    ₹{predictionDialog.data.predictedPrice.toFixed(2).toLocaleString('en-IN')}/quintal
                    {predictionDialog.data.predictedPrice > predictionDialog.data.currentPrice ? (
                      <TrendingUp color="success" sx={{ ml: 1, verticalAlign: 'middle' }} />
                    ) : (
                      <TrendingDown color="error" sx={{ ml: 1, verticalAlign: 'middle' }} />
                    )}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      bgcolor: predictionDialog.data.recommendation === 'sell' ? 'success.light' : 'warning.light',
                      borderColor: predictionDialog.data.recommendation === 'sell' ? 'success.main' : 'warning.main'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Info color={predictionDialog.data.recommendation === 'sell' ? 'success' : 'warning'} sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">
                        <strong>Recommendation:</strong> {predictionDialog.data.recommendation === 'sell' ? 'Sell Now' : 'Hold'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, ml: 4 }}>
                      {predictionDialog.data.recommendation === 'sell' 
                        ? 'Prices are favorable for selling right now. You could get a good return on your produce.'
                       : 'Prices are expected to improve. Consider holding for better rates.'}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, ml: 4, fontStyle: 'italic' }}>
                      Confidence: {predictionDialog.data.confidence}%
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <CalendarToday fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Best time to sell: {predictionDialog.data.bestTimeToSell}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePredictionDialog}>Close</Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<Sell />}
            onClick={() => {
              handleSellNow(predictionDialog.data?.crop || 'your crop');
              handleClosePredictionDialog();
            }}
          >
            Sell Now
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PriceRecommendation;
