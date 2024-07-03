import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Email {
  subject: string;
  sender: string;
}

const Sync: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [emails, setEmails] = useState<Email[]>([]);

  useEffect(() => {
    const fetchEmails = async () => {
      const response = await axios.get(`/api/emails?userId=${userId}`);
      setEmails(response.data);
    };

    fetchEmails();
  }, [userId]);

  return (
    <div>
      <h1>Synchronized Emails</h1>
      <ul>
        {emails.map((email, index) => (
          <li key={index}>
            <strong>{email.subject}</strong> - {email.sender}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sync;
