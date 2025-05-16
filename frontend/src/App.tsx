import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Route, Routes, Navigate, BrowserRouter as Router } from 'react-router-dom';
import ViewProductsRoute from 'pages/products-view/products-view';
import Profiles from 'pages/products-view/user-profiles/user-profiles';
import { theme } from './styles/theme';
import GlobalStyles from './styles/global';
import AppStyled from './App.style';

const App = () => (
  <>
    <GlobalStyles />
    <ThemeProvider theme={theme}>
      <Router>
        <AppStyled>
          <Routes>
            <Route path="/" element={<Navigate to="/users" />} />
            <Route path="/products/:productId?" element={<ViewProductsRoute />} />
            <Route path="/users" element={<Profiles />} />
          </Routes>
        </AppStyled>
      </Router>
    </ThemeProvider>
  </>
);

export default App;
