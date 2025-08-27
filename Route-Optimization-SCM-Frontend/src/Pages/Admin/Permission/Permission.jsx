import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Empty, Modal, Form, Input, notification } from "antd";
import { RiDeleteBack2Line } from "react-icons/ri";
import { ExclamationCircleFilled, SearchOutlined } from "@ant-design/icons";
import {
  fetchPermissions,
  createPermission,
  deletePermission,
  updatePermission,
} from "../../../redux/action/permissionAction";
import moment from "moment";
import { debounce } from "lodash";

const CustomEmpty = () => (
  <div className="flex flex-col items-center justify-center py-8">
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <div className="text-center">
          <p className="text-gray-500 text-base mb-2">No permissions found</p>
        </div>
      }
    />
  </div>
);

const Permission = () => {
  const dispatch = useDispatch();
  const { permissions, loading, totalRows } = useSelector(
    (state) => state.permission
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPermissionId, setEditPermissionId] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalTitle, setModalTitle] = useState("Create Permission");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [filteredPermissions, setFilteredPermissions] = useState([]);

  useEffect(() => {
    dispatch(fetchPermissions(currentPage, pageSize));
  }, [dispatch, currentPage, pageSize]);

  useEffect(() => {
    if (!searchText) {
      setFilteredPermissions(permissions);
      return;
    }

    const searchLower = searchText.toLowerCase();
    const filtered = permissions.filter(
      (permission) =>
        permission.url.toLowerCase().includes(searchLower) ||
        permission.description.toLowerCase().includes(searchLower) ||
        permission.id.toString().includes(searchLower)
    );
    setFilteredPermissions(filtered);
  }, [searchText, permissions]);

  const handleSearch = debounce((value) => {
    setSearchText(value);
    setCurrentPage(1);
  }, 300);

  const handleCreate = () => {
    setModalTitle("Create Permission");
    form.resetFields();
    setEditPermissionId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editPermissionId) {
        await dispatch(updatePermission(editPermissionId, values));
        notification.success({
          message: "Success",
          description: "Permission updated successfully",
        });
      } else {
        await dispatch(createPermission(values));
        notification.success({
          message: "Success",
          description: "Permission created successfully",
        });
      }
      setIsModalOpen(false);
      dispatch(fetchPermissions(currentPage, pageSize));
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "An error occurred",
      });
    }
  };

  const handleEdit = () => {
    if (selectedRowKeys.length === 1) {
      const selectedPermissionId = selectedRowKeys[0];
      const permission = permissions.find((p) => p.id === selectedPermissionId);

      if (!permission) {
        notification.error({
          message: "Error",
          description: "Permission not found",
        });
        return;
      }

      form.setFieldsValue({
        url: permission.url,
        description: permission.description,
      });

      setEditPermissionId(selectedPermissionId);
      setModalTitle("Edit Permission");
      setIsModalOpen(true);
    } else {
      notification.warning({
        message: "Edit Permission",
        description: "Please select only one permission to edit.",
      });
    }
  };

  const handleDelete = () => {
    if (selectedRowKeys.length === 0) {
      notification.warning({
        message: "No Permissions Selected",
        description: "Please select at least one permission to delete.",
      });
      return;
    }

    Modal.confirm({
      title: "Are you sure you want to delete these permissions?",
      icon: <ExclamationCircleFilled />,
      content: `You are about to delete ${selectedRowKeys.length} permission(s). This action cannot be undone.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      async onOk() {
        try {
          await Promise.all(
            selectedRowKeys.map((id) => dispatch(deletePermission(id)))
          );
          notification.success({
            message: "Success",
            description: "Selected permissions have been deleted successfully.",
          });
          setSelectedRowKeys([]);
          dispatch(fetchPermissions(currentPage, pageSize));
        } catch (error) {
          notification.error({
            message: "Error",
            description: error.message,
          });
        }
      },
    });
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
      title: "URL",
      dataIndex: "url",
      key: "url",
      width: 250,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
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
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: totalRows,
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
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Input
                  placeholder="Search permissions..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-64"
                  allowClear
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span>Selected: {selectedRowKeys.length}</span>
              <span>Total: {totalRows} permissions</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                onClick={handleCreate}
              >
                Add Permission
              </button>
              <button
                className="flex items-center justify-center bg-white border px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                onClick={handleDelete}
                disabled={selectedRowKeys.length === 0}
              >
                <RiDeleteBack2Line className="mr-2" />
                Delete
              </button>
              <button
                className="bg-white border px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                onClick={handleEdit}
                disabled={selectedRowKeys.length !== 1}
              >
                Edit
              </button>
            </div>
          </div>

          <Table
            loading={loading}
            columns={columns}
            dataSource={filteredPermissions}
            rowSelection={rowSelection}
            pagination={{
              ...paginationConfig,
              total: filteredPermissions.length,
            }}
            scroll={{ x: 1200, y: "calc(100vh - 300px)" }}
            rowKey="id"
            locale={{
              emptyText: <CustomEmpty />,
              noData: <CustomEmpty />,
            }}
          />

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
              <div className="grid grid-cols-1 gap-4">
                <Form.Item
                  name="url"
                  label="URL"
                  rules={[{ required: true, message: "Please input the URL!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: "Please input the description!",
                    },
                  ]}
                >
                  <Input.TextArea rows={4} />
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
                  {editPermissionId ? "Update" : "Create"}
                </button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Permission;
