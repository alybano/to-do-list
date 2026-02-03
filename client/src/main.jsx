import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import ListItem from './pages/ListItem.jsx'
import Register from './pages/Register.jsx'
import Header from './components/Header.jsx'
import './css/globals.css'

import {
  BrowserRouter, Routes, Route, 
} from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> 
        <Route path="/home" element={<Home />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/list-item" element={<ListItem />} /> 
        <Route path="/header" element={<Header />} /> 
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
