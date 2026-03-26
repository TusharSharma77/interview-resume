import "../auth.form.scss"
import { useAuth } from "../Hooks/useAuth";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const{loading,handleLogin} = useAuth();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await handleLogin(email, password);
    if (ok) navigate("/");
  };
  if(loading){
    return <div>Loading...</div>
  }

  return (
    <main>
      <div className="form-container">
        <h1> Login</h1>
        <form onSubmit={handleSubmit} >
          <div className="input-group">
            <label htmlFor="email"></label>
            <input
            onChange={(e)=>{setEmail(e.target.value)}}
              type="email"
              name="email" 
              placeholder="email " 
              />

          </div>
           <div className="input-group">
            <label htmlFor="password"></label>
            <input
            onChange={(e)=>{setPassword(e.target.value)}} 
              type="password"
              name="password" 
              placeholder="password " 
              />
              
          </div>
          <button className="button primary-button">Login</button>
        </form>
         <p> Don't Have an account? <Link to="/register">Register</Link> </p>
      </div>
    </main>
  );
};

export default Login;