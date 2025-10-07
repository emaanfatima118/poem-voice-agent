import React from "react";

interface ButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  text,
  type = "button",
  className,
  onClick,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-2 px-4 rounded-lg text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition-[var(--transition)] ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
