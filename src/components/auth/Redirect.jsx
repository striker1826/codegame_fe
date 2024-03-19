import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://43.203.127.59:8000";
const LOCAL_URL = "http://localhost:8000";

export const Redirect = () => {
  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    const sendCode = async () => {
      const code = params.get("code");
      const res = await axios.get(`${BASE_URL}/api/auth/github?code=${code}`);
      const access_token = res.data;
      localStorage.setItem("access_token", access_token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      window.location.href = "/lobby";
    };
    sendCode();
  }, []);
};
