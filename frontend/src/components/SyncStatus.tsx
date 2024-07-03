import React, { useEffect, useState } from "react";
import { checkSyncStatus } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

const SyncStatus: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      navigate("/emails");
    } else {
      alert("Sync failed, try again please");
      navigate("/");
    }
  }, [token]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2 style={{ color: "gray" }}>Synchronizing.....</h2>
    </div>
  );
};

export default SyncStatus;
