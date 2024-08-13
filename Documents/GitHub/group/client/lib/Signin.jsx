import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import { Navigate, useLocation } from 'react-router-dom';
import auth from './auth-helper.js';
import { signin } from './api-auth.js';

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
    margin: '0 auto',
    textAlign: 'center',
    marginTop: theme.spacing(3),
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
  '@keyframes rotateAndScale': {
    '0%': { transform: 'rotate(0deg) scale(1)' },
    '50%': { transform: 'rotate(180deg) scale(1.2)' },
    '100%': { transform: 'rotate(360deg) scale(1)' },
  },
  cardAnimated: {
    animation: '$rotateAndScale 1s ease-in-out',
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
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

export default function Signin() {
  const location = useLocation();
  const classes = useStyles();
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    redirectToReferrer: false,
    animate: false
  });

  const clickSubmit = () => {
    setValues({ ...values, animate: true });
    const user = {
      email: values.email || undefined,
      password: values.password || undefined
    };

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, animate: false });
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: '', redirectToReferrer: true });
        });
      }
    });
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const { from } = location.state || { from: { pathname: '/' } };

  if (values.redirectToReferrer) {
    return <Navigate to={from.pathname} />;
  }

  return (
    <div className={classes.root}>
      <Card className={`${classes.card} ${values.animate ? classes.cardAnimated : ''}`}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Sign In
          </Typography>
          <TextField
            id="email"
            type="email"
            label="Email"
            className={classes.textField}
            value={values.email}
            onChange={handleChange('email')}
            margin="normal"
          /><br/>
          <TextField
            id="password"
            type="password"
            label="Password"
            className={classes.textField}
            value={values.password}
            onChange={handleChange('password')}
            margin="normal"
          /><br/>
          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>
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
    </div>
  );
}
