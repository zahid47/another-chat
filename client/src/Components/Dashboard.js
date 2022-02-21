import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Container, Button } from "react-bootstrap";
import axios from "axios";
import Conversations from "./Conversations";
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
      .get("http://localhost:8000/api/user/me", options)
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getUser();

    return () => {
      setUser({});
    };
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();

    Cookies.remove("token");
    navigate("/auth");
  };

  const handleShowModal = () => setShowModal(true);

  return (
    <Container>
      <h2>Welcome {user.username}</h2>

      <Button variant="outline-dark" onClick={handleShowModal}>
        + New Conversation
      </Button>

      <Conversations user={user} />

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
