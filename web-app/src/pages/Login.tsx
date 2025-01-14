import UserLogin from "../components/user-logging/Userlogin";
import UserRegister from "../components/user-logging/Userregister";

function Login(){
  return(
    <>
    <div style={{display:'flex', flexDirection:"row", alignItems:'center', justifyContent:'center' ,gap:'100px'}}>
      <UserLogin/>
      <UserRegister/>
    </div>
    </>
  )
}

export default Login;