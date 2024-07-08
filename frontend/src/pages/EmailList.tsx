import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import CustomDrawer from "../components/drawer";
import { EmailsContext } from "../context";
import { fetchEmails, fetchMailBoxes } from "../services/api";
import { socket } from "../App";

const EmailList: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext<any>(EmailsContext);
  socket.on("synced", (context) => {
    setTimeout(() => {
      getEmails();
    }, 1000);
  });
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
  useEffect(() => {
    getEmails();
  }, []);

  return <CustomDrawer />;
};

export default EmailList;
