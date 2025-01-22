import { useEffect, useState } from "react";
import UserLogin from "../components/user-logging/Userlogin";
import UserRegister from "../components/user-logging/Userregister";
import './Login.css'

function Login(){
  
  const [isUser, setIsUser] = useState(0);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const userParam = queryParams.get('isUser');
    setIsUser(userParam);
  }, []);
  
  const displayCorrectLogin = () => {
    if(isUser === null || isUser === undefined || isUser == 0){
      return(<>
      <UserRegister/>
      </>)
    }
    else{
      return(<>
        <UserLogin/>
        </>)
    }
  }

  const changeButton = () => {
    if(isUser === null || isUser === undefined || isUser == 0){
      return(<>
      <button onClick={changeUser} className="loginInButton">I don't have an Account!</button>
      </>)
    }
    else{
      return(<>
        <button onClick={changeUser} className="loginInButton">I Have an Account!</button>
        </>)
    }
  }

  const changeUser = () => {
    if(isUser == 0) setIsUser(1);
    else setIsUser(0);
  }

  return(
    <>
    <div style={{position:'absolute', width:'100%', height:'100%',display:'flex', flexDirection:"column", alignItems:'center', justifyContent:'center', gap:'20px'}}>
      {displayCorrectLogin()}
      {changeButton()}
    </div>
    </>
  )
}

export default Login;