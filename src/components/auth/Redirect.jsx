import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://battlecode.shop";
const LOCAL_URL = "http://localhost:8000";

export const Redirect = () => {
  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    const sendCode = async () => {
      const code = params.get("code");
      try {
        const res = await axios.get(`${BASE_URL}/api/auth/github?code=${code}`);

        const access_token = res.data;
        localStorage.setItem("access_token", access_token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        window.location.href = "/lobby";
      } catch (err) {
        const status = err.response.status;
        if (status === 429) {
          alert("너무 많은 요청을 한꺼번에 보냈습니다. 잠시 후 다시 시도해주세요.");
        }
      }
    };
    sendCode();
  }, []);
};
