import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SyncStatus: React.FC = () => {
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const navigate = useNavigate();
  const query = useQuery();

  useEffect(() => {
    const token = query.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/emails");
    } else {
      alert("Sync failed, try again please");
      navigate("/");
    }
  }, [query]);

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
