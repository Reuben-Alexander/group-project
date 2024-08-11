import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import { list } from './api-user.js';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ArrowForward from '@material-ui/icons/ArrowForward';

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
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
    color: theme.palette.primary.main,
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

export default function Users() {
  const [users, setUsers] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setUsers(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={4}>
        <Typography variant="h6" className={classes.title}>
          All Users
        </Typography>
        <List dense>
          {users.map((item, i) => (
            <Link component={RouterLink} to={"/user/" + item._id} key={i}>
              <ListItem button className={classes.listItem}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    {item.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.name} />
                <ListItemSecondaryAction>
                  <IconButton className={classes.iconButton}>
                    <ArrowForward />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Link>
          ))}
        </List>
      </Paper>
    </div>
  );
}
