import axios from "axios";
import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import isEmpty from "../utils/isEmpty";

export default function NewConversationModal({ show, setShowModal, user }) {
  const [friendsName, setFriendsName] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

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
      axios
        .get(`http://localhost:8000/api/user/name/${friendsName}`)
        .then((response) => {
          if (response.data) {
            handleCloseModal();
            //Friend found!
            //TODO now create a conv with the friend!
          } else {
            setAlertMsg(
              "404 friend not found. Make sure you have the the correct spelling!"
            );
          }
        })
        .catch((err) => console.log(err));
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
            <Form.Text className="text-muted">{alertMsg}</Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-dark"
          type="submit"
          onClick={handleSendMessage}
        >
          Send Message
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
