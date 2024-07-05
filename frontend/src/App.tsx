import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AddAccount from "./pages/AddAccount";
import EmailList from "./pages/EmailList";
import SyncStatus from "./pages/SyncStatus";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<AddAccount />} />
          <Route path="/sync" element={<SyncStatus />} />
          <Route path="/emails" element={<EmailList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
