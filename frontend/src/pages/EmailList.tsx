import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomDrawer from "../components/drawer";
import { EmailsContext, EmailsProvider } from "../context";
import { fetchEmails } from "../services/api";
import io from "socket.io-client";

const EmailList: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext<any>(EmailsContext);

  // const socket = io("http://localhost:3000");
  const socket = io("http://localhost:3000", {
    withCredentials: true,
    extraHeaders: {
      "email-socket": "abcd",
    },
  });

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
        context?.setMessages(response?.messages);
      }
      if (response?.mailBoxDetails) {
        context?.setMailBox(response?.mailBoxDetails);
      }
    };

    getEmails();
  }, []);

  useEffect(() => {
    socket.on("newEmail", (newEmail) => {
      context?.setMessages([...context.messages, newEmail]);
    });

    return () => {
      socket.off("newEmail");
    };
  }, []);

  return <CustomDrawer />;
};

export default EmailList;
