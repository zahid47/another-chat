import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Conversation({ conversation, user }) {
  const [friend, setFriend] = useState("friend");

  const getFriend = () => {
    const friendId = conversation.members.filter(
      (frndId) => frndId !== user.id
    )[0];

    axios
      .get(`http://localhost:8000/api/user/${friendId}`)
      .then((response) => {
        setFriend(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getFriend();
  });

  return <div>{friend.username}</div>;
}
