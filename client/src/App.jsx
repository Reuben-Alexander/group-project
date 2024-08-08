import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import MainRouter from '../MainRouter';
import theme from '../theme';
import './App.css'; // 引入全局 CSS 文件

//import { hot } from 'react-hot-loader'
const App = () => {
 return (
<Router>
<ThemeProvider theme={theme}>
<MainRouter />
</ThemeProvider>
</Router>
 );
};
export default App;
