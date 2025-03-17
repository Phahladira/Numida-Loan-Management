import React from "react";

type ButtonProps = {
  isPrimary: boolean;
  disabled: boolean;
  content: string;
  isFlex?: boolean;
  onSubmit?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
};

export const Button: React.FC<ButtonProps> = ({
  type = "button",
  isPrimary = true,
  disabled = false,
  content = "Submit",
  isFlex = false,
  onSubmit,
}) => {
  return (
    <button
      type={type}
      className={`${
        disabled ? "disabled-btn" : isPrimary ? "primary-btn" : "outline-btn"
      } ${isFlex && "flex"}`}
      onClick={onSubmit}>
      {content}
    </button>
  );
};
