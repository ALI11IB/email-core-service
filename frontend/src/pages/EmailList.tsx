import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomDrawer from "../components/drawer";
import { EmailsContext, EmailsProvider } from "../context";
import { fetchEmails } from "../services/api";
import io from "socket.io-client";

const EmailList: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext<any>(EmailsContext);

  const socket = io("http://localhost:3000");

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

// import { useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3000');

// const EmailComponent = () => {
//   useEffect(() => {
//     socket.on('newEmail', (email) => {
//       console.log('New email received:', email);
//       // Update your state or UI to display the new email
//     });

//     return () => {
//       socket.off('newEmail');
//     };
//   }, []);

//   return <div>{/* Your email display logic */}</div>;
// };

// export default EmailComponent;
