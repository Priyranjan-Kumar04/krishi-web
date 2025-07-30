import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  CircularProgress,
  ClickAwayListener,
  Paper,
  Popper,
  Grow,
  MenuList,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  AccountCircle,
  Brightness4,
  Brightness7,
  Person,
  ShoppingBag,
  Dashboard,
  Settings,
  ExitToApp,
  Login,
  PersonAdd,
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
  const { user, isAuthenticated, logout, loading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [cropMenuAnchor, setCropMenuAnchor] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isCropMenuOpen = Boolean(cropMenuAnchor);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Handle submenu open/close
  const handleSubmenuOpen = (categoryId) => (event) => {
    setOpenSubmenu(openSubmenu === categoryId ? null : categoryId);
  };

  // Close all menus when clicking away
  const handleCloseAllMenus = () => {
    setCropMenuAnchor(null);
    setOpenSubmenu(null);
  };

  // Handle crop menu open
  const handleCropMenuOpen = (event) => {
    setCropMenuAnchor(event.currentTarget);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      handleMenuClose();
      // Redirect to home after logout
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
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
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      onClick: () => navigate('/dashboard'),
      divider: false
    },
    { 
      text: 'My Profile', 
      icon: <AccountCircle />, 
      onClick: () => navigate('/profile'),
      divider: false
    },
    { 
      text: 'My Orders', 
      icon: <ShoppingBag />, 
      onClick: () => navigate('/orders'),
      divider: true
    },
    { 
      text: 'Settings', 
      icon: <Settings />, 
      onClick: () => navigate('/settings'),
      divider: false
    },
    { 
      text: 'Logout', 
      icon: isLoggingOut ? <CircularProgress size={20} /> : <ExitToApp />, 
      onClick: handleLogout,
      disabled: isLoggingOut,
      divider: false
    },
  ];

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        style: {
          width: 200,
        },
      }}
    >
      {isAuthenticated ? (
        <>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {user?.name || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          {userMenuItems.map((item, index) => (
            <MenuItem
              key={item.text}
              onClick={item.onClick}
              disabled={item.disabled}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText>{item.text}</ListItemText>
            </MenuItem>
          ))}
          <Divider sx={{ my: 1 }} />
          <MenuItem 
            onClick={handleLogout}
            disabled={isLoggingOut}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon>
              {isLoggingOut ? <CircularProgress size={20} /> : <ExitToApp fontSize="small" />}
            </ListItemIcon>
            <ListItemText>Logout{isLoggingOut ? 'ting out...' : ''}</ListItemText>
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem component={RouterLink} to="/login" onClick={handleMenuClose}>
            <Login fontSize="small" sx={{ mr: 1 }} />
            Login
          </MenuItem>
          <MenuItem component={RouterLink} to="/register" onClick={handleMenuClose}>
            <PersonAdd fontSize="small" sx={{ mr: 1 }} />
            Register
          </MenuItem>
        </>
      )}
    </Menu>
  );

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', width: 250 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Krishi Bazaar
      </Typography>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            component={RouterLink}
            to={item.path}
            key={item.text}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
              },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {isAuthenticated ? (
          <>
            <Divider sx={{ my: 1 }} />
            {userMenuItems.map((item) => (
              <ListItem
                button
                component={RouterLink}
                to={item.path}
                key={item.text}
                sx={{ pl: 4 }}
                onClick={item.onClick}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem button component={RouterLink} to="/login">
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={RouterLink} to="/register">
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
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
              display: { xs: 'none', md: 'flex' },
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

          {/* Crop Categories Menu - Desktop */}
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

          {/* Crop Categories Dropdown */}
          <Popper
            open={isCropMenuOpen}
            anchorEl={cropMenuAnchor}
            role={undefined}
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
                    p: 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    maxHeight: '70vh',
                    overflowY: 'auto',
                  }}
                >
                  {cropCategories.map((category) => (
                    <Box
                      key={category.id}
                      sx={{
                        width: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' },
                        p: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 'bold',
                          color: theme.palette.primary.main,
                          mb: 1,
                          pb: 1,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        {category.name}
                      </Typography>
                      <List dense disablePadding>
                        {category.subcategories.map((subcategory) => (
                          <ListItem
                            key={subcategory}
                            button
                            component={RouterLink}
                            to={`/products?category=${encodeURIComponent(subcategory)}`}
                            onClick={handleCloseAllMenus}
                            sx={{
                              borderRadius: 1,
                              '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                              },
                            }}
                          >
                            <ListItemText
                              primary={subcategory}
                              primaryTypographyProps={{
                                variant: 'body2',
                                color: 'text.secondary',
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ))}
                </Paper>
              </Grow>
            )}
          </Popper>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    color: 'inherit',
                    mx: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <IconButton
              color="inherit"
              aria-label="cart"
              component={RouterLink}
              to="/cart"
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={0} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            <IconButton color="inherit" onClick={toggleDarkMode} aria-label="toggle theme">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {isAuthenticated && user?.avatar ? (
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </StyledAppBar>

      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 250,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      {renderMenu}
    </>
  );
};

export default Navbar;
