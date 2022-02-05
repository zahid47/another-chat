import React, { useState, useEffect } from "react";
import axios from "axios";
import Conversation from "./Conversation";

export default function Conversations({ user }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/chat/conversations/${user.id}`)
      .then((res) => setConversations(res.data))
      .catch((err) => console.log(err));
  }, [conversations, user.id]);

  return (
    <>
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation.id}>
            <Conversation conversation={conversation} user={user} />
          </li>
        ))}
      </ul>
    </>
  );
}
