import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import auth from '../lib/auth-helper';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const isActive = (location, path) => {
  return location.pathname === path ? { color: '#ff4081' } : { color: 'gold' };
};

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ color: 'gold', flexGrow: 1 }}>
            
            Product List
          </Typography>
          <Link to="/">
            <IconButton aria-label="Home" style={isActive(location, "/")}>
              <HomeIcon />
            </IconButton>
          </Link>
          <Link to="/users">
            <Button style={isActive(location, "/users")}>Users</Button>
          </Link>
          {!auth.isAuthenticated() && (
            <span>
              <Link to="/signup">
                <Button style={isActive(location, "/signup")}>Sign up</Button>
              </Link>
              <Link to="/signin">
                <Button style={isActive(location, "/signin")}>Sign In</Button>
              </Link>
            </span>
          )}
          {auth.isAuthenticated() && (
            <span>
              {auth.isAuthenticated().user && (
                <Link to="/owner/product">
                  <Button style={isActive(location, "/owner/product")}>My Products</Button>
                </Link>
              )}
              <Link to={"/user/" + auth.isAuthenticated().user._id}>
                <Button style={isActive(location, "/user/" + auth.isAuthenticated().user._id)}>My Profile</Button>
              </Link>
              <Button color="inherit" onClick={() => {
                auth.clearJWT(() => navigate('/'));
              }}>Sign out</Button>
            </span>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List>
          <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/users" onClick={toggleDrawer(false)}>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          {!auth.isAuthenticated() && (
            <>
              <ListItem button component={Link} to="/signup" onClick={toggleDrawer(false)}>
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary="Sign up" />
              </ListItem>
              <ListItem button component={Link} to="/signin" onClick={toggleDrawer(false)}>
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary="Sign In" />
              </ListItem>
            </>
          )}
          {auth.isAuthenticated() && (
            <>
              {auth.isAuthenticated().user && (
                <ListItem button component={Link} to="/owner/product" onClick={toggleDrawer(false)}>
                  <ListItemIcon><PersonIcon /></ListItemIcon>
                  <ListItemText primary="My Products" />
                </ListItem>
              )}
              <ListItem button component={Link} to={"/user/" + auth.isAuthenticated().user._id} onClick={toggleDrawer(false)}>
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItem>
              <ListItem button onClick={() => {
                auth.clearJWT(() => navigate('/'));
                toggleDrawer(false)();
              }}>
                <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                <ListItemText primary="Sign out" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </div>
  );
}
