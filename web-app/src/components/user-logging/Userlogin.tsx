import axios from "axios";
import { useState } from "react";


function UserLogin(){
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handlelogin = async () => {
    try{
      const response = await axios.post('http://localhost:8080/users/login', {
        username: user, 
        password: password
      });
      
      console.log(response.data);
      localStorage.setItem("userid", response.data.userData.id);
      localStorage.setItem("usertoken" , response.data.jwt);
    } catch (error) {
      console.error(error);
    }
  }

  return(
    <>
    <div style={{display:"flex", flexDirection:"column",alignItems:'center', justifyContent:'center', gap:"20px"}}>

    <h2>Login to your account</h2>
    <div>
      username or mail<br/>
      <input
      value={user}
      onChange={e => (setUser(e.target.value))}
      >
      </input>
    </div>
    <div>
      password<br/>
      <input
      value={password}
      type="password"
      onChange={e => (setPassword(e.target.value))}
      >
      </input>
    </div>
    <div>
      <button
      onClick={handlelogin}
      >Login</button>
    </div>

    </div>
    </>
  )
}

export default UserLogin;