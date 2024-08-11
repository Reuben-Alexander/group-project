import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Edit from '@material-ui/icons/Edit';
import Person from '@material-ui/icons/Person';
import Divider from '@material-ui/core/Divider';
import DeleteUser from './DeleteUser';
import auth from '../lib/auth-helper.js';
import { read } from './api-user.js';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

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
    maxWidth: 600,
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
    marginTop: theme.spacing(3),
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
  listItem: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      transition: '0.3s',
    },
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  iconButton: {
    '&:hover': {
      color: theme.palette.secondary.main,
      transform: 'scale(1.2)',
      transition: '0.3s',
    },
  },
}));

export default function Profile() {
  const location = useLocation();
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const jwt = auth.isAuthenticated();
  const { userId } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    read({ userId }, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true);
      } else {
        setUser(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [userId]);

  if (redirectToSignin) {
    return <Navigate to="/owner/product" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={4}>
        <Typography variant="h6" className={classes.title}>
          Profile
        </Typography>
        <List dense>
          <ListItem>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <Person />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.name} secondary={user.email} />
            {auth.isAuthenticated().user && auth.isAuthenticated().user._id === user._id && (
              <ListItemSecondaryAction>
                <Link to={`/user/edit/${user._id}`}>
                  <IconButton aria-label="Edit" color="primary" className={classes.iconButton}>
                    <Edit />
                  </IconButton>
                </Link>
                <DeleteUser userId={user._id} />
              </ListItemSecondaryAction>
            )}
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary={`Joined: ${new Date(user.created).toDateString()}`} />
          </ListItem>
        </List>
      </Paper>
    </div>
  );
}
