import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEmails } from "../services/api";

interface Email {
  subject: string;
  sender: string;
}

const Sync: React.FC = () => {
  const [messages, setMessages] = useState<Email[]>([]);
  const [mailBoxDetails, setMailBox] = useState<Email[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmails;
  }, []);

  useEffect(() => {
    const getEmails = async () => {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await fetchEmails(headers);
      if (response?.error) {
        alert(response?.error);
        localStorage.removeItem("token");
        navigate("/");
      }
      setMessages(response?.messages);
      setMailBox(response?.mailBoxDetails);
    };

    getEmails();
  }, []);

  return (
    <div>
      <h1>Synchronized Emails</h1>
      <ul></ul>
    </div>
  );
};

export default Sync;
