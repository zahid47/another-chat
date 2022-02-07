import { Button, Container, Form, ButtonGroup } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import DismissableAlert from "./DismissableAlert";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [authAlertText, setAuthAlertText] = useState("");
  const [authAlertVariant, setAuthAlertVariant] = useState("dark");

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
        setAuthAlertText(
          `Hello ${response.data.username}, your registration was successful. Please Log in.`
        );
        setAuthAlertVariant("success");
        setShowAuthAlert(true);
      })
      .catch((err) => {
        setAuthAlertText(JSON.stringify(err.response.data));
        setAuthAlertVariant("danger");
        setShowAuthAlert(true);
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
        //TODO: make the error msgs better!
        setAuthAlertText(JSON.stringify(err.response.data));
        setAuthAlertVariant("danger");
        setShowAuthAlert(true);
      });
  };

  return (
    <Container
      className="align-items-center d-flex"
      style={{ height: "100vh" }}
    >
      <Form className="w-100">
        <DismissableAlert
          variant={authAlertVariant}
          text={authAlertText}
          show={showAuthAlert}
          setShow={setShowAuthAlert}
        />

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
