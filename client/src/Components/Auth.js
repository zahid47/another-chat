import { Button, Container, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const newUser = {
      username: username,
      password: password,
    };

    axios
      .post("http://localhost:8000/api/auth/register", newUser)
      .then((response) => {
        alert("Registration Successful, Please Log In");
      })
      .catch((err) => {
        alert(JSON.stringify(err.response.data));
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const newUser = {
      username: username,
      password: password,
    };

    axios
      .post("http://localhost:8000/api/auth/login", newUser)
      .then((response) => {
        Cookies.set("token", response.data.token, {
          expires: 1,
        });

        navigate("/dashboard");
      })
      .catch((err) => {
        alert(JSON.stringify(err.response.data));
      });
  };

  return (
    <Container
      className="align-items-center d-flex"
      style={{ height: "100vh" }}
    >
      <Form className="w-100">
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Button onClick={handleLogin}>Log In</Button>
        <Button variant="secondary" onClick={handleRegister}>
          Register
        </Button>
      </Form>
    </Container>
  );
}
