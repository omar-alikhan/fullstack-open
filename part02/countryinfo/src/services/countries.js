import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/";

const getAll = () => {
  const req = axios.get(`${baseUrl}/api/all`);
  return req.then(res => res.data);
};

export default { getAll };
