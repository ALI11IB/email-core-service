import axios from "axios";

const instance = axios.create();

instance.interceptors.request.use(
  async (config) => {
    const accesstoken = localStorage.getItem("token");

    if (accesstoken) {
      config.headers["Authorization"] = `Bearer ${accesstoken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAuthUrl = async (provider: string): Promise<string> => {
  const response = await instance.get(`/api/auth/url`, {
    params: { provider },
  });
  return response.data.url;
};

export const fetchEmails = async (searchQuery: string): Promise<any> => {
  try {
    const response = await instance.get(
      `/api/emails/search?query=${searchQuery}`
    );
    return response?.data;
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

export const fetchMailBoxes = async (): Promise<any> => {
  try {
    const response = await instance.get(`/api/mailBoxes`);
    return response?.data;
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
