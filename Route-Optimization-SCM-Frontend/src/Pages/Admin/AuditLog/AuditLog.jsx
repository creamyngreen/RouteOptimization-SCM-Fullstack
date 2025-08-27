/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Table, Empty, Input, message, Popconfirm } from "antd";
import { RiExpandUpDownFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAuditLogs,
  deleteAuditLog,
} from "../../../redux/action/auditlogAction";
import { DeleteOutlined } from "@ant-design/icons";

const CustomEmpty = () => (
  <div className="flex flex-col items-center justify-center py-8">
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <div className="text-center">
          <p className="text-gray-500 text-base mb-2">No audit logs found</p>
          <p className="text-gray-400 text-sm">Please check back later.</p>
        </div>
      }
    />
  </div>
);

const AuditLog = () => {
  const dispatch = useDispatch();
  const { auditLogs, loading } = useSelector((state) => state.auditlog);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [dispatch]);

  const fetchLogs = async () => {
    try {
      await dispatch(fetchAuditLogs());
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch audit logs");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteAuditLog(id));
      message.success("Audit log deleted successfully");
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== id));
    } catch (error) {
      console.log(error);
      message.error("Failed to delete audit log");
    }
  };

  // Filter logs based on search text
  const filteredLogs = auditLogs.filter((log) =>
    Object.values(log).some((value) =>
      value?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "User id",
      dataIndex: "user_id",
      sorter: (a, b) => a.user_id.localeCompare(b.user_id),
    },
    {
      title: "User",
      dataIndex: ["user", "username"],
      sorter: (a, b) => a.user?.username.localeCompare(b.user?.username),
    },
    {
      title: "Activity",
      dataIndex: "activity",
      sorter: (a, b) => a.activity.localeCompare(b.activity),
    },

    {
      title: "URL",
      dataIndex: "url",
      sorter: (a, b) => a.url.localeCompare(b.url),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this log?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined className="text-red-500 cursor-pointer" />
        </Popconfirm>
      ),
    },
  ];

  const handleRowsChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  return (
    <div className="flex h-screen font-nunito">
      <div className="flex-1 flex flex-col">
        <div className="p-6 flex-grow">
          {/* Search and Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <Input.Search
              placeholder="Search audit logs..."
              onChange={(e) => setSearchText(e.target.value)}
              className="max-w-xs"
            />
            <span>Selected: {selectedRowKeys.length}</span>
            <span className="text-gray-400">|</span>
            <span>Total: {filteredLogs.length || 0}</span>
            <div className="relative inline-flex items-center">
              <select
                className="border border-gray-300 text-sm px-4 py-2 pr-8 rounded-md focus:outline-none appearance-none"
                onChange={handleRowsChange}
                value={pageSize}
              >
                <option value={10}>View 10 at a time</option>
                <option value={20}>View 20 at a time</option>
                <option value={30}>View 30 at a time</option>
                <option value={40}>View 40 at a time</option>
                <option value={50}>View 50 at a time</option>
              </select>
              <RiExpandUpDownFill className="absolute right-2 pointer-events-none text-gray-500" />
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto mb-6">
            <Table
              columns={columns}
              dataSource={filteredLogs}
              pagination={{ pageSize: pageSize }}
              rowKey="id"
              loading={loading}
              locale={{ emptyText: <CustomEmpty /> }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;
