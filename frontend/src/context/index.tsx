import React, { createContext, useState } from "react";
import { EmailMessage, MailBoxDetails } from "../types";

export const EmailsContext = createContext<any>(null);

export const EmailsProvider = ({ children }: any) => {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [mailBoxDetails, setMailBox] = useState<MailBoxDetails[]>([]);
  const [selectedMailBox, setSelectedMailBox] = useState<string | undefined>(
    undefined
  );

  return (
    <EmailsContext.Provider
      value={{
        messages,
        setMessages,
        mailBoxDetails,
        setMailBox,
        selectedMailBox,
        setSelectedMailBox,
      }}
    >
      {children}
    </EmailsContext.Provider>
  );
};
