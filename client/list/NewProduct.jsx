import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import auth from '../lib/auth-helper.js';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import { create } from './api-list.js';
import { Link, Navigate } from 'react-router-dom';

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
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
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
  error: {
    verticalAlign: 'middle',
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.primary.main,
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
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
  input: {
    display: 'none',
  },
  filename: {
    marginLeft: '10px',
  },
}));

export default function NewProduct() {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    description: '',
    redirect: false,
    error: '',
  });
  const jwt = auth.isAuthenticated();

  const handleChange = name => event => {
    const value = event.target.value;
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = () => {
    let productData = new FormData();
    if (values.name) {
      productData.append('name', values.name);
    }
    if (Array.isArray(values.description)) {
      productData.append('description', values.description[0]);
    } else {
      productData.append('description', values.description);
    }

    create(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      productData
    )
      .then(data => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({ ...values, error: '', redirect: true });
        }
      })
      .catch(err => console.error(err));
  };

  if (values.redirect) {
    return <Navigate to={'/owner/product'} />;
  }

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            New Product
          </Typography>
          <br />
          <TextField
            id="name"
            label="Name"
            className={classes.textField}
            value={values.name}
            onChange={handleChange('name')}
            margin="normal"
          />
          <br />
          <TextField
            id="multiline-flexible"
            label="Description"
            multiline
            minRows={2}
            value={values.description}
            onChange={handleChange('description')}
            className={classes.textField}
            margin="normal"
          />
          <br />
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
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>
            Submit
          </Button>
          <Link to="/owner/product" className={classes.submit}>
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </Card>
    </div>
  );
}
