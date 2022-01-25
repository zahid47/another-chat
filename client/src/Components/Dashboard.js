import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Container, Button } from "react-bootstrap";

export default function Dashboard({ user }) {
  const handleLogout = (e) => {
    e.preventDefault();

    Cookies.remove("token");

    <Navigate to="/" />;
  };

  return (
    <Container>
      <h2>Welcome {user.username}</h2>
      <Button onClick={handleLogout}>Logout</Button>
    </Container>
  );
}
