import { FC } from "react";

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="absolute bottom-0 left-0 w-full p-6 bg-black text-white text-center">
      <p className="text-sm">
        © {currentYear} Your Company. All Rights Reserved.
      </p>
    </footer>
  );
};
