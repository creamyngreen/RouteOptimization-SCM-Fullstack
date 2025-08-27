import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Empty, Modal, Form, Input, notification } from "antd";
import { RiDeleteBack2Line } from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  fetchParkings,
  createParking,
  updateParking,
  deleteParking,
} from "../../../redux/action/parkingAction";
import { debounce } from "lodash";

const CustomEmpty = () => (
  <div className="flex flex-col items-center justify-center py-8">
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <div className="text-center">
          <p className="text-gray-500 text-base mb-2">
            No parking records found
          </p>
          <p className="text-gray-400 text-sm">
            Please add a new parking record to get started.
          </p>
        </div>
      }
    />
  </div>
);

const Parking = () => {
  const dispatch = useDispatch();
  const { parkings, loading } = useSelector((state) => state.parking);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editParkingId, setEditParkingId] = useState(null);
  const [modalTitle, setModalTitle] = useState("Add Parking");
  const [searchText, setSearchText] = useState("");
  const [filteredParkings, setFilteredParkings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchParkings());
  }, [dispatch]);

  useEffect(() => {
    if (!searchText) {
      setFilteredParkings(parkings);
      return;
    }

    const searchLower = searchText.toLowerCase();
    const filtered = parkings.filter(
      (parking) =>
        parking.name?.toLowerCase().includes(searchLower) ||
        parking.address?.toLowerCase().includes(searchLower)
    );
    setFilteredParkings(filtered);
  }, [searchText, parkings]);

  const handleSearch = debounce((value) => {
    setSearchText(value);
  }, 300);

  const handleCreate = () => {
    form.resetFields();
    setEditParkingId(null);
    setModalTitle("Add Parking");
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editParkingId) {
        await dispatch(updateParking(editParkingId, values));
        notification.success({
          message: "Success",
          description: "Parking updated successfully",
        });
      } else {
        await dispatch(createParking(values));
        notification.success({
          message: "Success",
          description: "Parking created successfully",
        });
      }
      setIsModalOpen(false);
      dispatch(fetchParkings());
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
        message: "Please select one parking",
        description: "You can only edit one parking at a time",
      });
      return;
    }

    const parkingToEdit = parkings.find(
      (parking) => parking.id === selectedRowKeys[0]
    );
    form.setFieldsValue(parkingToEdit);
    setEditParkingId(parkingToEdit.id);
    setModalTitle("Edit Parking");
    setIsModalOpen(true);
  };

  const showDeleteConfirm = () => {
    if (selectedRowKeys.length === 0) {
      notification.warning({
        message: "No parking selected",
        description: "Please select at least one parking to delete",
      });
      return;
    }

    Modal.confirm({
      title: "Are you sure you want to delete these parking(s)?",
      icon: <ExclamationCircleOutlined />,
      content: `You are about to delete ${selectedRowKeys.length} parking(s). This action cannot be undone.`,
      okText: "Yes, delete",
      okType: "danger",
      cancelText: "No, cancel",
      onOk: async () => {
        try {
          await Promise.all(
            selectedRowKeys.map((id) => dispatch(deleteParking(id)))
          );
          notification.success({
            message: "Success",
            description: "Parking(s) deleted successfully",
          });
          setSelectedRowKeys([]);
        } catch (error) {
          notification.error({
            message: "Error",
            description: error.message || "An error occurred",
          });
        }
      },
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => (a.address || "").localeCompare(b.address || ""),
    },
  ];

  return (
    <div className="flex h-screen font-nunito">
      <div className="flex-1 flex flex-col">
        <div className="p-6 flex-grow">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mt-10 mb-5 text-gray-600 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span>Selected: {selectedRowKeys.length}</span>
              <span>Total: {filteredParkings.length} parkings</span>
              <div className="relative">
                <Input
                  placeholder="Search parkings..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-64"
                  allowClear
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="bg-primary text-white px-4 py-2 rounded-md"
                onClick={handleCreate}
              >
                Add Parking
              </button>
              <button
                className="flex items-center justify-center bg-white border px-4 py-2 rounded-md text-red-500 hover:text-red-600"
                onClick={showDeleteConfirm}
              >
                <RiDeleteBack2Line className="mr-2" />
                Delete parking
              </button>
              <button
                className="bg-white border px-4 py-2 rounded-md"
                onClick={handleEdit}
              >
                Edit parking information
              </button>
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
            <Table
              loading={loading}
              columns={columns}
              dataSource={filteredParkings}
              rowKey="id"
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                },
                onShowSizeChange: (current, size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                },
                pageSizeOptions: ["10", "20", "50", "100"],
              }}
              locale={{ emptyText: <CustomEmpty /> }}
            />
          </div>

          <Modal
            title={modalTitle}
            open={isModalOpen}
            onCancel={() => {
              setIsModalOpen(false);
              form.resetFields();
            }}
            footer={null}
          >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="name"
                label="Parking Name"
                rules={[
                  {
                    required: true,
                    message: "Please input the parking name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="address"
                label="Address"
                rules={[
                  {
                    required: true,
                    message: "Please input the address!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  {editParkingId ? "Update" : "Create"}
                </button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Parking;
