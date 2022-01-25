import axios from "axios";
import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();

    setError("");
    setFeedback("");

    const newUser = {
      username: username,
      password: password,
    };

    axios
      .post("http://localhost:8000/api/auth/register", newUser)
      .then((response) => {
        setFeedback("Registration Successful");
      })
      .catch((err) => {
        console.error(setError(err.response.data));
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
            placeholder="Enter a unique username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter a password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        {feedback ? <p>{JSON.stringify(feedback)}</p> : null}
        {error ? <p>{JSON.stringify(error)}</p> : null}

        <Button type="submit">Register</Button>

        {/* <Button variant="secondary">Already Have An Account?</Button> */}
      </Form>
    </Container>
  );
}
