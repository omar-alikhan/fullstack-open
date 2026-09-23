import axios from "axios";

const baseUrl = "/api/users";

const getBlogs = async username => {
  const response = await axios.get(`${baseUrl}/${username}`);
  return response.data[0].blogs;
};

export default { getBlogs };
