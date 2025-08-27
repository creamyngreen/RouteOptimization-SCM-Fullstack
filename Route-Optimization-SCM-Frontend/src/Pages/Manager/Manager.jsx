/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Table, Button, notification, Modal } from "antd";
import { RiExpandUpDownFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFilterPlans,
  updatePlans,
} from "../../redux/action/plannerAction";
import moment from "moment";
import Map from "../../Components/Map/Map";
import { managerStorage } from "../../utils/localStorage";

// get status tag
const getStatusTag = (status) => {
  switch (status) {
    case "Completed":
      return (
        <span className="bg-green-200 text-green-800 px-2 py-1 rounded">
          Completed
        </span>
      );
    case "approved":
      return (
        <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded">
          Approved
        </span>
      );
    case "draft":
      return (
        <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded">
          Draft
        </span>
      );
    case "rejected":
      return (
        <span className="bg-red-200 text-red-800 px-2 py-1 rounded">
          Rejected
        </span>
      );
    case "pending":
      return (
        <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
          Pending
        </span>
      );
    default:
      return status;
  }
};

// Function to get priority tag
const getPriorityTag = (priority) => {
  switch (priority) {
    case "High":
      return (
        <span className="bg-red-200 text-red-800 px-2 py-1 rounded">High</span>
      );
    case "Low":
      return (
        <span className="bg-green-200 text-green-800 px-2 py-1 rounded">
          Low
        </span>
      );
    default:
      return priority;
  }
};

