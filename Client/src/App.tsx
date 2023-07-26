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
import DeliveryLocations from './Modules/DeliveryLocations/DeliveryLocations';
import AddDeliveryLocation from './Modules/DeliveryLocations/AddDeliveryLocation';
import EditDeliveryLocation from './Modules/DeliveryLocations/EditDeliveryLocation';
import ProductDelivery from './Modules/ProductDelivery/ProductDelivery';
import AddProductDelivery from './Modules/ProductDelivery/AddProductDelivery';
import EditProductDelivery from './Modules/ProductDelivery/EditProductDelivery';
import DeliveryZones from './Modules/DeliveryZones/DeliveryZones';
import AddDeliveryZone from './Modules/DeliveryZones/AddDeliveryZone';
import EditDeliveryZone from './Modules/DeliveryZones/EditDeliveryZone';
import Providers from './Modules/Providers/Providers';
import AddProvider from './Modules/Providers/AddProvider';
import EditProvider from './Modules/Providers/EditProvider';
import Logs from './Modules/Logs';


function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <Routes>
        <Route path="login" element={<LogIn />} />
        <Route path="register" element={<Register />} />
        <Route path='' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='usuarios' element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path='logs' element={<ProtectedRoute><Logs /></ProtectedRoute>} />

        <Route path='productos' element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path='productos/crear' element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
        <Route path='productos/:productId' element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />

        <Route path='lugaresentrega' element={<ProtectedRoute><DeliveryLocations /></ProtectedRoute>} />
        <Route path='lugaresentrega/crear' element={<ProtectedRoute><AddDeliveryLocation /></ProtectedRoute>} />
        <Route path='lugaresentrega/:deliveryLocationId' element={<ProtectedRoute><EditDeliveryLocation /></ProtectedRoute>} />

        <Route path='zonasentrega' element={<ProtectedRoute><DeliveryZones /></ProtectedRoute>} />
        <Route path='zonasentrega/crear' element={<ProtectedRoute><AddDeliveryZone /></ProtectedRoute>} />
        <Route path='zonasentrega/:deliveryZoneId' element={<ProtectedRoute><EditDeliveryZone /></ProtectedRoute>} />

        <Route path='entregaproducto' element={<ProtectedRoute><ProductDelivery /></ProtectedRoute>} />
        <Route path='entregaproducto/crear' element={<ProtectedRoute><AddProductDelivery /></ProtectedRoute>} />
        <Route path='entregaproducto/:productDeliveryId' element={<ProtectedRoute><EditProductDelivery /></ProtectedRoute>} />

        <Route path='proveedores' element={<ProtectedRoute><Providers /></ProtectedRoute>} />
        <Route path='proveedores/crear' element={<ProtectedRoute><AddProvider /></ProtectedRoute>} />
        <Route path='proveedores/:providerId' element={<ProtectedRoute><EditProvider /></ProtectedRoute>} />

        <Route path="*" element={<p>No encontramos lo que buscas:(</p>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;