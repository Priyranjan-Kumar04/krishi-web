import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Popper,
  Paper,
  Grow,
  ClickAwayListener,
  Collapse,
  CircularProgress,
  Grid,
  Pagination,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ShoppingCart,
  AccountCircle,
  Brightness4,
  Brightness7,
  ExpandMore,
  ExpandLess,
  ExitToApp,
  ShoppingBag,
  Settings
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import { cropCategories } from '../../data/cropCategories';

const StyledAppBar = styled(AppBar)({
  backgroundColor: 'white',
  color: '#2e7d32',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

const Navbar = ({ darkMode, setDarkMode }) => {
  const { isAuthenticated, logout, loading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [cropMenuAnchor, setCropMenuAnchor] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState({
    crops: false
  });
  const [categories, setCategories] = useState([...cropCategories]);
  const navigate = useNavigate();

  // Handler for pagination
  const handlePageChange = (categoryId, subcategoryName, page) => {
    setCategories(prevCategories => 
      prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            subcategories: category.subcategories.map(subcategory => {
              if (subcategory.name === subcategoryName) {
                return { ...subcategory, page };
              }
              return subcategory;
            })
          };
        }
        return category;
      })
    );
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCropMenuOpen = (event) => {
    setCropMenuAnchor(event.currentTarget);
  };

  const handleCropMenuClose = () => {
    setCropMenuAnchor(null);
  };

  const toggleMobileSubmenu = (menuId) => {
    setMobileSubmenuOpen(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { 
      text: 'Crops & Products',
      path: '/products',
      hasMenu: true,
      onClick: handleCropMenuOpen
    },
    { text: 'Farmers', path: '/farmers' },
    { text: 'Price Trends', path: '/price-recommendation' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' },
  ];

  const userMenuItems = [
    { text: 'Profile', path: '/profile', icon: <AccountCircle /> },
    { text: 'Orders', path: '/orders', icon: <ShoppingCart /> },
    { text: 'Settings', path: '/settings', icon: <Settings /> },
  ];

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280 }}>
      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            {item.hasMenu ? (
              <>
                <ListItem 
                  button 
                  onClick={() => toggleMobileSubmenu('crops')}
                >
                  <ListItemText primary={item.text} />
                  {mobileSubmenuOpen.crops ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={mobileSubmenuOpen.crops} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {cropCategories.map((category) => (
                      <React.Fragment key={category.id}>
                        <ListItem 
                          button 
                          sx={{ pl: 4 }}
                          onClick={() => toggleMobileSubmenu(`category-${category.id}`)}
                        >
                          <ListItemText primary={category.name} />
                          {mobileSubmenuOpen[`category-${category.id}`] ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={mobileSubmenuOpen[`category-${category.id}`]} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            {category.subcategories.map((subcategory) => (
                              <React.Fragment key={subcategory.name}>
                                <ListItem 
                                  button 
                                  sx={{ pl: 6 }}
                                  onClick={() => toggleMobileSubmenu(`subcategory-${subcategory.name}`)}
                                >
                                  <ListItemText primary={subcategory.name} />
                                  {mobileSubmenuOpen[`subcategory-${subcategory.name}`] ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse in={mobileSubmenuOpen[`subcategory-${subcategory.name}`]} timeout="auto" unmountOnExit>
                                  <List component="div" disablePadding>
                                    {subcategory.items.map((item) => (
                                      <ListItem 
                                        button 
                                        key={item}
                                        component={RouterLink}
                                        to={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory.name)}&variety=${encodeURIComponent(item)}`}
                                        sx={{ pl: 8 }}
                                        onClick={handleDrawerToggle}
                                      >
                                        <ListItemText primary={item} />
                                      </ListItem>
                                    ))}
                                    {subcategory.totalPages > 1 && (
                                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                                        <Pagination 
                                          count={subcategory.totalPages} 
                                          page={subcategory.page} 
                                          size="small"
                                          onChange={(e, page) => handlePageChange(category.id, subcategory.name, page)}
                                        />
                                      </Box>
                                    )}
                                  </List>
                                </Collapse>
                              </React.Fragment>
                            ))}
                          </List>
                        </Collapse>
                      </React.Fragment>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem 
                button 
                component={RouterLink} 
                to={item.path}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={64}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile menu button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'flex' },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              KRISHI
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  onClick={item.onClick}
                  sx={{
                    my: 2,
                    color: 'inherit',
                    display: 'block',
                    position: 'relative',
                    '&:hover': {
                      color: theme.palette.primary.main,
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60%',
                        height: '2px',
                        backgroundColor: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  {item.text}
                  {item.hasMenu && (
                    <Box component="span" sx={{ ml: 0.5, display: 'inline-flex' }}>
                      ▼
                    </Box>
                  )}
                </Button>
              ))}
            </Box>

            {/* Dark mode toggle */}
            <IconButton
              sx={{ ml: 1 }}
              onClick={() => setDarkMode(!darkMode)}
              color="inherit"
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* User menu */}
            {isAuthenticated ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose} component={RouterLink} to="/profile">
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose} component={RouterLink} to="/orders">
                    My Orders
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  sx={{ ml: 1 }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/register"
                  sx={{ ml: 1 }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Toolbar>
        </Container>

        {/* Crop Categories Dropdown */}
        <Popper
          open={Boolean(cropMenuAnchor)}
          anchorEl={cropMenuAnchor}
          role="menu"
          placement="bottom-start"
          transition
          disablePortal
          sx={{
            zIndex: theme.zIndex.modal,
            width: '100%',
            maxWidth: '1200px',
            left: '50% !important',
            transform: 'translateX(-50%) !important',
          }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  maxHeight: '80vh',
                  overflowY: 'auto',
                }}
              >
                <Grid container spacing={2}>
                  {categories.map((category) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                      <Box
                        sx={{
                          p: 1,
                          height: '100%',
                          borderRight: { sm: '1px solid', smBorderColor: 'divider' },
                          '&:last-child': {
                            borderRight: 'none'
                          }
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            color: theme.palette.primary.main,
                            mb: 2,
                            pb: 1,
                            borderBottom: `2px solid ${theme.palette.primary.main}`,
                          }}
                        >
                          {category.name}
                        </Typography>
                        <List dense disablePadding>
                          {category.subcategories.map((subcategory) => (
                            <React.Fragment key={subcategory.name}>
                              <ListItem
                                button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMobileSubmenu(`desktop-${category.id}-${subcategory.name}`);
                                }}
                                sx={{
                                  borderRadius: 1,
                                  mb: 0.5,
                                  '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                  },
                                }}
                              >
                                <ListItemText
                                  primary={subcategory.name}
                                  primaryTypographyProps={{
                                    variant: 'subtitle2',
                                    fontWeight: 'medium',
                                  }}
                                />
                                {mobileSubmenuOpen[`desktop-${category.id}-${subcategory.name}`] ? (
                                  <ExpandLess fontSize="small" />
                                ) : (
                                  <ExpandMore fontSize="small" />
                                )}
                              </ListItem>
                              <Collapse 
                                in={mobileSubmenuOpen[`desktop-${category.id}-${subcategory.name}`]} 
                                timeout="auto" 
                                unmountOnExit
                              >
                                <List component="div" disablePadding dense>
                                  {subcategory.items.map((item) => (
                                    <ListItem
                                      key={item}
                                      button
                                      component={RouterLink}
                                      to={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory.name)}&variety=${encodeURIComponent(item)}`}
                                      onClick={handleCropMenuClose}
                                      sx={{
                                        pl: 2,
                                        py: 0.5,
                                        fontSize: '0.875rem',
                                        '&:hover': {
                                          backgroundColor: theme.palette.action.hover,
                                        },
                                      }}
                                    >
                                      <ListItemText 
                                        primary={item} 
                                        primaryTypographyProps={{
                                          variant: 'body2',
                                          color: 'text.secondary',
                                        }}
                                      />
                                    </ListItem>
                                  ))}
                                  {subcategory.totalPages > 1 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 1 }}>
                                      <Pagination 
                                        count={subcategory.totalPages} 
                                        page={subcategory.page} 
                                        size="small"
                                        onChange={(e, page) => {
                                          e.stopPropagation();
                                          handlePageChange(category.id, subcategory.name, page);
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </Box>
                                  )}
                                </List>
                              </Collapse>
                            </React.Fragment>
                          ))}
                        </List>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grow>
          )}
        </Popper>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <nav>
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
        >
          {drawer}
        </Drawer>
      </nav>

      {/* Click away listener for crop menu */}
      <ClickAwayListener onClickAway={handleCropMenuClose}>
        <Box />
      </ClickAwayListener>
    </>
  );
};

export default Navbar;
