// app data
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './pages/Layout';
import Market from './pages/Market';
import Storage  from './pages/Storage';
import Trades from './pages/Trades';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home />} />
          <Route path='/market' element={<Market/>}/>
          <Route path='/login' element={<Login />} />
          <Route path='/storage' element={<Storage/>} />
          <Route path='/trades' element={<Trades/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
