import { Outlet, Link, useSearchParams } from "react-router-dom";
import './Layout.css'
import axios from "axios";
import { useEffect, useState } from "react";

const Layout = () => {
  
  const [currency, setCurrency] = useState(0);

  const loadCurrencyData = async () => {
    const loggedUser = localStorage.getItem("userid");
    if(loggedUser != null){
      try{
      const response = await axios.get(`http://localhost:8080/user-currency/${loggedUser}`);
      if(response.status == 201 && response.data != null)
        setCurrency(response.data.currency);
      } catch (error) {
        console.error(error);
      }
    }
    else{
      console.log("no user is logged in.")
    }
  }

  useEffect(() => {
    loadCurrencyData();
  },[])

  return (
    <>
      <nav className="appNavBar">
        <div>
          <Link to="/" className="logo">
          Crate.GG</Link>
        </div>
        <div>
          <Link to="/storage" className="navlink">
          storage</Link>
        </div>
        <div>
          <Link to="/market" className="navlink">
          market</Link>
        </div>
        <div className="currency">
          {currency} CC
        </div>
      </nav>
      <div className="navBarFiller"></div>
      
      <Outlet />
    </>
  )
};

export default Layout;