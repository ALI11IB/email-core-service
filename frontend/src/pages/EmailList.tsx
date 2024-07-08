import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import CustomDrawer from "../components/drawer";
import { EmailsContext } from "../context";
import { fetchEmails, fetchMailBoxes } from "../services/api";

const EmailList: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext<any>(EmailsContext);

  // const socket = io("/", {
  //   withCredentials: true,
  //   extraHeaders: {
  //     "email-socket": "abcd",
  //   },
  // });

  useEffect(() => {
    const getEmails = async () => {
      const response = await fetchEmails("");
      const response2 = await fetchMailBoxes();
      if (response?.error) {
        alert(response?.error?.message);
        if (response?.error?.code == 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }
      }
      if (response2?.error) {
        alert(response2?.error?.message);
        if (response2?.error?.code == 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }
      }
      context?.setMessages(response);
      context?.setMailBox(response2);
    };

    getEmails();
  }, []);

  // useEffect(() => {
  //   socket.on("newEmail", (newEmail) => {
  //     context?.setMessages([...context.messages, newEmail]);
  //   });

  //   return () => {
  //     socket.off("newEmail");
  //   };
  // }, []);

  return <CustomDrawer />;
};

export default EmailList;
