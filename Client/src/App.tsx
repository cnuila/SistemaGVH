import React from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import { Route, Routes } from 'react-router-dom';
import LogIn from "./Auth/LogIn";
import AuthProvider from './Auth/AuthContext';
import Register from './Auth/Register';
import ProtectedRoute from './Auth/ProtectedRoute';
import Home from './Modules/Home';
import Users from './Modules/Users';
import Products from './Modules/Products/Products';
import AddProduct from './Modules/Products/AddProduct';
import EditProduct from './Modules/Products/EditProduct';

function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <Routes>
        <Route path="login" element={<LogIn />} />
        <Route path="register" element={<Register />} />
        <Route path='' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='usuarios' element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path='productos' element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path='productos/crear' element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
        <Route path='productos/:productId' element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
        <Route path="*" element={<p>No encontramos lo que buscas:(</p>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;