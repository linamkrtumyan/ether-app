import React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "primary",
  className,
  disabled = false,
}) => {
  const primaryStyle =
    "w-full bg-gradient-to-r from-violet-500 to-rose-300 text-white font-semibold py-2 px-4 rounded transform transition-all duration-300 ease-in-out hover:opacity-70";
  const secondaryStyle =
    "w-full bg-violet-400 text-white border-2 border-violet-500 py-2 px-4 rounded transform transition-all duration-300 ease-in-out hover:bg-violet-500 hover:text-white hover:border-transparent";

  const disabledStyle =
    "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50";

  const buttonStyle =
    type === "primary"
      ? `${primaryStyle} ${disabled ? disabledStyle : ""}`
      : `${secondaryStyle} ${disabled ? disabledStyle : ""}`;

  return (
    <button
      onClick={onClick}
      className={`${buttonStyle} ${className}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
