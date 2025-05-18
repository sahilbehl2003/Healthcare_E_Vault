"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SearchFormdb = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSubmit( inputValue);
    setInputValue("");
  };

  const handleEndConversation = () => {
    router.push("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Display all the records for the Appointments.."
        className="flex-grow p-2 border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <button
        type="submit"
        className="p-3 bg-gradient-to-r from-blue-400 to-gray-600 hover:bg-blue-600 text-white font-bold rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        Send
      </button>
      <button
        type="button"
        onClick={handleEndConversation}
        className="p-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
      >
        End conversation
      </button>
    </form>
  );
};

export default SearchFormdb;
