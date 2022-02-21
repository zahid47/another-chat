import axios from "axios";
import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import isEmpty from "../utils/isEmpty";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
//TODO handle if no convos

export default function NewConversationModal({ show, setShowModal, user }) {
  const [friendsName, setFriendsName] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const navigate = useNavigate();

  const handleCloseModal = () => {
    setAlertMsg("");
    setFriendsName("");
    setShowModal(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (isEmpty(friendsName)) {
      setAlertMsg("Friends name can't be empty");
    } else if (friendsName === user.username) {
      setAlertMsg("You can't send message to yourself!");
    } else {
      //finding the friend
      const options = {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      };
      axios
        .get(`http://localhost:8000/api/user/name/${friendsName}`, options)
        // friend found!
        .then((friendResponse) => {
          //try to create a convo with this friend
          const newConvo = {
            senderId: user.id,
            receiverId: friendResponse.data.id,
          };
          axios
            .post("http://localhost:8000/api/chat", newConvo, options)
            .then(() => {
              handleCloseModal();
              navigate("/"); //reload the page to upate new convos (hacky solution, try to make it better later)
            })
            .catch((err) => setAlertMsg(err.response.data.error));
        })

        .catch(() => setAlertMsg("404 friend not found."));
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          New Conversation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Friend's Name</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your friends username"
              onChange={(e) => {
                setFriendsName(e.target.value);
              }}
            />
            <Form.Text className="text-danger">{alertMsg}</Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-dark"
          type="submit"
          onClick={handleSendMessage}
        >
          Start a Conversation
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
