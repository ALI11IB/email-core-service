import React, { createContext, useState } from "react";
import { EmailMessage, MailBoxDetails } from "../types";

export const EmailsContext = createContext<any>(null);

export const EmailsProvider = ({ children }: any) => {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [mailBoxDetails, setMailBox] = useState<MailBoxDetails[]>([]);

  return (
    <EmailsContext.Provider
      value={{ messages, setMessages, mailBoxDetails, setMailBox }}
    >
      {children}
    </EmailsContext.Provider>
  );
};
