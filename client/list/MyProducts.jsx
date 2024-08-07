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
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(1)}px`,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  addButton: {
    float: 'right'
  },
  leftIcon: {
    marginRight: '8px'
  }
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
      //abortController.abort();
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
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Your Products
          <span className={classes.addButton}>
            <Link to="/owner/product/new">
              <Button color="primary" variant="contained">
                <Icon className={classes.leftIcon}>add_box</Icon> New Product
              </Button>
            </Link>
          </span>
        </Typography>
        <List dense>
          {products.map((product, i) => (
            <span key={i}>
              <ListItem button>
                <ListItemText primary={product.name} secondary={product.description} />
                {auth.isAuthenticated().user && auth.isAuthenticated().user._id === product.owner._id && (
                  <ListItemSecondaryAction>
                    <Link to={"/owner/product/edit/" + product._id}>
                      <IconButton aria-label="Edit" color="primary">
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
