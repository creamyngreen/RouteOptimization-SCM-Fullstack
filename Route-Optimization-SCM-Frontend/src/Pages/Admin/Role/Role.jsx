import { useEffect, useState } from "react";
import { notification, Select } from "antd";
import { fetchAllRoles } from "../../../services/userServices";
import {
  fetchAllPermissions,
  fetchPermissionByRole,
  assignPermissionsToRole,
} from "../../../services/permissionServices";
import _ from "lodash";

const RolePermission = () => {
  const [userRoles, setUserRoles] = useState([]);
  const [selectRole, setSelectRole] = useState("");
  const [listPermissions, setListPermissions] = useState([]);
  const [assignPermissionByRole, setAssignPermissionByRole] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRoles();
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      let response = await fetchAllPermissions();
      if (response && +response.EC === 1) {
        setListPermissions(response.DT);
      } else {
        notification.error({
          message: "Error",
          description: response.EM || "Failed to fetch permissions",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to fetch permissions",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoles = async () => {
    try {
      setLoading(true);
      let response = await fetchAllRoles();
      if (response && +response.EC === 1) {
        setUserRoles(response.DT);
      } else {
        notification.error({
          message: "Error",
          description: response.EM || "Failed to fetch roles",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to fetch roles",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOnChangePermission = async (value) => {
    setSelectRole(value);
    if (value) {
      try {
        setLoading(true);
        let response = await fetchPermissionByRole(value);
        if (response && +response.EC === 1) {
          let data = buildDataPermissionByRole(
            response.DT.Permissions,
            listPermissions
          );
          setAssignPermissionByRole(data);
        } else {
          notification.error({
            message: "Error",
            description: response.EM || "Failed to fetch role permissions",
          });
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: error.message || "Failed to fetch role permissions",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const buildDataPermissionByRole = (rolePermission, allPermissions) => {
    let result = [];
    if (allPermissions && allPermissions.length > 0) {
      allPermissions.map((permission) => {
        let obj = {};
        obj.url = permission.url;
        obj.id = permission.id;
        obj.description = permission.description;
        obj.isAssigned = false;
        if (rolePermission && rolePermission.length > 0) {
          obj.isAssigned = rolePermission.some((item) => item.url === obj.url);
        }
        result.push(obj);
      });
    }
    return result;
  };

  const handleSelectPermission = (value) => {
    const _assignPermissionByRole = _.cloneDeep(assignPermissionByRole);
    let foundIndex = _assignPermissionByRole.findIndex(
      (item) => +item.id === +value
    );
    if (foundIndex > -1) {
      _assignPermissionByRole[foundIndex].isAssigned =
        !_assignPermissionByRole[foundIndex].isAssigned;
    }
    setAssignPermissionByRole(_assignPermissionByRole);
  };

  const buildDataToSave = () => {
    let result = {};
    const _assignPermissionByRole = _.cloneDeep(assignPermissionByRole);
    result.roleId = selectRole;
    let rolePermissions = _assignPermissionByRole.filter((item) => {
      return item.isAssigned === true;
    });

    let finalRolePermissions = rolePermissions.map((item) => {
      let final = { roleId: +selectRole, permissionId: +item.id };
      return final;
    });
    result.rolePermissions = finalRolePermissions;
    return result;
  };

  const handleSave = async () => {
    if (!selectRole) {
      notification.warning({
        message: "Warning",
        description: "Please select a role first",
      });
      return;
    }

    try {
      setLoading(true);
      let data = buildDataToSave();
      let response = await assignPermissionsToRole(data);
      if (response && +response.EC === 1) {
        notification.success({
          message: "Success",
          description: response.EM || "Permissions updated successfully",
        });
      } else {
        notification.error({
          message: "Error",
          description: response.EM || "Failed to update permissions",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to update permissions",
      });
    } finally {
      setLoading(false);
    }
  };

  const groupedPermissions =
    assignPermissionByRole.length > 0
      ? _.groupBy(
          assignPermissionByRole,
          (permission) => permission.url.split("/")[1]
        )
      : {};

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Role Permission</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">
              Select Role
            </h4>
            <div className="w-full md:w-1/2">
              <Select
                className="w-full"
                placeholder="Select a role"
                onChange={handleOnChangePermission}
                value={selectRole || undefined}
                loading={loading}
              >
                {userRoles.map((role, index) => (
                  <Select.Option key={`role-${index}`} value={role.id}>
                    {role.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>

          {selectRole && (
            <div className="space-y-8">
              <h5 className="text-lg font-semibold text-gray-700">
                Assign Permissions
              </h5>

              {Object.entries(groupedPermissions).map(
                ([group, permissions]) => (
                  <div key={group} className="bg-gray-50 rounded-lg p-4">
                    <h6 className="text-md font-semibold text-gray-700 mb-4 capitalize">
                      {group} Permissions
                    </h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {permissions.map((item, index) => (
                        <div
                          key={`list-permission-${index}`}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              value={item.id}
                              id={`list-permission-${index}`}
                              checked={item.isAssigned}
                              onChange={(event) =>
                                handleSelectPermission(event.target.value)
                              }
                              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              disabled={loading}
                            />
                            <div>
                              <label
                                htmlFor={`list-permission-${index}`}
                                className="block text-sm font-medium text-gray-900"
                              >
                                {item.url}
                              </label>
                              {item.description && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}

              <div className="flex justify-end pt-6">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolePermission;
