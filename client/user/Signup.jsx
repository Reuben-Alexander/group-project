import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, TextField, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { create } from './api-user';

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
    maxWidth: 400,
    margin: '0 auto',
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    animation: '$slideIn 1s ease-in-out',
  },
  '@keyframes slideIn': {
    '0%': { transform: 'translateY(-50px)', opacity: 0 },
    '100%': { transform: 'translateY(0)', opacity: 1 },
  },
  '@keyframes rotateAndScale': {
    '0%': { transform: 'rotate(0deg) scale(1)' },
    '50%': { transform: 'rotate(180deg) scale(1.2)' },
    '100%': { transform: 'rotate(360deg) scale(1)' },
  },
  cardAnimated: {
    animation: '$rotateAndScale 1s ease-in-out',
  },
  textField: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  error: {
    color: 'red',
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2),
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      boxShadow: '0 0 20px #ffff00, 0 0 30px #ffff00, 0 0 40px #ffff00',
      transition: '0.3s'
    }
  },
  title: {
    fontSize: 18,
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2)
  },
  icon: {
    margin: theme.spacing(1),
    width: 40,
    height: 40,
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      boxShadow: '0 0 20px #ffff00, 0 0 30px #ffff00, 0 0 40px #ffff00',
      transform: 'scale(1.2) rotate(10deg)'
    }
  }
}));

export default function Signup() {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    animate: false
  });
  const [open, setOpen] = useState(false);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clickSubmit = () => {
    setValues({ ...values, animate: true });
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    };
    create(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, animate: false });
      } else {
        setOpen(true);
      }
    });
  };

  Signup.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  return (
    <div className={classes.root}>
      <Card className={`${classes.card} ${values.animate ? classes.cardAnimated : ''}`}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Sign Up
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
            id="email"
            label="Email"
            className={classes.textField}
            value={values.email}
            onChange={handleChange('email')}
            margin="normal"
          />
          <TextField
            id="password"
            label="Password"
            className={classes.textField}
            value={values.password}
            onChange={handleChange('password')}
            type="password"
            margin="normal"
          />
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit}
            className={classes.submit}>
            Submit
          </Button>
        </CardActions>
        <div className={classes.iconContainer}>
          <img src="./../assets/icons/github.png" alt="Icon 1" className={classes.icon} />
          <img src="./../assets/icons/instagram.png" alt="Icon 2" className={classes.icon} />
          <img src="./../assets/icons/whatsapp.png" alt="Icon 3" className={classes.icon} />
          <img src="./../assets/icons/youtube.png" alt="Icon 4" className={classes.icon} />
        </div>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/Signin">
            <Button color="primary" autoFocus variant="contained" onClick={handleClose}>
              Sign In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
}
