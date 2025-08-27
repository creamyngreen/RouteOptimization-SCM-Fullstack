import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Empty, Modal, Form, Input, notification } from "antd";
import { RiDeleteBack2Line } from "react-icons/ri";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  fetchSuppliers,
  createSupplier,
  deleteSupplier,
  updateSupplier,
} from "../../../redux/action/supplierAction";

import moment from "moment";
const CustomEmpty = () => (
  <div className="flex flex-col items-center justify-center py-8">
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <div className="text-center">
          <p className="text-gray-500 text-base mb-2">No suppliers found</p>
        </div>
      }
    />
  </div>
);

const SupplierManagement = () => {
  const dispatch = useDispatch();
  const { suppliers, loading } = useSelector((state) => state.supplier);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSupplierId, setEditSupplierId] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalTitle, setModalTitle] = useState("Create Supplier");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const filteredSuppliers = suppliers.filter((supplier) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      supplier.CompanyName?.toLowerCase().includes(searchLower) ||
      supplier.Address?.toLowerCase().includes(searchLower) ||
      supplier.phone?.toLowerCase().includes(searchLower) ||
      supplier.email?.toLowerCase().includes(searchLower) ||
      supplier.representative?.toLowerCase().includes(searchLower) ||
      supplier.sector?.toLowerCase().includes(searchLower) ||
      supplier.ProductAndService?.toLowerCase().includes(searchLower) ||
      supplier.Market?.toLowerCase().includes(searchLower) ||
      supplier.Masothue?.toLowerCase().includes(searchLower) ||
      supplier.Scale?.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const handleCreate = () => {
    form.resetFields();
    setEditSupplierId(null);
    setModalTitle("Create Supplier");
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editSupplierId) {
        await dispatch(updateSupplier(editSupplierId, values));
        notification.success({
          message: "Success",
          description: "Supplier updated successfully",
        });
      } else {
        await dispatch(createSupplier(values));
        notification.success({
          message: "Success",
          description: "Supplier created successfully",
        });
      }
      setIsModalOpen(false);
      form.resetFields();
      dispatch(fetchSuppliers());
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
        message: "Please select one supplier",
        description: "You can only edit one supplier at a time",
      });
      return;
    }

    const supplierToEdit = suppliers.find(
      (supplier) => supplier.id === selectedRowKeys[0]
    );

    if (!supplierToEdit) {
      notification.error({
        message: "Error",
        description: "Supplier not found",
      });
      return;
    }

    form.resetFields();
    form.setFieldsValue(supplierToEdit);

    setEditSupplierId(supplierToEdit.id);
    setModalTitle("Edit Supplier");
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedRowKeys.length === 0) {
      notification.warning({
        message: "No Suppliers Selected",
        description: "Please select at least one supplier to delete.",
      });
      return;
    }

    Modal.confirm({
      title: "Are you sure you want to delete these suppliers?",
      icon: <ExclamationCircleFilled />,
      content: `You are about to delete ${selectedRowKeys.length} supplier(s). This action cannot be undone.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      async onOk() {
        try {
          await Promise.all(
            selectedRowKeys.map((id) => dispatch(deleteSupplier(id)))
          );
          notification.success({
            message: "Success",
            description: "Selected suppliers have been deleted successfully.",
          });
          setSelectedRowKeys([]);
          dispatch(fetchSuppliers());
        } catch (error) {
          notification.error({
            message: "Error",
            description: error.message,
          });
        }
      },
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "Company Name",
      dataIndex: "CompanyName",
      key: "CompanyName",
      width: 200,
      fixed: "left",
      sorter: (a, b) => a.CompanyName.localeCompare(b.CompanyName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Year",
      dataIndex: "Year",
      key: "Year",
      width: 150,
      sorter: (a, b) => a.Year.localeCompare(b.Year),
    },
    {
      title: "Address",
      dataIndex: "Address",
      key: "Address",
      width: 300,
      sorter: (a, b) => a.Address.localeCompare(b.Address),
    },
    {
      title: "Sector",
      dataIndex: "sector",
      key: "sector",
      width: 200,
      sorter: (a, b) => a.sector.localeCompare(b.sector),
    },
    {
      title: "Product & Service",
      dataIndex: "ProductAndService",
      key: "ProductAndService",
      width: 300,
      sorter: (a, b) => a.ProductAndService.localeCompare(b.ProductAndService),
    },
    {
      title: "Representative",
      dataIndex: "representative",
      key: "representative",
      width: 200,
      sorter: (a, b) => a.representative.localeCompare(b.representative),
    },
    {
      title: "Tax number",
      dataIndex: "Masothue",
      key: "Masothue",
      width: 200,
      sorter: (a, b) => a.Masothue.localeCompare(b.Masothue),
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
    total: filteredSuppliers.length,
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
              placeholder="Search suppliers..."
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-md"
              allowClear
            />
          </div>

          {/* Summary and Actions Section */}
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span>Selected: {selectedRowKeys.length}</span>
              <span>Total: {filteredSuppliers.length} suppliers</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                className="bg-primary text-white px-4 py-2 rounded-md"
                onClick={handleCreate}
              >
                Add Supplier
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
            dataSource={filteredSuppliers}
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
                  name="CompanyName"
                  label="Company Name"
                  rules={[
                    { required: true, message: "Please input company name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="Address"
                  label="Address"
                  rules={[{ required: true, message: "Please input address!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[{ required: true, message: "Please input phone!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="representative"
                  label="Representative"
                  rules={[
                    { required: true, message: "Please input representative!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Please input valid email!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="sector"
                  label="Sector"
                  rules={[{ required: true, message: "Please input sector!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name="ProductAndService" label="Product & Service">
                  <Input />
                </Form.Item>
                <Form.Item name="Market" label="Market">
                  <Input />
                </Form.Item>
                <Form.Item name="Masothue" label="Tax Number">
                  <Input />
                </Form.Item>
                <Form.Item name="Year" label="Year">
                  <Input type="number" />
                </Form.Item>
                <Form.Item name="Scale" label="Scale">
                  <Input />
                </Form.Item>
                <Form.Item name="Capacity" label="Capacity">
                  <Input type="number" step="0.01" />
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
                  {editSupplierId ? "Update" : "Create"}
                </button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default SupplierManagement;
