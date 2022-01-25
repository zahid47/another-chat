import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { Container } from "react-bootstrap";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get("token")) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <>
      <Container>
        <h3 style={{ textAlign: "center" }}>welcome to another-chat</h3>
      </Container>
      <Outlet />
    </>
  );
}

export default App;
