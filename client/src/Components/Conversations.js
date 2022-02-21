import React, { useState, useEffect } from "react";
import axios from "axios";
import Conversation from "./Conversation";
import Cookies from "js-cookie";

export default function Conversations({ user }) {
  const [conversations, setConversations] = useState([]);

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

  useEffect(() => {
    getConvos();

    return () => {
      setConversations([]);
    };
  }, []);

  return (
    <>
      {conversations.length > 0 ? (
        <ul>
          {conversations.map((conversation) => (
            <li key={conversation._id}>
              <Conversation conversation={conversation} userId={user.id} />
            </li>
          ))}
        </ul>
      ) : (
        <p>You don't have any conversations. Why not start a new one?</p>
      )}
    </>
  );
}
