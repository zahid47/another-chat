import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import isEmpty from "./utils/isEmpty";

import Register from "./Components/Register";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";

function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    if (Cookies.get("token")) {
      getUser();
    }
  }, [user]);

  const getUser = () => {
    const options = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
    };
    axios
      .get("http://localhost:8000/api/auth/current", options)
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      {isEmpty(user) ? <Navigate to="/login" /> : <Navigate to="/dashboard" />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
      </Routes>
    </>
  );
}

export default App;

//TODO: WHY REDIRECT SLOW???!!! :(
