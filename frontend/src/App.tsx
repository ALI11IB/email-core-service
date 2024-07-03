import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AddAccount from "./components/AddAccount";
import EmailList from "./components/EmailList";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<AddAccount />} />
          {/* <Route path="/emails" element={<EmailList />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
