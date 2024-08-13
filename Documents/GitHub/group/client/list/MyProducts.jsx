import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Edit from '@material-ui/icons/Edit';
import Divider from '@material-ui/core/Divider';
import auth from '../lib/auth-helper.js';
import { listByOwner } from './api-list.js';
import { Navigate, Link } from 'react-router-dom';
import DeleteProduct from './DeleteProduct';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    backgroundImage: 'url(/assets/images/backgroundImage.png), linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5))',
    backgroundSize: 'cover',
    backgroundBlendMode: 'overlay',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    animation: '$fadeIn 2s ease-in-out',
  },
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  paper: {
    maxWidth: 800,
    margin: '0 auto',
    textAlign: 'center',
    padding: theme.spacing(3),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    animation: '$slideIn 1s ease-in-out',
  },
  '@keyframes slideIn': {
    '0%': { transform: 'translateY(-50px)', opacity: 0 },
    '100%': { transform: 'translateY(0)', opacity: 1 },
  },
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(1)}px`,
    color: theme.palette.primary.main,
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  addButton: {
    maxWidth: 800,
    float: 'right',
  },
  leftIcon: {
    marginRight: '8px',
  },
  listItem: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      transition: '0.3s',
    },
  },
  iconButton: {
    '&:hover': {
      color: theme.palette.secondary.main,
      transform: 'scale(1.2)',
      transition: '0.3s',
    },
  },
}));

export default function MyProducts() {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listByOwner({ userId: jwt.user._id }, { t: jwt.token }, signal).then((data) => {
      if (data.error) {
        setRedirectToSignin(true);
      } else {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Expected array but got:', data);
        }
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [jwt]);

  const removeProduct = (product) => {
    const updatedProducts = [...products];
    const index = updatedProducts.indexOf(product);
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  if (redirectToSignin) {
    return <Navigate to='/owner/product' />;
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={4}>
        <Typography type="title" className={classes.title}>
          Your Products
          <span className={classes.addButton}>
            <Link to="/owner/product/new">
              <Button color="primary" variant="contained">
                 New Product
              </Button>
            </Link>
          </span>
        </Typography>
        <List dense>
          {products.map((product, i) => (
            <span key={i}>
              <ListItem button className={classes.listItem}>
                <ListItemText primary={product.name} secondary={product.description} />
                {auth.isAuthenticated().user && auth.isAuthenticated().user._id === product.owner._id && (
                  <ListItemSecondaryAction>
                    <Link to={"/owner/product/edit/" + product._id}>
                      <IconButton aria-label="Edit" color="primary" className={classes.iconButton}>
                        <Edit />
                      </IconButton>
                    </Link>
                    <DeleteProduct product={product} onRemove={removeProduct} />
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              <Divider />
            </span>
          ))}
        </List>
      </Paper>
    </div>
  );
}
