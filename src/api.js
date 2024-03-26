import axios from "axios";

const BASE_URL = "https://battlecode.shop";
// const BASE_URL = "http://localhost:8000";

export const postApi = async (path, data, token) => {
  const response = await axios.post(`${BASE_URL}${path}`, data, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
};

export const patchApi = async (path, data, token) => {
  const response = await axios.patch(`${BASE_URL}${path}`, data, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
};
