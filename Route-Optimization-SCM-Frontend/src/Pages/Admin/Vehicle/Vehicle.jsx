import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Empty, Modal, Form, Input, notification } from "antd";
import { RiDeleteBack2Line } from "react-icons/ri";
import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import {
  fetchVehicles,
  createVehicle,
  deleteVehicle,
  updateVehicle,
} from "../../../redux/action/vehicleAction";
import { debounce } from "lodash";

const CustomEmpty = () => (
  <div className="flex flex-col items-center justify-center py-8">
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <div className="text-center">
          <p className="text-gray-500 text-base mb-2">No vehicles found</p>
          <p className="text-gray-400 text-sm">
            Please add a new vehicle to get started.
          </p>
        </div>
      }
    />
  </div>
);

const VehicleManagement = () => {
  const dispatch = useDispatch();
  const { vehicles, loading } = useSelector((state) => state.vehicle);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalTitle, setModalTitle] = useState("Create Vehicle");
  const [searchText, setSearchText] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [form] = Form.useForm();

  // Fetch vehicles on component mount
  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  // Update search filtering
  useEffect(() => {
    if (!searchText) {
      setFilteredVehicles(vehicles);
      return;
    }

    const searchLower = searchText.toLowerCase();
    const filtered = vehicles.filter(
      (vehicle) =>
        vehicle.registered_num?.toLowerCase().includes(searchLower) ||
        vehicle.vehicle_name?.toLowerCase().includes(searchLower) ||
        vehicle.capacity?.toString().toLowerCase().includes(searchLower) ||
        vehicle.kilometer_driven?.toString().toLowerCase().includes(searchLower)
    );
    setFilteredVehicles(filtered);
  }, [searchText, vehicles]);

  // Update table data mapping
  const tableData = filteredVehicles.map((vehicle) => ({
    key: vehicle.id,
    ...vehicle,
  }));

  // Update columns with proper sorting
  const columns = [
    {
      title: "Registered Number",
      dataIndex: "registered_num",
      sorter: (a, b) =>
        (a.registered_num || "").localeCompare(b.registered_num || ""),
    },
    {
      title: "Vehicle Name",
      dataIndex: "vehicle_name",
      sorter: (a, b) =>
        (a.vehicle_name || "").localeCompare(b.vehicle_name || ""),
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      sorter: (a, b) => (Number(a.capacity) || 0) - (Number(b.capacity) || 0),
    },
    {
      title: "Kilometer Driven",
      dataIndex: "kilometer_driven",
      sorter: (a, b) =>
        (Number(a.kilometer_driven) || 0) - (Number(b.kilometer_driven) || 0),
    },
  ];

  const handleSearch = debounce((value) => {
    setSearchText(value);
  }, 300);

  const handleCreate = () => {
    setModalTitle("Create Vehicle");
    form.resetFields();
    setEditVehicleId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editVehicleId) {
        await dispatch(updateVehicle(editVehicleId, values));
        notification.success({
          message: "Success",
          description: "Vehicle updated successfully",
        });
      } else {
        await dispatch(createVehicle(values));
        notification.success({
          message: "Success",
          description: "Vehicle created successfully",
        });
      }
      setIsModalOpen(false);
      dispatch(fetchVehicles());
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
        message: "Warning",
        description: "Please select exactly one vehicle to edit",
      });
      return;
    }

    const vehicleToEdit = vehicles.find(
      (vehicle) => vehicle.id === selectedRowKeys[0]
    );
    form.setFieldsValue(vehicleToEdit);
    setEditVehicleId(vehicleToEdit.id);
    setModalTitle(`Edit Vehicle (${vehicleToEdit.registered_num})`);
    setIsModalOpen(true);
  };

  const showDeleteConfirm = () => {
    if (selectedRowKeys.length === 0) {
      notification.warning({
        message: "Warning",
        description: "Please select at least one vehicle to delete",
      });
      return;
    }

    Modal.confirm({
      title: "Are you sure you want to delete these vehicle(s)?",
      icon: <ExclamationCircleOutlined />,
      content: `You are about to delete ${selectedRowKeys.length} vehicle(s). This action cannot be undone.`,
      okText: "Yes, delete",
      okType: "danger",
      cancelText: "No, cancel",
      onOk: async () => {
        try {
          await Promise.all(
            selectedRowKeys.map((id) => dispatch(deleteVehicle(id)))
          );
          notification.success({
            message: "Success",
            description: "Vehicle(s) deleted successfully",
          });
          setSelectedRowKeys([]);
          dispatch(fetchVehicles());
        } catch (error) {
          notification.error({
            message: "Error",
            description: error.message || "Failed to delete vehicles",
          });
        }
      },
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <div className="flex h-screen font-nunito">
      <div className="flex-1 flex flex-col">
        <div className="p-6 flex-grow">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mt-10 mb-5 text-gray-600 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span>Selected: {selectedRowKeys.length}</span>
              <span>Total: {filteredVehicles.length} vehicles</span>
              <div className="relative">
                <Input
                  placeholder="Search vehicles..."
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
                Add Vehicle
              </button>
              <button
                className="flex items-center justify-center bg-white border px-4 py-2 rounded-md text-red-500 hover:text-red-600"
                onClick={showDeleteConfirm}
              >
                <RiDeleteBack2Line className="mr-2" />
                Delete vehicle
              </button>
              <button
                className="bg-white border px-4 py-2 rounded-md"
                onClick={handleEdit}
              >
                Edit vehicle information
              </button>
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
            <Table
              loading={loading}
              columns={columns}
              dataSource={tableData}
              rowKey="id"
              rowSelection={rowSelection}
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
                name="registered_num"
                label="Registered Number"
                rules={[
                  {
                    required: true,
                    message: "Please input the registered number!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="vehicle_name"
                label="Vehicle Name"
                rules={[
                  {
                    required: true,
                    message: "Please input the vehicle name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="capacity"
                label="Capacity"
                rules={[
                  {
                    required: true,
                    message: "Please input the capacity!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="kilometer_driven"
                label="Kilometer Driven"
                rules={[
                  {
                    required: true,
                    message: "Please input the kilometer driven!",
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
                  {editVehicleId ? "Update Vehicle" : "Create Vehicle"}
                </button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;
