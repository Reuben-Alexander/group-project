import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import unicornbikeImg from './../assets/images/group-logo.png';

const useStyles = makeStyles(theme => ({
 root: {
  backgroundColor: 'black',

 },
 card: {
 maxWidth: 600,
 margin: 'auto',
 marginTop: theme.spacing(5),
  backgroundColor: 'black',
 },
 title: {
 padding: theme.spacing(3, 2.5, 2),
 color: theme.palette.openTitle,
 },
 media: {
 minHeight: 400,
 },
}));
export default function Home(){
const classes = useStyles()
return (
<Card className={classes.card}>

 {/*<Typography variant="h6" className={classes.title}>Home Page</Typography>*/}
<CardMedia className={classes.media}
image={unicornbikeImg} title="Unicorn Bicycle"/>
{/*<CardContent>*/}
{/*<Typography variant="body2" component="p">*/}
{/*Welcome to the Product List home page.*/}
{/*</Typography>*/}
{/*</CardContent>*/}
</Card>
)
}



// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Card from '@material-ui/core/Card';
// import CardMedia from '@material-ui/core/CardMedia';
// import unicornbikeImg from './../assets/images/group-logo.png';
//
// const useStyles = makeStyles(theme => ({
//  root: {
//   backgroundColor: 'black',
//   height: '100vh',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//  },
//  card: {
//   backgroundColor: 'black',
//  },
//  media: {
//   height: '80vh',
//   width: 'auto',
//  },
// }));
//
// export default function Home() {
//  const classes = useStyles();
//  return (
//      <div className={classes.root}>
//       <Card className={classes.card}>
//        <CardMedia
//            className={classes.media}
//            image={unicornbikeImg}
//            title="Unicorn Bicycle"
//        />
//       </Card>
//      </div>
//  );
// }
