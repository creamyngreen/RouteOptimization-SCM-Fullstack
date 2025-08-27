import { useState, useEffect } from "react";
import { FaFilter, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import "./Optimization.css";
import { useSelector } from "react-redux";
import Map from "../../Components/Map/Map";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { useDispatch } from "react-redux";
import {
  fetchFilterPlans,
  updatePlans,
} from "../../redux/action/plannerAction";
import { managerStorage } from "../../utils/localStorage";

const Optimization = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [filterRoutes, setFilterRoutes] = useState("");
  const [filterAmount, setFilterAmount] = useState("");
  const [expandedPlan, setExpandedPlan] = useState(null);
  const { optimizationResult } = useSelector((state) => state.optimize);
  const [routeColors, setRouteColors] = useState({});
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [selectedPlans, setSelectedPlans] = useState({});
  const navigate = useNavigate();
  const planner = useSelector((state) => state.planner.plans?.data || []);
  const dispatch = useDispatch();

  console.log(planner);

  useEffect(() => {
    dispatch(fetchFilterPlans());
  }, [dispatch]);

  const transformRoutes = (routes) => {
    if (!routes) return null;
    return {
      totalRoutes: routes.length,
      totalAmount: routes.reduce((sum, route) => sum + route.weight, 0),
      routes: routes.map((route) => ({
        id: route.route_id,
        from: route.routes[0][0],
        to: route.routes[0][1],
        demand: route.weight,
        vehicle: route.vehicle,
        weight: route.weight,
        driver_cost: route.driver_cost,
        fuel_cost: route.fuel_cost,
        goods_cost: route.goods_cost,
        total_cost: route.total_cost,
        travel_hours: route.travel_hours,
        travel_kms: route.travel_kms,
      })),
    };
  };

  const deliveryPlans = [];
  if (optimizationResult?.solutions?.genetic_algorithm) {
    deliveryPlans.push({
      title: "Delivery Plan 1",
      algorithm: "Genetic Algorithm",
      data: transformRoutes(optimizationResult.solutions.genetic_algorithm),
    });
  }

  if (optimizationResult?.solutions?.graph_neural_network) {
    deliveryPlans.push({
      title: "Delivery Plan 2",
      algorithm: "Graph Neural Network",
      data: transformRoutes(optimizationResult.solutions.graph_neural_network),
    });
  }

  if (optimizationResult?.solutions?.linear_algorithm) {
    deliveryPlans.push({
      title: optimizationResult.solutions.graph_neural_network
        ? "Delivery Plan 3"
        : "Delivery Plan 2",
      algorithm: "Linear Algorithm",
      data: transformRoutes(optimizationResult.solutions.linear_algorithm),
    });
  }

  const handleRouteClick = (route) => {
    setSelectedRoute(route);
  };

  const resetFilters = () => {
    setFilterRoutes("");
    setFilterAmount("");
    setSelectedRoute(null);
  };

  const filteredPlans = deliveryPlans.filter((plan) => {
    const matchesRoutes = filterRoutes
      ? plan.data.totalRoutes === parseInt(filterRoutes)
      : true;
    const matchesAmount = filterAmount
      ? plan.data.totalAmount === parseInt(filterAmount)
      : true;
    return matchesRoutes && matchesAmount;
  });

  useEffect(() => {
    if (deliveryPlans.length > 0) {
      const allRoutes = deliveryPlans.flatMap((plan) => plan.data.routes);
      const newColors = {};

      allRoutes.forEach((route) => {
        if (!routeColors[route.id]) {
          newColors[route.id] = getRandomColor();
        }
      });

      if (Object.keys(newColors).length > 0) {
        setRouteColors((prev) => ({ ...prev, ...newColors }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryPlans]);

  const getRandomColor = () => {
    const baseHues = [0, 210, 120, 300, 30, 180, 60, 270, 90, 330];

    getRandomColor.counter = (getRandomColor.counter || 0) + 1;
    const baseHue = baseHues[getRandomColor.counter % baseHues.length];

    const hueVariation = Math.random() * 20 - 10;
    const hue = (baseHue + hueVariation) % 360;

    const index = getRandomColor.counter % 4;
    let saturation, lightness;

    switch (index) {
      case 0:
        saturation = 90;
        lightness = 45;
        break;
      case 1:
        saturation = 80;
        lightness = 55;
        break;
      case 2:
        saturation = 70;
        lightness = 65;
        break;
      case 3:
        saturation = 85;
        lightness = 50;
        break;
    }

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const ToggleSidebarButton = () => (
    <button
      onClick={() => setIsSidebarVisible(!isSidebarVisible)}
      className="fixed left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-r-lg shadow-md z-20 hover:bg-gray-100 transition-all duration-300"
      style={{ top: "16%", transform: "translateY(-50%)" }}
    >
      {isSidebarVisible ? (
        <FaChevronDown className="transform rotate-90 text-gray-600" />
      ) : (
        <FaChevronDown className="transform -rotate-90 text-gray-600" />
      )}
    </button>
  );

  const handlePlanCheckbox = (planTitle) => {
    setSelectedPlans((prev) => ({
      ...prev,
      [planTitle]: !prev[planTitle],
    }));
  };

  const handleBack = () => {
    navigate("/planner");
  };

  const handleSendToManager = async () => {
    const selectedPlanCount =
      Object.values(selectedPlans).filter(Boolean).length;

    if (selectedPlanCount === 0) {
      notification.warning({
        message: "No Delivery Plan Selected",
        description: "Please select a delivery plan to send to manager.",
        placement: "topRight",
      });
      return;
    }

    if (selectedPlanCount > 1) {
      notification.warning({
        message: "Multiple Plans Selected",
        description: "Please select only one delivery plan to send to manager.",
        placement: "topRight",
      });
      return;
    }

    try {
      const currentPlan = planner.find(
        (item) => String(item.id) === String(optimizationResult.plan_id)
      );

      if (!currentPlan) {
        throw new Error("Plan not found");
      }

      // Get the selected delivery plan
      const selectedPlan = deliveryPlans.find(
        (plan) => selectedPlans[plan.title]
      );

      if (!selectedPlan) {
        throw new Error("Selected plan not found");
      }

      // Save to localStorage with the selected plan's data
      managerStorage.save(optimizationResult.plan_id, selectedPlan);

      // Update the procurement plan status
      await dispatch(
        updatePlans([
          {
            id: optimizationResult.plan_id,
            status: "pending",
            priority: currentPlan.priority,
            deadline: currentPlan.deadline,
            demand: currentPlan.demand,
            destination: currentPlan.destination,
          },
        ])
      );

      notification.success({
        message: "Success",
        description: "Delivery plan has been sent to manager for approval.",
        placement: "topRight",
      });

      navigate("/planner");
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to send delivery plan. Please try again.",
        placement: "topRight",
      });
      console.error("Error sending delivery plan:", error);
    }
  };

  const getPlanStatus = () => {
    if (!optimizationResult?.plan_id || !planner?.length) {
      return "Pending";
    }

    const plannerItem = planner.find(
      (item) => String(item.id) === String(optimizationResult.plan_id)
    );
    console.log("Plan ID:", optimizationResult.plan_id);
    console.log("Found Plan:", plannerItem);

    return plannerItem?.status || "Pending";
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ToggleSidebarButton />
      <div className="flex flex-1 flex-col lg:flex-row relative">
        <div
          className={`${
            isSidebarVisible ? "w-full lg:w-1/3 xl:w-1/4" : "w-0"
          } overflow-hidden transition-all duration-300 bg-white shadow-lg lg:sticky lg:top-16`}
        >
          <div className={`${isSidebarVisible ? "block" : "hidden"}`}>
            <div className="relative">
              <h1 className="text-2xl font-bold my-4 text-center flex items-center justify-center gap-2">
                Optimization
                {optimizationResult?.plan_id && (
                  <span
                    className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                      getPlanStatus()
                    )}`}
                  >
                    {getPlanStatus()}
                  </span>
                )}
              </h1>
            </div>

            <p className="mb-4 px-4 text-center">
              Plan ID: {optimizationResult?.plan_id}
            </p>
            <div className="sticky top-0 bg-white z-10 p-4 border-b">
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FaFilter className="text-primary w-4 h-4 mr-2" />
                    <span className="font-semibold text-gray-700">
                      Filter Plans
                    </span>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="text-red-500 hover:text-red-600 text-sm flex items-center"
                  >
                    <GrPowerReset className="w-3 h-3 mr-1" />
                    Reset
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                      Total Routes
                    </label>
                    <input
                      type="number"
                      value={filterRoutes}
                      onChange={(e) => setFilterRoutes(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                      min="0"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                      Total Amount
                    </label>
                    <input
                      type="number"
                      value={filterAmount}
                      onChange={(e) => setFilterAmount(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {filteredPlans.map((plan) => (
                <div
                  key={plan.title}
                  className={`p-4 rounded-lg border hover:bg-gray-100 ${
                    expandedPlan === plan.title ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedPlans[plan.title] || false}
                        onChange={() => handlePlanCheckbox(plan.title)}
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() =>
                          setExpandedPlan(
                            expandedPlan === plan.title ? null : plan.title
                          )
                        }
                      >
                        <span className="font-bold text-lg text-gray-800">
                          {plan.title}
                        </span>
                      </div>
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        setExpandedPlan(
                          expandedPlan === plan.title ? null : plan.title
                        )
                      }
                    >
                      {expandedPlan === plan.title ? (
                        <FaChevronUp className="text-gray-500" />
                      ) : (
                        <FaChevronDown className="text-gray-500" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-primary ml-7">
                    {plan.algorithm}
                  </span>
                  <div className="mt-2 text-sm text-gray-600 flex gap-4 ml-7">
                    Total Routes: {plan.data.totalRoutes}
                  </div>
                  {expandedPlan === plan.title && (
                    <ul className="ml-11 mt-3 space-y-2">
                      {plan.data.routes.map((route, index) => (
                        <li
                          key={route.id}
                          className="relative bg-gray-50 p-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleRouteClick(route)}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: routeColors[route.id] }}
                            />
                            <span>
                              Route {index + 1}: {route.id}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="sticky bottom-0 bg-white mt-4 p-4 border-t flex justify-center gap-4">
            {getPlanStatus()?.toLowerCase() === "pending" ? (
              <button
                onClick={handleBack}
                className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 w-full"
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 w-full">
                  Back
                </span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleBack}
                  className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-200"
                >
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                    Back
                  </span>
                </button>

                <button
                  onClick={handleSendToManager}
                  className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200"
                >
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                    Send to Manager
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
        <div
          className={`transition-all duration-300 p-4 flex-1 ${
            isSidebarVisible ? "lg:w-2/3 xl:w-3/4" : "w-full"
          }`}
        >
          <div className="w-full h-[calc(100vh-8rem)] lg:h-[calc(100vh--2rem)] rounded-lg overflow-hidden shadow-lg">
            <Map
              selectedRoute={selectedRoute}
              selectedPlan={deliveryPlans}
              routeColors={routeColors}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Optimization;
