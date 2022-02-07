import axios from "axios";
import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import isEmpty from "../utils/isEmpty";
//TODO handle if no convos

export default function NewConversationModal({ show, setShowModal, user }) {
  const [friendsName, setFriendsName] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const [hasConvoFlag, setHasConvoFlag] = useState(false);

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
      axios
        .get(`http://localhost:8000/api/user/name/${friendsName}`)
        .then((friendResponse) => {
          //first check if we already have a convo with this friend
          axios
            .get(`http://localhost:8000/api/chat/conversations/${user.id}`)
            .then((convoResponse) => {
              for (const convo of convoResponse.data) {
                if (convo.members.includes(friendResponse.data.id)) {
                  setHasConvoFlag(true);
                  setAlertMsg(
                    "You already have a conversation with this friend"
                  );
                  console.log("match!");
                  console.log(hasConvoFlag);
                  break;
                }
              }

              if (!hasConvoFlag) {
                //we dont already have a convo so creating a new one!
                const newConvo = {
                  senderId: user.id,
                  receiverId: friendResponse.data.id,
                };
                axios
                  .post(
                    "http://localhost:8000/api/chat/conversations",
                    newConvo
                  )
                  .then((friendResponse) => console.log("convo created!"))
                  .catch((err) => console.log(err));

                handleCloseModal();
              }
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => setAlertMsg("404 friend not found."));
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
          Start a Conversation
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
