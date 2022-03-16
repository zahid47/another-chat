import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { serverURL } from "../config/secrets";

export default function Conversation({ conversation, userId }) {
  const [friend, setFriend] = useState("");

  useEffect(() => {
    const getFriend = () => {
      const friendId = conversation.members.filter(
        (frndId) => frndId !== userId
      )[0];

      const options = {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(`${serverURL}/api/user/id/${friendId}`, options)
        .then((response) => {
          setFriend(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    getFriend();

    return () => {
      setFriend("");
    };
  }, [conversation, userId]);

  return <div className="convo">{friend.username}</div>;
}
