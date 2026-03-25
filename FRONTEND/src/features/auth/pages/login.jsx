import "../auth.form.scss"
import { Link } from "react-router-dom";
const handleSubmit = (e) => {
  e.preventDefault();
}
const Login = () => {
  return (
    <main>
      <div className="form-container">
        <h1> Login</h1>
        <form onSubmit={handleSubmit} >
          <div className="input-group">
            <label htmlFor="email"></label>
            <input
              type="email"
              name="email" 
              placeholder="email " 
              />

          </div>
           <div className="input-group">
            <label htmlFor="password"></label>
            <input
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