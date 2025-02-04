import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div className="w-full h-auto p-10">
      <h1 className="text-xl font-semibold">
        Quizlytic – Where Knowledge Meets Challenge! 🚀
      </h1>
      <p>&copy; {year} Subhendu Kumar</p>
    </div>
  );
};

export default Footer;
