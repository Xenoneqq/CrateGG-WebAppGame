import axios from "axios";
import { useState } from "react";


function UserRegister(){
  const [email, setEmail] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handlelogin = async () => {
    try{
      const response = await axios.post('http://localhost:8080/users/register', {
        email: email,
        username: user, 
        password: password
      });
      console.log(response.data);

      let currencyRes = null;
      if(response.status == 201 && response.data != null){
        currencyRes = await axios.post('http://localhost:8080/user-currency', {
          "userID": response.data.id,
        })
      }
      console.log(currencyRes);
      
    } catch (error) {
      console.error(error);
    }
  }

  return(
    <>
    <div style={{display:"flex", flexDirection:"column", alignItems:'center', justifyContent:'center', gap:"20px"}}>

    <h2>Create an account</h2>
    <div>
      email<br/>
      <input
      value={email}
      onChange={e => (setEmail(e.target.value))}
      >
      </input>
    </div>
    <div>
      username<br/>
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

export default UserRegister;