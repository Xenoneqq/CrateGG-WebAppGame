// app data
import './App.css'
import { BrowserRouter, Routes, Route, data } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import { useEffect } from 'react';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
