/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/protected";
import { useAuth } from "./features/auth/Hooks/useAuth";

const Home = () => {
  const { user, handleLogout, loading } = useAuth();

  return (
    <div style={{ padding: 16 }}>
      <h1>Home Page</h1>
      <p style={{ marginTop: 8 }}>
        {user?.username ? `Hello, ${user.username}` : "You are logged in."}
      </p>
      <button onClick={handleLogout} disabled={loading}>
        Logout
      </button>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
]);