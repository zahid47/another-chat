import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { serverURL } from "../config/baseURL";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

export default function Message({ message }) {
  const [friendName, setFriendName] = useState(null);

  useEffect(() => {
    const getFriendName = () => {
      const options = {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(`${serverURL}/api/user/id/${message.senderId}`, options)
        .then((response) => {
          setFriendName(response.data.username);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getFriendName();
  }, [message.senderId]);
  return (
    <div>
      <div className="senderName">{friendName}</div>
      <div className="textMsg">{message.text}</div>
      <div className="timeAgo">
        {timeAgo.format(new Date(message.updatedAt))}
      </div>
    </div>
  );
}
