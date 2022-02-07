import React from "react";
import { Alert } from "react-bootstrap";

export default function DismissableAlert({ show, setShow, variant, text }) {
  if (show) {
    return (
      <Alert
        variant={variant || "dark"}
        onClose={() => setShow(false)}
        dismissible
      >
        {text}
      </Alert>
    );
  }
  return null;
}
