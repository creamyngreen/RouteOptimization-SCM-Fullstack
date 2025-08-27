import axios from "../setup/axios";

export const fetchAllPermissions = async () => {
  return await axios.get(`/permissions/read`);
};

export const fetchPermissionByRole = async (roleId) => {
  return await axios.get(`/roles/${roleId}/permissions`);
};

export const assignPermissionsToRole = async (data) => {
  return axios.post(`/permissions/assign-to-role`, { data });
};
