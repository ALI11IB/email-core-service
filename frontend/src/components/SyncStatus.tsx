import React, { useEffect, useState } from "react";
import { checkSyncStatus } from "../services/api";

const SyncStatus: React.FC = () => {
  const [status, setStatus] = useState<string>("Not Started");

  useEffect(() => {
    const fetchStatus = async () => {
      const currentStatus = await checkSyncStatus();
      setStatus(currentStatus);
    };

    fetchStatus();
  }, []);

  return (
    <div>
      <h2>Synchronization Status</h2>
      <p>{status}</p>
    </div>
  );
};

export default SyncStatus;
