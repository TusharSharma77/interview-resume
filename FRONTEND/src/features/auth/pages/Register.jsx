import "../auth.form.scss"
import { Link } from "react-router-dom";
const handleSubmit = (e) => {
  e.preventDefault();
}
const Register = () => {
  return (
    <>
   <main>
      <div className="form-container">
        <h1> Register</h1>
        <form onSubmit={handleSubmit} >

             <div className="input-group">
            <label htmlFor="username"></label>
            <input
              type="text"
              name="username" 
              placeholder="username " 
              />

          </div>
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
          <button className="button primary-button">Register</button>
        </form>
        <p> Already Have an account? <Link to="/login">Login</Link> </p>
      </div>
    </main>
    </>
  );
};

export default Register;