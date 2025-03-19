import axios from "axios";

//with cedentials is true because of sending access token t the backend server
export const makeRequest = axios.create({
  baseURL: "http://localhost:8800/api/",
  withCredentials: true,
});
