import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AddAccount from "./pages/AddAccount";
import EmailList from "./pages/EmailList";
import SyncStatus from "./pages/SyncStatus";
import { EmailsProvider } from "./context";

const App: React.FC = () => {
  return (
    <EmailsProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<AddAccount />} />
            <Route path="/sync" element={<SyncStatus />} />
            <Route path="/emails" element={<EmailList />} />
          </Routes>
        </div>
      </Router>
    </EmailsProvider>
  );
};

export default App;
