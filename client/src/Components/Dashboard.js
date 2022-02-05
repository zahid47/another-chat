import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Container, Button, Modal } from "react-bootstrap";
import axios from "axios";
import Conversation from "./Conversations";
import NewConversationModal from "./NewConversationModal";

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
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
    setUser({});
    navigate("/auth");
  };

  const handleShowModal = () => setShowModal(true);

  return (
    <Container>
      <h2>Welcome {user.username}</h2>

      <Button variant="outline-dark" onClick={handleShowModal}>
        + New Conversation
      </Button>

      <Conversation user={user} />

      <hr></hr>

      <Button variant="outline-danger" onClick={handleLogout}>
        Logout
      </Button>

      <NewConversationModal
        show={showModal}
        setShowModal={setShowModal}
        user={user}
      />
    </Container>
  );
}
