import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchFilterPlans } from "../../../redux/action/plannerAction";
import { GrPlan } from "react-icons/gr";
import { MdIncompleteCircle } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import { Line, Pie, Column } from "@ant-design/charts";
import { Select, Card, Row, Col } from "antd";
import "./Monitor.css";
const { Option } = Select;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Monitor = () => {
  const dispatch = useDispatch();
  const [statistics, setStatistics] = useState({
    totalPlans: 0,
    pendingPlans: 0,
    approvedPlans: 0,
    rejectedPlans: 0,
  });
  const [plans, setPlans] = useState([]);
  const [selectedMonthCompleted, setSelectedMonthCompleted] =
    useState("January");
  const [selectedMonthDemand, setSelectedMonthDemand] = useState("January");

  // Function to calculate weekly data
  const calculateWeeklyData = (plans, status, selectedMonth) => {
    const selectedMonthData = plans.filter((plan) => {
      const planDate = new Date(plan.initialDate);
      const planMonth = planDate.toLocaleString("default", { month: "long" });
      return planMonth === selectedMonth && plan.status === status;
    });

    // If no data for selected month, return empty data
    if (selectedMonthData.length === 0) {
      return [
        { month: "Week 1", value: 0 },
        { month: "Week 2", value: 0 },
        { month: "Week 3", value: 0 },
        { month: "Week 4", value: 0 },
      ];
    }

    const weeklyData = [
      { month: "Week 1", value: 0 },
      { month: "Week 2", value: 0 },
      { month: "Week 3", value: 0 },
      { month: "Week 4", value: 0 },
    ];

    selectedMonthData.forEach((plan) => {
      const date = new Date(plan.initialDate);
      const week = Math.ceil(date.getDate() / 7);
      if (week <= 4) {
        weeklyData[week - 1].value += 1;
      }
    });

    return weeklyData;
  };

  // Chart configurations
  const completedPlanConfig = {
    data: calculateWeeklyData(plans, "approved", selectedMonthCompleted),
    xField: "month",
    yField: "value",
    smooth: true,
    color: "#4AD991",
    point: {
      size: 5,
      shape: "diamond",
      style: {
        fill: "white",
        stroke: "#4AD991",
        lineWidth: 2,
      },
    },
  };

  const demandConfig = {
    data: plans
      .filter((plan) => {
        const planMonth = new Date(plan.initialDate).toLocaleString("default", {
          month: "long",
        });
        return planMonth === selectedMonthDemand;
      })
      .map((plan) => ({
        month: new Date(plan.initialDate).toLocaleString("default", {
          month: "long",
        }),
        value: plan.demand || 0,
      })),
    xField: "month",
    yField: "value",
    smooth: true,
    color: "#FEC53D",
    point: {
      size: 5,
      shape: "diamond",
      style: {
        fill: "white",
        stroke: "#FEC53D",
        lineWidth: 2,
      },
    },
  };

  // Add new chart configurations
  const priorityPieConfig = {
    data: [
      {
        type: "High Priority",
        value: plans.filter((p) => p.priority === "High").length,
      },
      {
        type: "Low Priority",
        value: plans.filter((p) => p.priority === "Low").length,
      },
    ],
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    color: ["#FF6B6B", "#4ECDC4"],
  };

  const statusDistributionConfig = {
    data: [
      { status: "Pending", count: statistics.pendingPlans },
      { status: "Approved", count: statistics.approvedPlans },
      { status: "Rejected", count: statistics.rejectedPlans },
    ],
    xField: "status",
    yField: "count",
    color: ["#FEC53D", "#4AD991", "#FF9871"],
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
  };

  // Fetch all plans and calculate statistics
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(
          fetchFilterPlans(1, 1000, {
            status: ["pending", "approved", "rejected", "draft", "completed"],
          })
        );

        if (response && response.procurementPlans) {
          const allPlans = response.procurementPlans;
          setPlans(allPlans);

          // Set initial month to current month
          const currentMonth = new Date().toLocaleString("default", {
            month: "long",
          });
          setSelectedMonthCompleted(currentMonth);
          setSelectedMonthDemand(currentMonth);

          setStatistics({
            totalPlans: allPlans.length,
            pendingPlans: allPlans.filter((plan) => plan.status === "pending")
              .length,
            approvedPlans: allPlans.filter((plan) => plan.status === "approved")
              .length,
            rejectedPlans: allPlans.filter((plan) => plan.status === "rejected")
              .length,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl lg:text-3xl font-bold mb-6">Monitor Overview</h1>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg text-gray-600">Total Plans</h2>
                <p className="text-3xl font-bold mt-2">
                  {statistics.totalPlans}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <GrPlan className="text-2xl text-blue-500" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg text-gray-600">Pending Plans</h2>
                <p className="text-3xl font-bold mt-2">
                  {statistics.pendingPlans}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <MdIncompleteCircle className="text-2xl text-blue-500" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg text-gray-600">Approved Plans</h2>
                <p className="text-3xl font-bold mt-2">
                  {statistics.approvedPlans}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaCheck className="text-2xl text-blue-500" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg text-gray-600">Rejected Plans</h2>
                <p className="text-3xl font-bold mt-2">
                  {statistics.rejectedPlans}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <HiXMark className="text-2xl text-blue-500" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Grid */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Weekly Approved Plans" className="h-full">
            <Select
              value={selectedMonthCompleted}
              onChange={setSelectedMonthCompleted}
              className="mb-4 w-48"
            >
              {MONTHS.map((month) => {
                const hasData = plans.some((plan) => {
                  const planDate = new Date(plan.initialDate);
                  const planMonth = planDate.toLocaleString("default", {
                    month: "long",
                  });
                  return planMonth === month && plan.status === "approved";
                });

                return (
                  <Option key={month} value={month}>
                    {month} {hasData ? "" : "(Empty)"}
                  </Option>
                );
              })}
            </Select>
            <Line {...completedPlanConfig} />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Priority Distribution" className="h-full">
            <Pie {...priorityPieConfig} />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Demand Trends" className="h-full">
            <Select
              value={selectedMonthDemand}
              onChange={setSelectedMonthDemand}
              className="mb-4 w-48"
            >
              {MONTHS.map((month) => {
                const hasData = plans.some((plan) => {
                  const planDate = new Date(plan.initialDate);
                  const planMonth = planDate.toLocaleString("default", {
                    month: "long",
                  });
                  return planMonth === month;
                });

                return (
                  <Option key={month} value={month}>
                    {month} {hasData ? "" : "(Empty)"}
                  </Option>
                );
              })}
            </Select>
            <Line {...demandConfig} />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Status Distribution" className="h-full">
            <Column {...statusDistributionConfig} />
          </Card>
        </Col>
      </Row>

      {/* Additional Statistics */}
      <Row gutter={[16, 16]} className="mt-8">
        <Col xs={24} lg={8}>
          <Card className="text-center">
            <h3 className="text-xl mb-2">Average Processing Time</h3>
            <p className="text-3xl font-bold text-blue-500">2.5 Days</p>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="text-center">
            <h3 className="text-xl mb-2">High Priority Plans</h3>
            <p className="text-3xl font-bold text-red-500">
              {plans.filter((p) => p.priority === "High").length}
            </p>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="text-center">
            <h3 className="text-xl mb-2">Total Demand</h3>
            <p className="text-3xl font-bold text-green-500">
              {plans.reduce((sum, plan) => sum + (plan.demand || 0), 0)}
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Monitor;
