import axios from "axios";
import { useEffect, useState } from "react";
import './UserStorage.css'

function UserStorage(){
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    // Pobierz userID z URL lub z localStorage
    const queryParams = new URLSearchParams(window.location.search);
    const userID = queryParams.get('userID') || localStorage.getItem('userid');
  
    if (!userID) {
      console.error('User ID not provided');
      return;
    }
  
    try {
      // Wysyłanie zapytania do API
      const response = await axios.get(`http://localhost:8080/users/${userID}`);
      setUser(response.data); // Ustaw dane użytkownika
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  useEffect(() => {
    fetchUser();
  },[])

  const displayUser = () => {
    if(user === undefined || user === null) return(<></>);
    return(
      <>
      <div className="ownersPageName">
      {user.username} Storage
      </div>
      </>
    )
  }

  return(
    <>
    <div className="ProfileBox">
      {displayUser()}
    </div>
    </>
  )
}

export default UserStorage;