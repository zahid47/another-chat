import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Container, Button, Form } from "react-bootstrap";
import axios from "axios";
import NewConversationModal from "./NewConversationModal";
import Conversation from "./Conversation";
import Message from "./Message";
import isEmpty from "../utils/isEmpty";
import { io } from "socket.io-client";

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const [text, setText] = useState("");
  const [noTextError, setNoTextError] = useState("");

  const scrollRef = useRef();
  const socket = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");

    socket.current.on("getMsg", (data) => {
      setArrivalMessage({
        senderId: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentConversation?.members.includes(arrivalMessage.senderId) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentConversation]);

  //send current userId to the socket server
  useEffect(() => {
    socket.current.emit("addMe", user.id);
    socket.current.on("getUsers", (users) => {
      console.log(users);
    });
  }, [user]);

  useEffect(() => {
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

    const getConvos = () => {
      const options = {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      };
      axios
        .get(`http://localhost:8000/api/chat`, options)
        .then((res) => setConversations(res.data))
        .catch((err) => console.log(err));
    };

    getUser();
    getConvos();

    return () => {
      setUser({});
    };
  }, []);

  useEffect(() => {
    const getMsgs = () => {
      const options = {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      };
      axios
        .get(
          `http://localhost:8000/api/message/${currentConversation?._id}`,
          options
        )
        .then((res) => setMessages(res.data))
        .catch((err) => console.log(err));
    };
    if (currentConversation) getMsgs();
  }, [currentConversation]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogout = (e) => {
    e.preventDefault();

    Cookies.remove("token");
    navigate("/auth");
  };

  const handleSendMsg = (e) => {
    e.preventDefault();

    if (isEmpty(text)) {
      setNoTextError("Message cannot be empty!");
      setText("");
    } else {
      const friendId = currentConversation.members.find(
        (member) => member !== user.id
      );

      socket.current.emit("sendMsg", {
        senderId: user.id,
        receiverId: friendId,
        text: text,
      });

      const options = {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      };

      const newText = {
        chatId: currentConversation._id,
        senderId: user.id,
        text: text,
      };

      axios
        .post(`http://localhost:8000/api/message`, newText, options)
        .then((response) => {
          setMessages([...messages, response.data]);
          setText("");
        })
        .catch((err) => {
          console.error(err.response.data);
        });
    }
  };

  const handleShowModal = () => setShowModal(true);

  return (
    <Container className="chat">
      <div className="conversationsTab">
        <div className="conversationsWrapper">
          <Button variant="outline-dark" onClick={handleShowModal}>
            + New Conversation
          </Button>
          {conversations.length > 0 ? (
            conversations.map((convo) => (
              <div
                key={convo._id}
                onClick={() => setCurrentConversation(convo)}
              >
                <Conversation conversation={convo} userId={user.id} />
              </div>
            ))
          ) : (
            <p>You don't have any conversations yet. Why not start one now?</p>
          )}
          <hr></hr>
          <p>
            Signed in as: <strong>{user.username}</strong>
          </p>
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
      <div className="messagesTab">
        <div className="messagesWrapper">
          {currentConversation ? (
            <>
              <div className="texts">
                {messages.map((msg) => (
                  <div key={msg.id} ref={scrollRef}>
                    <Message message={msg} />
                    <br />
                  </div>
                ))}
              </div>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control
                    onChange={(e) => {
                      setText(e.target.value);
                    }}
                    type="text"
                    placeholder="Type Something..."
                    value={text}
                  />
                  <Form.Text className="text-danger">{noTextError}</Form.Text>
                </Form.Group>
                <Button
                  onClick={handleSendMsg}
                  variant="outline-dark"
                  type="submit"
                >
                  Send
                </Button>
              </Form>
            </>
          ) : (
            <span>Click on a conversation to see messges.</span>
          )}
        </div>
      </div>

      <NewConversationModal
        show={showModal}
        setShowModal={setShowModal}
        user={user}
      />
    </Container>
  );
}
