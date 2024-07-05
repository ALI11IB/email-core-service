import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export const getAuthUrl = async (provider: string): Promise<string> => {
  const response = await axios.get(`${API_BASE_URL}/auth/url`, {
    params: { provider },
  });
  return response.data.url;
};

export const checkSyncStatus = async (): Promise<string> => {
  const response = await axios.get(`${API_BASE_URL}/sync/status`);
  return response.data.status;
};

export const fetchEmails = async (headers: any): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/emails`, { headers });
    return {
      messages: response?.data?.messages,
      mailBoxDetails: response?.data?.mailBoxDetails,
    };
  } catch (error: any) {
    if (error?.response && error?.response?.status === 401) {
      return {
        error: {
          code: error?.response?.status,
          message: "Unauthorized - Token may be invalid or expired",
        },
      };
    } else {
      return {
        error: {
          code: error?.response?.status,
          message: "Error fetching data:",
        },
      };
    }
  }
};
