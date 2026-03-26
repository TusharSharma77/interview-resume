import "../auth.form.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../Hooks/useAuth";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, handleRegister } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await handleRegister(username, email, password);
    if (ok) navigate("/");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username"></label>
            <input
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              type="text"
              name="username"
              placeholder="username "
            />
          </div>

          <div className="input-group">
            <label htmlFor="email"></label>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              name="email"
              placeholder="email "
            />
          </div>

          <div className="input-group">
            <label htmlFor="password"></label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              name="password"
              placeholder="password "
            />
          </div>

          <button className="button primary-button">Register</button>
        </form>
        <p>
          Already Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;