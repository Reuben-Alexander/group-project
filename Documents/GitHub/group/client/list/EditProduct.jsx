import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import auth from '../lib/auth-helper.js';
import { read, update } from './api-list.js';
import { Navigate, useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
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
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    paddingBottom: theme.spacing(2),
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
    margin: theme.spacing(2),
    color: theme.palette.primary.main,
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  error: {
    verticalAlign: 'middle',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400,
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2),
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      boxShadow: '0 0 20px #ffff00, 0 0 30px #ffff00, 0 0 40px #ffff00',
      transition: '0.3s',
    },
  },
}));

export default function EditProduct() {
  const params = useParams();
  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    description: '',
    redirect: false,
    error: '',
    owner: '',
  });
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ productId: params.productId }, signal).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          owner: data.owner.name,
        });
      }
    });

    return () => {
      abortController.abort();
    };
  }, [params.productId]);

  const clickSubmit = () => {
    let productData = new FormData();
    values.name && productData.append('name', values.name);
    values.description && productData.append('description', values.description);
    update(
      {
        productId: params.productId,
      },
      {
        t: jwt.token,
      },
      productData
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, redirect: true });
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  if (values.redirect) {
    return <Navigate to="/owner/product" />;
  }

  return (
    <div className={classes.root}>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} sm={8} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" className={classes.title}>
                Edit Product
              </Typography>
              <TextField
                id="name"
                label="Name"
                className={classes.textField}
                value={values.name}
                onChange={handleChange('name')}
                margin="normal"
              />
              <TextField
                id="description"
                label="Description"
                multiline
                minRows={3}
                className={classes.textField}
                value={values.description}
                onChange={handleChange('description')}
                margin="normal"
              />
              {values.error && (
                <Typography component="p" color="error">
                  <Icon color="error" className={classes.error}>
                    error
                  </Icon>
                  {values.error}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button
                color="primary"
                variant="contained"
                onClick={clickSubmit}
                className={classes.submit}
              >
                Update
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