const DeliveryPlanModal = ({
  isModalVisible,
  selectedDeliveryPlan,
  selectedRoute,
  routeColors,
  onCancel,
  onRouteClick,
  onResetView,
}) => (
  <Modal
    title={
      <div className="text-xl sm:text-2xl font-semibold text-gray-800 pb-2">
        {selectedDeliveryPlan?.title || "Delivery Plan Details"}
      </div>
    }
    open={isModalVisible}
    onCancel={onCancel}
    width="95vw"
    style={{ maxWidth: "1200px" }}
    className="responsive-modal"
    footer={null}
  >
    <div className="flex flex-col lg:flex-row gap-4 h-[70vh]">
      {/* Left side - Route details */}
      <div className="w-full lg:w-1/3 overflow-y-auto">
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm text-primary">
              {selectedDeliveryPlan?.algorithm}
            </h3>
            <Button onClick={onResetView} className="flex items-center gap-1">
              <span>Reset View</span>
            </Button>
          </div>
          <p className="text-gray-600 mt-2">
            Total Routes: {selectedDeliveryPlan?.totalRoutes}
          </p>
        </div>

        <div className="space-y-3">
          {selectedDeliveryPlan?.routes.map((route) => (
            <div
              key={route.routeId}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedRoute?.routeId === route.routeId
                  ? "bg-blue-50 border-blue-300"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => onRouteClick(route)}
            >
              {/* Route content */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: routeColors[route.routeId] }}
                  />
                  <span className="font-medium text-[16px]">
                    {route.routeId}
                  </span>
                </div>

                <div className="text-sm space-y-1 break-words">
                  {/* Route details with text wrapping */}
                  <p>
                    <span className="font-semibold">From:</span> {route.from}
                  </p>
                  <p>
                    <span className="font-semibold">To:</span> {route.to}
                  </p>
                  <p>
                    <span className="font-semibold">Weight:</span>{" "}
                    {route.weight} tons
                  </p>
                  <p>
                    <span className="font-semibold">Vehicle:</span>{" "}
                    {route.vehicle}
                  </p>

                  <div className="mt-2 pt-2 border-t">
                    <p>
                      <span className="font-semibold">Travel Distance:</span>{" "}
                      {route.travelDistance.toFixed(2)} km
                    </p>
                    <p>
                      <span className="font-semibold">Travel Time:</span>{" "}
                      {route.travelTime.toFixed(2)} hours
                    </p>
                    <p>
                      <span className="font-semibold">Fuel Cost:</span> $
                      {route.fuel_cost.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-semibold">Total Cost:</span> $
                      {route.total_cost.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Map */}
      <div className="w-full lg:w-2/3 h-[300px] lg:h-full rounded-lg overflow-hidden border">
        {selectedDeliveryPlan && (
          <Map
            key={`map-${selectedDeliveryPlan.id}-${Date.now()}`}
            selectedRoute={selectedRoute}
            selectedPlan={[
              {
                data: {
                  routes: selectedDeliveryPlan.routes.map((route) => ({
                    id: route.routeId,
                    from: route.from,
                    to: route.to,
                    vehicle: route.vehicle,
                    weight: route.weight,
                    travel_kms: route.travelDistance,
                    travel_hours: route.travelTime,
                  })),
                },
              },
            ]}
            routeColors={routeColors}
          />
        )}
      </div>
    </div>
  </Modal>
);

const Manager = () => {
  const dispatch = useDispatch();
  const plans = useSelector((state) => state.planner.plans?.data || []);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedDeliveryPlan, setSelectedDeliveryPlan] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeColors, setRouteColors] = useState({});

  // Fetch plans with pagination
  useEffect(() => {
    dispatch(
      fetchFilterPlans(
        currentPage,
        pageSize,
        {
          status: ["pending", "approved", "rejected"],
        },
        ["priority", "DESC"]
      )
    ).then((response) => {
      if (response) {
        setTotal(response.totalRows);
      }
    });
  }, [dispatch, currentPage, pageSize]);

  // Handle page size change
  const handlePageSizeChange = (value) => {
    setPageSize(parseInt(value));
    setCurrentPage(1); // Reset to first page when changing page size
    dispatch(
      fetchFilterPlans(
        1,
        parseInt(value),
        {
          status: ["pending", "approved", "rejected"],
        },
        ["priority", "DESC"]
      )
    );
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    dispatch(
      fetchFilterPlans(
        page,
        pageSize,
        {
          status: ["pending", "approved", "rejected"],
        },
        ["priority", "DESC"]
      )
    );
  };

  // Transform plans data for table
  const tableData = plans.map((plan) => ({
    key: plan.id,
    id: plan.id,
    demand: `${plan.demand} tons`,
    destination: plan.destination,
    createdDate: moment(plan.initialDateAt).format("YYYY-MM-DD"),
    deadline: moment(plan.deadline).format("YYYY-MM-DD"),
    status: plan.status,
    priority: plan.priority,
    planner: plan.planner?.username || "N/A",
  }));

  const handleStatusChange = async (record, newStatus) => {
    try {
      await dispatch(
        updatePlans([
          {
            id: record.id,
            status: newStatus,
            demand: parseFloat(record.demand),
            priority: record.priority,
            destination: record.destination,
            deadline: record.deadline,
          },
        ])
      );

      await dispatch(
        fetchFilterPlans(
          currentPage,
          pageSize,
          {
            status: ["pending", "approved", "rejected"],
          },
          ["priority", "DESC"]
        )
      );

      notification.success({
        message: "Success",
        description: `Plan has been ${newStatus}`,
        placement: "topRight",
      });
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error",
        description: "Failed to update plan status",
        placement: "topRight",
      });
    }
  };

  // Function to generate consistent colors for routes
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Handle row click to show delivery plan details
  const handleRowClick = (record) => {
    const deliveryPlan = managerStorage.get(record.id);
    if (deliveryPlan) {
      setSelectedRoute(null);
      setRouteColors({});
      setSelectedDeliveryPlan(null);

      setTimeout(() => {
        const newColors = {};
        deliveryPlan.routes.forEach((route) => {
          newColors[route.routeId] = getRandomColor();
        });
        setRouteColors(newColors);

        setSelectedDeliveryPlan(deliveryPlan);
        setIsModalVisible(true);
      }, 0);
    } else {
      notification.info({
        message: "No Delivery Plan",
        description: "No delivery plan found for this procurement plan.",
        placement: "topRight",
      });
    }
  };

  // Handle route selection in the modal
  const handleRouteClick = (route) => {
    if (selectedRoute?.routeId === route?.routeId) {
      setSelectedRoute(null);
    } else {
      setSelectedRoute(route);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedRoute(null);
    setRouteColors({});
    setSelectedDeliveryPlan(null);
  };

  const handleResetView = () => {
    setSelectedRoute(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,
    },
    {
      title: "Demand",
      dataIndex: "demand",
      width: 120,
    },
    {
      title: "Destination",
      dataIndex: "destination",
      width: 150,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      width: 120,
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      width: 120,
    },
    {
      title: "Planner",
      dataIndex: "planner",
      width: 100,
      render: (planner) => <span className="text-gray-700">{planner}</span>,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      width: 100,
      render: (priority) => getPriorityTag(priority),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Action",
      width: 200,
      render: (_, record) => {
        // Only show actions for pending status
        if (record.status === "pending") {
          return (
            <div className="flex gap-2">
              <Button
                type="primary"
                className="bg-primary hover:bg-orange-600"
                onClick={(e) => {
                  e.stopPropagation(); // Stop event from bubbling up
                  handleStatusChange(record, "approved");
                }}
              >
                Approve
              </Button>
              <Button
                danger
                onClick={(e) => {
                  e.stopPropagation(); // Stop event from bubbling up
                  handleStatusChange(record, "rejected");
                }}
              >
                Reject
              </Button>
            </div>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="mx-auto bg-white shadow-lg rounded-lg">
        {/* Header Section */}
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
            Procurement Plans Management
          </h2>

          {/* Plan Summary Section */}
          <div className="overflow-x-auto">
            <div className="flex space-x-4 items-center mb-4 min-w-[500px]">
              <span className="whitespace-nowrap">Total Plans: {total}</span>
              <span className="text-gray-400">|</span>
              <span className="whitespace-nowrap">
                Pending:{" "}
                {tableData.filter((plan) => plan.status === "pending").length}
              </span>
              <div className="relative inline-flex items-center">
                <select
                  className="border border-gray-300 text-sm px-4 py-2 pr-8 rounded-md focus:outline-none appearance-none"
                  onChange={(e) => handlePageSizeChange(e.target.value)}
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
          </div>

          <div className="overflow-x-auto">
            <Table
              columns={columns.map((col) => ({
                ...col,
                ellipsis: true,
                width: undefined,
                className: "whitespace-nowrap",
              }))}
              dataSource={tableData}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: total,
                onChange: handlePageChange,
                showSizeChanger: false,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
                responsive: true,
                className: "px-4",
              }}
              loading={useSelector((state) => state.planner.isLoading)}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
                className: "cursor-pointer hover:bg-gray-50",
              })}
              scroll={{ x: "max-content" }}
              className="min-w-[800px]"
            />
          </div>
        </div>
      </div>

      {/* Update Modal for responsiveness */}
      <DeliveryPlanModal
        key={selectedDeliveryPlan?.id || "no-plan"}
        isModalVisible={isModalVisible}
        selectedDeliveryPlan={selectedDeliveryPlan}
        selectedRoute={selectedRoute}
        routeColors={routeColors}
        onCancel={handleModalCancel}
        onRouteClick={handleRouteClick}
        onResetView={handleResetView}
      />
    </div>
  );
};

export default Manager;
