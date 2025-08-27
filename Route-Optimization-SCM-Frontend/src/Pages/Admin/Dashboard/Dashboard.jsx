import React from "react";
import { Row, Col, Card } from "antd";
import { FaUser } from "react-icons/fa";
import { GrUserManager } from "react-icons/gr";
import { PiUsersThreeLight } from "react-icons/pi";
import { MdOutlineManageHistory } from "react-icons/md";
import { Bar } from "@ant-design/charts";

const Dashboard = () => {
  const data = [
    { type: "Total Users", value: 100 },
    { type: "Managers", value: 30 },
    { type: "Planners", value: 50 },
    { type: "Total Actions", value: 70 },
  ];

  const config = {
    data,
    xField: "value",
    yField: "type",
    seriesField: "type",
    color: ["#4AD991", "#FEC53D", "#FF6B6B", "#4ECDC4"],
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
  };

  return (
    <div className="flex h-screen font-nunito">
      <div className="flex-1 flex flex-col">
        <div className="p-6 bg-gray-100 flex-grow">
          <h1 className="text-3xl font-bold mb-4">Account Management</h1>

          {/* Statistics Cards */}
          <Row gutter={[16, 16]} className="mb-8">
            <Col xs={24} sm={12} lg={6}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg text-gray-600">Total Users</h2>
                    <p className="text-3xl font-bold mt-2">0</p> {/* Placeholder for total users */}
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaUser className="text-2xl text-blue-500" />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg text-gray-600">Managers</h2>
                    <p className="text-3xl font-bold mt-2">0</p> {/* Placeholder for managers count */}
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <GrUserManager className="text-2xl text-blue-500" />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg text-gray-600">Planners</h2>
                    <p className="text-3xl font-bold mt-2">0</p> {/* Placeholder for planners count */}
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <PiUsersThreeLight className="text-2xl text-blue-500" />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg text-gray-600">Total Actions</h2>
                    <p className="text-3xl font-bold mt-2">0</p> {/* Placeholder for total actions */}
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <MdOutlineManageHistory className="text-2xl text-blue-500" />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Chart Section */}
          <Card title="User Statistics" className="mb-8">
            <Bar {...config} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
