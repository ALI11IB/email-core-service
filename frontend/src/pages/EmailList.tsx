import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomDrawer from "../components/drawer";
import { fetchEmails } from "../services/api";

interface Email {
  subject: string;
  sender: string;
}

const EmailList: React.FC = () => {
  const [messages, setMessages] = useState<Email[]>([]);
  const [mailBoxDetails, setMailBox] = useState<Email[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getEmails = async () => {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await fetchEmails(headers);
      if (response?.error) {
        alert(response?.error?.message);
        if (response?.error?.code == 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      }
      if (response?.messages) {
        setMessages(response?.messages);
      }
      if (response?.mailBoxDetails) {
        setMailBox(response?.mailBoxDetails);
      }
    };

    getEmails();
  }, []);

  return <CustomDrawer />;
};

export default EmailList;
