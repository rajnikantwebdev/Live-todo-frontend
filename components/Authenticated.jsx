import { Navigate } from "react-router";

const Authenticated = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") || null;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default Authenticated;
