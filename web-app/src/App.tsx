// app data
import './App.css'
import { BrowserRouter, Routes, Route, data } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './pages/Layout';
import Market from './pages/Market';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home />} />
          <Route path='/market' element={<Market/>}/>
          <Route path='/login' element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
