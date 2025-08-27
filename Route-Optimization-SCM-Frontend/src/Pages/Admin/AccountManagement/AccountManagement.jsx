/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Empty, Modal, Form, Input, notification, Select } from "antd";
import { RiDeleteBack2Line } from "react-icons/ri";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  fetchUsers,
  createUser,
  deleteUsers,
  updateUsers,
  searchUsers,
} from "../../../redux/action/userAction";
import { fetchRoles } from "../../../redux/action/roleAction";
import moment from "moment";
const CustomEmpty = () => (
  <div className="flex flex-col items-center justify-center py-8">
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <div className="text-center">
          <p className="text-gray-500 text-base mb-2">No accounts found</p>
        </div>
      }
    />
  </div>
);

const AccountManagement = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);
  const currentUser = useSelector((state) => state.account.userInfo);
  const [roles, setRoles] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalTitle, setModalTitle] = useState("Create Account");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();

  const filteredUsers = users.filter((user) => {
    return user.id !== currentUser?.id && user.email !== currentUser?.email;
  });

  useEffect(() => {
    dispatch(fetchUsers(currentPage, pageSize));
    fetchRoleData();
  }, [dispatch, currentPage, pageSize]);

  const fetchRoleData = async () => {
    try {
      const roleData = await dispatch(fetchRoles());
      setRoles(roleData);
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error",
        description: "Failed to fetch roles",
      });
    }
  };

  const handleCreate = () => {
    form.resetFields();
    setEditUserId(null);
    setModalTitle("Create Account");
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editUserId) {
        const message = await dispatch(
          updateUsers([{ id: editUserId, ...values }])
        );
        notification.success({
          message: "Success",
          description: message || "Account updated successfully",
        });
      } else {
        await dispatch(createUser(values));
        notification.success({
          message: "Success",
          description: "Account created successfully",
        });
      }
      setIsModalOpen(false);
      dispatch(fetchUsers(currentPage, pageSize));
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "An error occurred",
      });
    }
  };

  const handleEdit = () => {
    if (selectedRowKeys.length !== 1) {
      notification.warning({
        message: "Please select one account",
        description: "You can only edit one account at a time",
      });
      return;
    }

    const selectedUserId = selectedRowKeys[0];

    if (selectedUserId === currentUser?.id) {
      notification.warning({
        message: "Cannot Edit Own Account",
        description: "You cannot edit your own account from this interface.",
      });
      return;
    }

    const user = filteredUsers.find((user) => user.id === selectedUserId);

    if (!user) {
      notification.error({
        message: "Error",
        description: "User not found",
      });
      return;
    }

    form.resetFields();

    form.setFieldsValue({
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      sex: user.sex || "",
      roleId: user.Role?.id || "",
      typeLogin: user.typeLogin || "local",
    });

    setEditUserId(selectedUserId);
    setModalTitle("Edit Account");
    setIsModalOpen(true);
  };

  const { confirm } = Modal;

  const handleDelete = () => {
    if (selectedRowKeys.length === 0) {
      notification.warning({
        message: "No Accounts Selected",
        description: "Please select at least one account to delete.",
      });
      return;
    }

    if (selectedRowKeys.includes(currentUser?.id)) {
      notification.warning({
        message: "Cannot Delete Own Account",
        description: "You cannot delete your own account from this interface.",
      });
      return;
    }

    confirm({
      title: "Are you sure you want to delete these accounts?",
      icon: <ExclamationCircleFilled />,
      content: `You are about to delete ${selectedRowKeys.length} account(s). This action cannot be undone.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      async onOk() {
        try {
          await dispatch(deleteUsers(selectedRowKeys));
          notification.success({
            message: "Success",
            description: "Selected accounts have been deleted successfully.",
          });
          setSelectedRowKeys([]);
          dispatch(fetchUsers(currentPage, pageSize));
        } catch (error) {
          notification.error({
            message: "Error",
            description: error.message,
          });
        }
      },
      onCancel() {},
    });
  };

  const handleSearch = async (value) => {
    try {
      if (value) {
        await dispatch(searchUsers(value));
        if (filteredUsers.length === 0) {
          console.log("No results found");
        }
      } else {
        await dispatch(fetchUsers(currentPage, pageSize));
      }
    } catch (error) {
      notification.error({
        message: "Search Error",
        description: error.message || "Failed to search users",
      });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 200,
      fixed: "left",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 250,
    },
    {
      title: "Sex",
      dataIndex: "sex",
      key: "sex",
      width: 100,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (_, record) => record.role?.name || record.Role?.name || "N/A",
    },
    {
      title: "Login Type",
      dataIndex: "typeLogin",
      key: "typeLogin",
      width: 120,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 200,
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm:ss"),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
      if (isModalOpen) {
        setIsModalOpen(false);
        form.resetFields();
      }
    },
  };

  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: filteredUsers.length,
    onChange: (page, pageSize) => {
      setCurrentPage(page);
      setPageSize(pageSize);
    },
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
  };

  return (
    <div className="flex min-h-screen w-full font-nunito bg-gray-50">
      <div className="flex-1 flex flex-col w-full">
        <div className="p-2 sm:p-4 md:p-6 flex-grow">
          {/* Search Bar */}
          <div className="mb-4">
            <Input.Search
              placeholder="Search users..."
              onSearch={handleSearch}
              className="max-w-md"
              allowClear
            />
          </div>

          {/* Summary and Actions Section */}
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span>Selected: {selectedRowKeys.length}</span>
              <span>Total: {filteredUsers.length} users</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                className="bg-primary text-white px-4 py-2 rounded-md"
                onClick={handleCreate}
              >
                Add Account
              </button>
              <button
                className="flex items-center justify-center bg-white border px-4 py-2 rounded-md"
                onClick={handleDelete}
              >
                <RiDeleteBack2Line className="mr-2" />
                Delete
              </button>
              <button
                className="bg-white border px-4 py-2 rounded-md"
                onClick={handleEdit}
              >
                Edit
              </button>
            </div>
          </div>

          {/* Table */}
          <Table
            loading={loading}
            columns={columns}
            dataSource={filteredUsers}
            rowSelection={rowSelection}
            pagination={paginationConfig}
            scroll={{ x: 1200, y: "calc(100vh - 300px)" }}
            rowKey="id"
            locale={{
              emptyText: <CustomEmpty />,
              noData: <CustomEmpty />,
            }}
          />

          {/* Modal Form */}
          <Modal
            title={modalTitle}
            open={isModalOpen}
            onCancel={() => {
              setIsModalOpen(false);
              form.resetFields();
            }}
            footer={null}
            width={800}
          >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, type: "email" }]}
                >
                  <Input
                    disabled={!!editUserId}
                    className={editUserId ? "bg-gray-100" : ""}
                  />
                </Form.Item>
                {!editUserId && (
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true }]}
                  >
                    <Input.Password />
                  </Form.Item>
                )}
                <Form.Item name="phone" label="Phone">
                  <Input />
                </Form.Item>
                <Form.Item name="address" label="Address">
                  <Input />
                </Form.Item>
                <Form.Item name="sex" label="Sex">
                  <Select>
                    <Select.Option value="male">Male</Select.Option>
                    <Select.Option value="female">Female</Select.Option>
                    <Select.Option value="other">Other</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="roleId"
                  label="Role"
                  rules={[{ required: true, message: "Please select a role" }]}
                >
                  <Select placeholder="Select a role">
                    {roles.map((role) => (
                      <Select.Option key={role.id} value={role.id}>
                        {role.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  {editUserId ? "Update" : "Create"}
                </button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
