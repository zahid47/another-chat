import { Button, Container, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleOnSubmit = (e) => {
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

        <Navigate to="/" />;
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  return (
    <Container
      className="align-items-center d-flex"
      style={{ height: "100vh" }}
    >
      <Form className="mb-3" onSubmit={handleOnSubmit}>
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

        <Button type="submit">Log In</Button>

        {/* <Button variant="secondary">Create A New Account</Button> */}
      </Form>
    </Container>
  );
}
