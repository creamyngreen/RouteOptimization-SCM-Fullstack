import axios from "../setup/axios";

export const fetchAllRoles = async () => {
  return await axios.get(`/roles/read`);
};
