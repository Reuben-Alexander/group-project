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
    flexGrow: 1,
    margin: 30,
  },
  card: {
    textAlign: 'center',
    paddingBottom: theme.spacing(2),
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
    fontSize: '1.2em',
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
  },
}));

export default function EditProduct() {
  const { productId } = useParams();
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

    read({ productId }, signal).then((data) => {
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
  }, [productId]);

  const clickSubmit = () => {
    const product = {
      name: values.name,
      description: values.description,
    };

    update({ productId }, { t: jwt.token }, product)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({ ...values, error: '', redirect: true });
        }
      })
      .catch((err) => {
        console.error(err);
        setValues({ ...values, error: 'Update failed. Please try again later.' });
      });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  if (values.redirect) {
    return <Navigate to="/user/products" />;
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
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
              <Typography variant="h6" component="h4" className={classes.title}>
                Owner: {values.owner}
              </Typography>
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
