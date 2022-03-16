import { Button, Container, Form, ButtonGroup } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";
import { serverURL } from "../config/secrets";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const newUser = {
      username: username,
      password: password,
    };

    axios
      .post(`${serverURL}/api/auth/register`, newUser)
      .then(() => {
        handleLogin(e);
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const newUser = {
      username: username,
      password: password,
    };

    axios
      .post(`${serverURL}/api/auth/login`, newUser)
      .then((response) => {
        Cookies.set("token", response.data.token, {
          expires: 1,
        });

        navigate("/dashboard");
      })
      .catch((err) => {
        setErrors(err.response.data);
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
            className={classnames({ "is-invalid": errors.username })}
            type="text"
            placeholder="Enter username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></Form.Control>
          <Form.Text className="text-danger">{errors.username}</Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            className={classnames({ "is-invalid": errors.password })}
            type="password"
            placeholder="Enter password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Form.Control>
          <Form.Text className="text-danger">{errors.password}</Form.Text>
        </Form.Group>

        <hr style={{ opacity: 0 }}></hr>

        <ButtonGroup aria-label="Basic example">
          <Button variant="outline-dark" onClick={handleLogin}>
            Log In
          </Button>
          <Button variant="outline-dark" onClick={handleRegister}>
            Register
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
}
