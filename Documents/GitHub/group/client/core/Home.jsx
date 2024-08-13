import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import unicornbikeImg from './../assets/images/group-logo.png';

const useStyles = makeStyles(theme => ({
 // root: {
 //  backgroundColor: 'black',
 //
 // },
 // card: {
 // maxWidth: 600,
 // margin: 'auto',
 // marginTop: theme.spacing(5),
 //  backgroundColor: 'black',
 // },
 //
 // title: {
 // padding: theme.spacing(3, 2.5, 2),
 // color: theme.palette.openTitle,
 // },
 // media: {
 // minHeight: 400,
 // },

 root: {
  backgroundColor: 'black',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  animation: '$backgroundAnimation 10s infinite alternate',
 },
 card: {
  backgroundColor: 'black',
  transition: 'transform 0.5s ease',
  '&:hover': {
   transform: 'scale(1.05)',
  },
 },
 media: {
  height: '80vh',
  width: 'auto',
  opacity: 0,
  animation: '$fadeIn 2s forwards',
 },
 '@keyframes fadeIn': {
  '0%': {
   opacity: 0,
  },
  '100%': {
   opacity: 1,
  },
 },
 '@keyframes backgroundAnimation': {
  '0%': {
   backgroundColor: '#000000',
  },
  '100%': {
   backgroundColor: '#333333',
  },
 },

}));

export default function Home(){
const classes = useStyles()
return (
<Card className={classes.card}>

<CardMedia className={classes.media}
image={unicornbikeImg} title="Unicorn Bicycle"/>
</Card>
)
}

