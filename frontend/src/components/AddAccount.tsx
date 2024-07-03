import React, { useState } from "react";
import { getAuthUrl } from "../services/api";

const AddAccount: React.FC = () => {
  const [provider, setProvider] = useState<string>("outlook");
  const [authUrl, setAuthUrl] = useState<string>("");

  const handleAddAccount = async () => {
    const url = await getAuthUrl(provider);
    setAuthUrl(url);
    window.location.href = url;
  };

  return (
    <div>
      <h2>Add Account</h2>
      <select value={provider} onChange={(e) => setProvider(e.target.value)}>
        <option value="outlook">Outlook</option>
        <option value="gmail">Gmail</option>
      </select>
      <button onClick={handleAddAccount}>Link Email Account</button>
      {authUrl && <a href={authUrl}>Authenticate with {provider}</a>}
    </div>
  );
};

export default AddAccount;
