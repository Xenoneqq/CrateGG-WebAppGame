import axios from "axios";
import { useState } from "react";

function Login(){
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const apiCall = () => {
    axios.get('http://localhost:8080').then((data) => {
      //this console.log will be in our frontend console
      console.log(data)
    })
  }

  return(
    <>
    <div style={{display:"flex", flexDirection:"column", gap:"20px"}}>

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
      onClick={apiCall}
      >Login</button>
    </div>

    </div>
    </>
  )
}

export default Login;