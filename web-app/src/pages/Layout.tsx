import { Outlet, Link, useSearchParams } from "react-router-dom";
import './Layout.css'
import axios from "axios";
import { useEffect, useState } from "react";

const Layout = () => {
  
  const [currency, setCurrency] = useState(0);
  const [user, setUser] = useState(null);

  const loadCurrencyData = async () => {
    const loggedUser = localStorage.getItem("userid");
    if(loggedUser != null){
      try{
      const response = await axios.get(`http://localhost:8080/user-currency/${loggedUser}`);
      if(response.status == 200 && response.data != null)
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

  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency);
  };

  const isLoggedIn = async () => {
    const token = localStorage.getItem('usertoken'); // Pobierz token z localStorage
    let response;
    try {
      response = await axios.get('http://localhost:8080/users/verifyUser', {
        headers: {
          Authorization: `Bearer ${token}`, // Przekaż token w nagłówku
        },
      });
  
      console.log('User verified:', response.data.user);
      setUser(response.data.user.username);
    } catch (error) {
      console.error(error);
      return null;
    }
    return response.data.user;
  };
  isLoggedIn();

  const logOutUser = () => {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("userid");
    bringToLoginSite();
  }

  const bringToLoginSite = () => {
    window.location.href = '/login?isUser=1'
  }

  const displayUserInfo = () => {
    if(user === null || user === undefined){
      return(
        <>
        <div>
          <button onClick={bringToLoginSite} className="userLoginButton">LOG IN</button>
        </div>
        <div className="accountOwner">GUEST</div>
        <div>•</div>
        </>
      )
    }
    return(
      <>
      <div>
        <button onClick={logOutUser} className="userLoginButton">LOG OUT</button>
      </div>
      <div className="accountOwner">{user}</div>
      <div>•</div>
      </>
    )
  }

  return (
    <>
      <nav className="appNavBar">
        <div>
          <Link to="/" className="logo">
          Crate.GG</Link>
        </div>

        {displayUserInfo()}

        <div>
          <Link to="/storage" className="navlink">
          storage</Link>
        </div>
        <div>
          <Link to="/market" className="navlink">
          market</Link>
        </div>

        <div className="currency navbarLeft">
          {currency} CC
        </div>
        <div className="currency navbarRight">
          <div>
          {currency} CC
          </div>
        </div>
      </nav>
      <div className="navBarFiller"></div>
      
      <Outlet context={{updateCurrency}}/>
    </>
  )
};

export default Layout;