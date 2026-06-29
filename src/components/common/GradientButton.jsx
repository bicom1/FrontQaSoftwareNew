import React from "react";
import { Button } from "react-bootstrap";

export const GRADIENT_BTN_STYLE = {
  background: "linear-gradient(90deg, #4CAF50, #2196F3)",
  border: "none",
  borderRadius: "0.5rem",
  color: "#fff",
};

export const GRADIENT_HEADER_STYLE = {
  background: "linear-gradient(90deg, #4CAF50, #2196F3)",
  borderRadius: "0.5rem 0.5rem 0 0",
  fontSize: "23px",
};

const GradientButton = ({
  children,
  className = "",
  size,
  as,
  to,
  onClick,
  type,
  disabled,
}) => (
  <Button
    as={as}
    to={to}
    type={type}
    size={size}
    onClick={onClick}
    disabled={disabled}
    className={`text-white border-0 ${className}`}
    style={GRADIENT_BTN_STYLE}
  >
    {children}
  </Button>
);

export default GradientButton;
