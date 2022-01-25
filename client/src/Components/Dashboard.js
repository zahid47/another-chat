import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Container, Button } from "react-bootstrap";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const getUser = () => {
    const options = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
    };
    axios
      .get("http://localhost:8000/api/auth/current", options)
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();

    Cookies.remove("token");
    navigate("/auth");
  };

  return (
    <Container>
      <h2>Welcome {user.username}</h2>
      <Button onClick={handleLogout}>Logout</Button>
    </Container>
  );
}
