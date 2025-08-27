/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaArrowDown } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { TiFilter } from "react-icons/ti";
import { IoMdArrowDropdown } from "react-icons/io";
import { DatePicker, Space, Table, notification, Empty, Progress } from "antd";
import { RiExpandUpDownFill } from "react-icons/ri";
import { RiDeleteBack2Line } from "react-icons/ri";
import { FaFileExcel } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { FaFileUpload } from "react-icons/fa";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  doAddPlan,
  fetchFilterPlans,
  searchPlans,
  deletePlans,
  updatePlans,
} from "../../redux/action/plannerAction";
import { optimizePlan } from "../../redux/action/optimizeAction";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import BouncyText from "../../Components/BouncingText/BouncingText";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../../redux/action/userAction";

dayjs.extend(customParseFormat);
const getStatusTag = (status) => {
  switch (status) {
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

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "Created Date",
    dataIndex: "createdDate",
    sorter: (a, b) =>
      moment(a.createdDate).unix() - moment(b.createdDate).unix(),
  },
  {
    title: "Deadline",
    dataIndex: "deadline",
    sorter: (a, b) => moment(a.deadline).unix() - moment(b.deadline).unix(),
  },
  {
    title: "Demand",
    dataIndex: "demand",
    render: (text) => `${text} tons`,
    sorter: (a, b) => a.demand - b.demand,
  },
  {
    title: "Destination",
    dataIndex: "destination",
    sorter: (a, b) => a.destination.localeCompare(b.destination),
  },
  {
    title: "Priority",
    dataIndex: "priority",
    render: (text) => getPriorityTag(text),
    sorter: (a, b) => a.priority.localeCompare(b.priority),
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (text) => getStatusTag(text),
    sorter: (a, b) => a.status.localeCompare(b.status),
  },
];

const CustomEmpty = () => (
  <div className="flex flex-col items -center justify-center py-8">
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <div className="text-center">
          <p className="text-gray-500 text-base mb-2">
            No matching plans found
          </p>
          <p className="text-gray-400 text-sm">
            Try adjusting your filter criteria or search terms
          </p>
        </div>
      }
    />
  </div>
);

const Planner = () => {
  const { RangePicker } = DatePicker;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);
  const [isDetailedFilterVisible, setIsDetailedFilterVisible] = useState(true);
  const [destination, setDestination] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editData, setEditData] = useState([]);
  const [singleEditPlan, setSingleEditPlan] = useState({
    demand: "",
    destination: "",
    deadline: "",
    priority: "Low",
  });
  const [demandInput, setDemandInput] = useState("");
  const [priorityInput, setPriorityInput] = useState(null);
  const [modalPriorityInput, setModalPriorityInput] = useState(null);
  const [deadlineInput, setDeadlineInput] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [activeTimeFrame, setActiveTimeFrame] = useState(null);
  const [activeStatus, setActiveStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [dateType, setDateType] = useState("createdDate");
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const dispatch = useDispatch();
  const { plans, isLoading } = useSelector((state) => state.planner);
  const user = useSelector((state) => state.account.userInfo);
  const [currentFilters, setCurrentFilters] = useState({});
  const [isOptimizeModalVisible, setIsOptimizeModalVisible] = useState(false);
  const [optimizeProgress, setOptimizeProgress] = useState(0);
  const [isOptimizeComplete, setIsOptimizeComplete] = useState(false);
  const navigate = useNavigate();
  const [managerId, setManagerId] = useState(null);

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const result = await dispatch(searchUsers("manager"));
        const manager = result.find((user) => user.role?.id === 3);
        if (manager) {
          setManagerId(manager.id);
        }
      } catch (error) {
        console.error("Failed to fetch manager:", error);
      }
    };

    fetchManager();
  }, [dispatch]);

  // Transform data for table display
  const tableData = useMemo(() => {
    if (!plans?.data || !Array.isArray(plans.data)) {
      return [];
    }

    // Filter data based on activeTab if not on "all" tab
    const filteredData =
      activeTab === "all"
        ? plans.data
        : plans.data.filter((plan) => plan.status === activeTab);

    return filteredData.map((plan) => ({
      key: plan.id,
      id: plan.id,
      createdDate: moment(plan.createdAt).format("YYYY-MM-DD"),
      deadline: moment(plan.deadline).format("YYYY-MM-DD"),
      demand: plan.demand,
      destination: plan.destination,
      priority:
        plan.priority === 1 || plan.priority === "1" || plan.priority === "High"
          ? "High"
          : "Low",
      status: plan.status,
    }));
  }, [plans?.data, activeTab]);

  useEffect(() => {
    dispatch(fetchFilterPlans(currentPage, pageSize, currentFilters));
  }, [dispatch, currentPage, pageSize, currentFilters]);

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    getCheckboxProps: (record) => ({
      disabled: !["draft", "rejected"].includes(record.status),
      title: !["draft", "rejected"].includes(record.status)
        ? "Only Draft or Rejected plans can be edited"
        : "",
    }),
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  const showModal = () => {
    setIsModalVisible(true);
    setIsUploadModalVisible(false);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleRowsChange = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPageSize(newPageSize);
    setCurrentPage(1);
    dispatch(fetchFilterPlans(1, newPageSize, currentFilters));
  };

  const toggleDetailedFilter = () => {
    setIsDetailedFilterVisible(!isDetailedFilterVisible);
  };

  // Function to fetch autocomplete predictions
  const fetchPredictions = async (input) => {
    if (!input) {
      setPredictions([]); // Clear predictions if input is empty
      return;
    }

    const response = await fetch(
      `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${input}&key=${
        import.meta.env.VITE_GOMAPS_API_KEY
      }&components=country:vn`
    );
    const data = await response.json();
    setPredictions(data.predictions || []);
  };

  const resetFormFields = () => {
    setDemandInput("");
    setDestination("");
    setDeadlineInput("");
    setPriorityInput("Low");
  };

  const handleAddOneDirectly = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);

    if (!demandInput || !destination || !deadlineInput || !modalPriorityInput) {
      notification.warning({
        message: "Missing Fields",
        description: "Please fill in all required fields.",
        placement: "topRight",
      });
      return;
    }

    const demandValue = parseFloat(demandInput);
    if (isNaN(demandValue) || demandValue <= 0) {
      notification.warning({
        message: "Invalid Demand",
        description: "Demand must be a valid number greater than zero.",
        placement: "topRight",
      });
      return;
    }

    try {
      const planData = {
        plannerId: user.user_id,
        managerId: managerId,
        deadline: deadlineInput,
        destination: destination,
        priority: modalPriorityInput === "High" ? 1 : 0,
        demand: demandValue,
      };
      await dispatch(doAddPlan(planData));

      await dispatch(fetchFilterPlans(currentPage, pageSize));

      notification.success({
        message: "Success",
        description: "Plan added successfully",
        placement: "topRight",
      });

      // Close modals and reset form
      setIsModalVisible(false);
      setIsSecondModalVisible(false);
      resetFormFields();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to add plan",
        placement: "topRight",
      });
    }
  };

  const showUploadModal = () => {
    setIsUploadModalVisible(true);
    setIsModalVisible(false);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalVisible(false);
  };

  const handleDeletePlans = () => {
    if (selectedRowKeys.length === 0) {
      // Show notification if no plans are selected
      notification.warning({
        message: "No Plans Selected",
        description: "Please select at least one plan to withdraw.",
        placement: "topRight",
      });
      return;
    }
    setIsDeleteModalVisible(true);
  };

  const confirmDeletePlans = async () => {
    try {
      // Call the delete action with selected IDs
      await dispatch(deletePlans(selectedRowKeys));

      // Show success notification
      notification.success({
        message: "Success",
        description: "Selected plans have been deleted successfully",
        placement: "topRight",
      });

      // Clear selection and close modal
      setSelectedRowKeys([]);
      setIsDeleteModalVisible(false);

      // Refresh the plans list
      dispatch(fetchFilterPlans(currentPage, pageSize));
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to delete plans",
        placement: "topRight",
      });
    }
  };

  const cancelDeletePlans = () => {
    setIsDeleteModalVisible(false);
  };

  // Function to handle editing selected plans
  const handleEditPlans = () => {
    if (selectedRowKeys.length === 0) {
      notification.warning({
        message: "No Plans Selected",
        description: "Please select at least one plan to edit.",
        placement: "topRight",
      });
      return;
    }

    // Get the selected plans data
    const selectedPlans = plans.data.filter((plan) =>
      selectedRowKeys.includes(plan.id)
    );

    // Set the edit data for displaying IDs
    setEditData(selectedPlans);

    // Initialize form with first selected plan's data
    const firstPlan = selectedPlans[0];
    setSingleEditPlan({
      demand: firstPlan.demand,
      destination: firstPlan.destination,
      deadline: firstPlan.deadline,
      priority: firstPlan.priority,
      createdDate: firstPlan.createdDate,
    });

    setIsEditModalVisible(true);
  };

  const handleOptimizePlan = async () => {
    if (selectedRowKeys.length === 0) {
      notification.warning({
        message: "No Plan Selected",
        description: "Please select a plan to optimize.",
        placement: "topRight",
      });
      return;
    }

    if (selectedRowKeys.length > 1) {
      notification.warning({
        message: "Multiple Selection",
        description: "Please select only one plan to optimize.",
        placement: "topRight",
      });
      return;
    }

    try {
      const selectedPlan = tableData.find(
        (plan) => plan.key === selectedRowKeys[0]
      );

      if (!selectedPlan) {
        throw new Error("Selected plan not found");
      }

      if (selectedPlan.status !== "draft") {
        notification.warning({
          message: "Invalid Plan Status",
          description: "Only plans with 'Draft' status can be optimized.",
          placement: "topRight",
        });
        return;
      }

      setIsOptimizeModalVisible(true);
      setOptimizeProgress(0);
      setIsOptimizeComplete(false);

      const progressInterval = setInterval(() => {
        setOptimizeProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 1000);

      const result = await dispatch(
        optimizePlan({
          id: selectedPlan.id,
          destination: selectedPlan.destination,
          deadline: selectedPlan.deadline,
          demand: selectedPlan.demand,
          priority: selectedPlan.priority,
        })
      );
      console.log(result);

      // Clear interval and set complete
      clearInterval(progressInterval);
      setOptimizeProgress(100);
      setIsOptimizeComplete(true);

      // Close modal

      setIsOptimizeModalVisible(false);
      notification.success({
        message: "Optimization Success",
        description: "You will be navigated to optimization page in 2 seconds",
        placement: "topRight",
        onClose: () => {
          navigate("/optimization");
        },
      });
    } catch (error) {
      setIsOptimizeModalVisible(false);
      notification.error({
        message: "Optimization Failed",
        description: error.message || "Failed to optimize plan.",
        placement: "topRight",
      });
    }
  };

  const handleShowAddOneModal = () => {
    setIsModalVisible(false);
    setIsSecondModalVisible(true);
    setIsFormSubmitted(false);
  };

  // Handle date type change
  const handleDateTypeChange = (type) => {
    setDateType(type);
    setActiveTimeFrame(null);
    setDateRange([null, null]);
  };

  const handleTimeFrameChange = (timeFrame) => {
    if (timeFrame === activeTimeFrame) {
      setActiveTimeFrame(null);
      return;
    }

    setActiveTimeFrame(timeFrame);

    const today = dayjs();
    let startDate;
    const endDate = dateRange?.[1] ? dayjs(dateRange[1]) : today;
    const getToday = () => today.startOf("day");

    switch (timeFrame) {
      case "today":
        startDate = getToday();
        break;
      case "1week":
        startDate = getToday().subtract(1, "week").startOf("day");
        break;
      case "1month":
        startDate = getToday().subtract(1, "month").startOf("day");
        break;
      case "3months":
        startDate = getToday().subtract(3, "months").startOf("day");
        break;
      default:
        return;
    }

    setDateRange([startDate, endDate]);
  };

  // Handle apply filter
  const handleApplyFilter = () => {
    const filters = {};

    if (dateRange && dateRange[0] && dateRange[1]) {
      if (dateType === "createdDate") {
        filters.initialFrom = dateRange[0].format("YYYY-MM-DD");
        filters.initialTo = dateRange[1].format("YYYY-MM-DD");
      } else {
        filters.deadlineFrom = dateRange[0].format("YYYY-MM-DD");
        filters.deadlineTo = dateRange[1].format("YYYY-MM-DD");
      }
    }

    // Add other filters if they exist
    if (priorityInput) {
      filters.priority = priorityInput === "High" ? 1 : 0;
    }

    if (demandInput) {
      filters.demand = demandInput;
    }

    if (activeStatus && activeStatus !== "all") {
      filters.status = activeStatus;
    }

    setCurrentFilters(filters);
    dispatch(fetchFilterPlans(currentPage, pageSize, filters));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);

    if (!value.trim()) {
      dispatch(fetchFilterPlans(1, pageSize));
      return;
    }

    const timeoutId = setTimeout(() => {
      dispatch(searchPlans(value.trim()));
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleUpdatePlans = async (e) => {
    e.preventDefault();

    // Check if any plan has a status other than 'draft' or 'rejected'
    const hasInvalidStatus = editData.some(
      (plan) => !["draft", "rejected"].includes(plan.status)
    );

    if (hasInvalidStatus) {
      notification.warning({
        message: "Invalid Plan Status",
        description:
          "Only plans with 'Draft' or 'Rejected' status can be updated.",
        placement: "topRight",
      });
      return;
    }

    if (
      !singleEditPlan.demand ||
      !singleEditPlan.destination ||
      !singleEditPlan.deadline
    ) {
      notification.warning({
        message: "Missing Fields",
        description: "Please fill in all required fields.",
        placement: "topRight",
      });
      return;
    }

    if (Number(singleEditPlan.demand) <= 0) {
      notification.warning({
        message: "Invalid Demand",
        description: "Demand must be greater than zero.",
        placement: "topRight",
      });
      return;
    }

    try {
      const plansToUpdate = editData.map((plan) => ({
        id: plan.id,
        demand: singleEditPlan.demand,
        priority: singleEditPlan.priority,
        destination: singleEditPlan.destination,
        deadline: moment(singleEditPlan.deadline).format("YYYY-MM-DD"),
        // Set status to "draft" if current status is "rejected", otherwise keep current status
        status: plan.status === "rejected" ? "draft" : plan.status,
      }));

      await dispatch(updatePlans(plansToUpdate));

      notification.success({
        message: "Success",
        description: "Plans updated successfully",
        placement: "topRight",
      });

      // Clear selection and close modal
      setSelectedRowKeys([]);
      setIsEditModalVisible(false);

      // Refresh the plans list
      dispatch(fetchFilterPlans(currentPage, pageSize));
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to update plans",
        placement: "topRight",
      });
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      ["Deadline", "Demand", "Destination", "Priority"],
      ["5/15/2024", "100", "Ho Chi Minh City", "High"],
      ["12/25/2024", "75", "Ha Noi", "Low"],
      ["1/10/2025", "150", "Da Nang", "High"],
      ["3/15/2025", "200", "Can Tho", "Low"],
      ["4/20/2025", "125", "Bien Hoa", "High"],
    ];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(templateData);

    ws["!cols"] = [
      { width: 15 }, // Deadline
      { width: 15 }, // Demand
      { width: 30 }, // Destination
      { width: 10 }, // Priority
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Procurement Plans");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "procurement_plan_template.xlsx");
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const plans = jsonData.slice(1).map((row) => {
          let deadline;
          if (row[0]) {
            const dateValue = row[0];
            if (typeof dateValue === "string") {
              deadline = moment(dateValue, ["M/D/YYYY", "MM/DD/YYYY"]).format(
                "YYYY-MM-DD"
              );
            }
          }
          const priorityString = row[3]?.toString().trim();
          const priority = priorityString === "high" ? 1 : 0;

          return {
            plannerId: user.user_id,
            managerId: managerId,
            deadline: deadline,
            demand: row[1],
            destination: row[2],
            priority: priority,
          };
        });

        try {
          for (const plan of plans) {
            await dispatch(doAddPlan(plan));
          }

          notification.success({
            message: "Success",
            description: `${plans.length} plans have been added successfully`,
            placement: "topRight",
          });

          dispatch(fetchFilterPlans(currentPage, pageSize));
          handleCloseUploadModal();
        } catch (error) {
          console.error("API Error:", error);
          notification.error({
            message: "Error",
            description: error.message || "Failed to add plans",
            placement: "topRight",
          });
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("File Processing Error:", error);
      notification.error({
        message: "Error",
        description: "Failed to process Excel file",
        placement: "topRight",
      });
    }
  };

  const downloadCSV = () => {
    if (selectedRowKeys.length === 0) {
      notification.warning({
        message: "No Plans Selected",
        description: "Please select at least one plan to download.",
        placement: "topRight",
      });
      return;
    }

    const selectedPlans = tableData.filter((plan) =>
      selectedRowKeys.includes(plan.key)
    );

    const csvData = selectedPlans.map((plan) => ({
      ID: plan.id,
      "Created Date": plan.createdDate,
      Deadline: plan.deadline,
      Demand: plan.demand,
      Destination: plan.destination,
      Priority: plan.priority,
      Status: plan.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Plans");

    const csvBuffer = XLSX.write(workbook, { bookType: "csv", type: "array" });
    const blob = new Blob([csvBuffer], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "selected_plans.csv");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedRowKeys([]);

    // Reset filters
    setPriorityInput(null);
    setDateRange([null, null]);
    setActiveTimeFrame(null);
    setDateType("createdDate");
    setActiveStatus(null);

    const filters = tab === "all" ? {} : { status: tab };
    setCurrentFilters(filters); // Update current filters
    dispatch(fetchFilterPlans(1, pageSize, filters));
  };

  // get the header text based on activeTab
  const getHeaderText = (tab) => {
    switch (tab) {
      case "all":
        return "Manage Entire Plans";
      case "draft":
        return "Manage Draft Plans";
      case "pending":
        return "Manage Pending Plans";
      case "approved":
        return "Manage Approved Plans";
      case "rejected":
        return "Manage Rejected Plans";
      default:
        return "Manage Plans";
    }
  };

  return (
    <div className="min-h-screen">
      {/* <NavBarPlanner /> */}
      {/* Main Header Section */}
      <div className="px-4 sm:px-6 lg:px-10 py-4 bg-white mx-2 sm:mx-6 lg:mx-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <h1 className="text-orange-500 text-xl font-semibold">
              Automatic Dispatch
            </h1>
            <span className="hidden sm:block text-gray-400">|</span>
            <h2 className="text-black text-xl font-bold">
              {getHeaderText(activeTab)}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-4">
            <button
              className="border border-gray-300 text-sm font-bold text-[#8F96A9] px-4 py-2 rounded-md hover:bg-gray-100 flex items-center justify-center"
              onClick={downloadCSV}
            >
              <FaArrowDown className="mr-2 text-xs" /> Download CSV
            </button>
            <button
              className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-md hover:bg-orange-600 flex items-center justify-center"
              onClick={showModal}
            >
              <FaPlus className="mr-2 text-xs" /> Add Plan
            </button>
          </div>
        </div>
        <p className="text-gray-500 mt-2">
          This page allows you to{" "}
          {activeTab === "all"
            ? "manage all plans and check their status."
            : `manage ${activeTab} plans`}{" "}
        </p>
      </div>

      {/* Main Content Section */}
      <div className="px-4 sm:px-6 lg:px-10 py-4 bg-white mx-2 sm:mx-6 mt-6">
        {/* Tab Navigation - Make it scrollable on mobile */}
        <div className="overflow-x-auto">
          <div className="inline-flex rounded-md shadow-sm mb-4 min-w-max">
            <button
              type="button"
              className={`px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 ${
                activeTab === "all" ? "bg-gray-100 text-primary" : ""
              }`}
              onClick={() => handleTabChange("all")}
            >
              View Entire Plans
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 ${
                activeTab === "draft" ? "bg-gray-100 text-primary" : ""
              }`}
              onClick={() => handleTabChange("draft")}
            >
              View Draft Plans
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 ${
                activeTab === "pending" ? "bg-gray-100 text-primary" : ""
              }`}
              onClick={() => handleTabChange("pending")}
            >
              Manage Pending Plans
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 ${
                activeTab === "approved" ? "bg-gray-100 text-primary" : ""
              }`}
              onClick={() => handleTabChange("approved")}
            >
              Manage Approved Plans
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-e-lg ${
                activeTab === "rejected" ? "bg-gray-100 text-primary" : ""
              }`}
              onClick={() => handleTabChange("rejected")}
            >
              Manage Rejected Plans
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <form
              className="w-full lg:w-96"
              onSubmit={(e) => e.preventDefault()}
            >
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-[#8F96A9] sr-only"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 text-[#8F96A9] flex items-center ps-3 pointer-events-none">
                  <CiSearch />
                </div>
                <input
                  type="search"
                  id="default-search"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="block w-full p-2 ps-10 text-sm text-[#8F96A9] border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Please enter your ID plans, destination, etc."
                />
              </div>
            </form>
            <div className="flex gap-2">
              <button
                className="text-[#8F96A9] border border-gray-300 rounded-md px-2 py-2 flex items-center text-sm font-bold"
                onClick={toggleDetailedFilter}
              >
                <TiFilter className="mr-2" />
                Detailed Filter
              </button>
              <button
                className="text-primary border border-primary justify-center rounded-md px-2 py-2 flex items-center text-sm font-bold flex-1"
                onClick={handleApplyFilter}
                disabled={isLoading}
              >
                {isLoading ? "Applying..." : "Apply Filter"}
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Filter Section */}
        {isDetailedFilterVisible && (
          <div className="mt-4 space-y-4">
            {/* Inquiry Period */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <label className="text-gray-600 flex items-center whitespace-nowrap">
                Inquiry period
                <div className="relative group ml-2">
                  <div className="w-4 h-4 bg-gray-400 text-white rounded-full flex items-center justify-center cursor-pointer">
                    i
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 hidden group-hover:block bg-white text-primary text-xs rounded py-1 px-2 w-40 border border-gray-300">
                    Set the period for which you want to view the plan
                  </div>
                </div>
              </label>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="relative w-full sm:w-auto">
                  <select
                    className="w-full sm:w-auto border border-gray-300 text-sm px-4 py-2 pr-10 rounded-md focus:outline-none appearance-none"
                    value={dateType}
                    onChange={(e) => handleDateTypeChange(e.target.value)}
                  >
                    <option value="createdDate">Created Date</option>
                    <option value="deadline">Deadline</option>
                  </select>
                  <IoMdArrowDropdown className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-[1.8rem] mt-1" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* Time frame buttons - Make them wrap on smaller screens */}
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg flex-1 sm:flex-none ${
                      activeTimeFrame === "today"
                        ? "bg-orange-100 text-primary border-primary"
                        : ""
                    }`}
                    onClick={() => handleTimeFrameChange("today")}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg flex-1 sm:flex-none ${
                      activeTimeFrame === "1week"
                        ? "bg-orange-100 text-primary border-primary"
                        : ""
                    }`}
                    onClick={() => handleTimeFrameChange("1week")}
                  >
                    1 Week
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg flex-1 sm:flex-none ${
                      activeTimeFrame === "1month"
                        ? "bg-orange-100 text-primary border-primary"
                        : ""
                    }`}
                    onClick={() => handleTimeFrameChange("1month")}
                  >
                    1 Month
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg flex-1 sm:flex-none ${
                      activeTimeFrame === "3months"
                        ? "bg-orange-100 text-primary border-primary"
                        : ""
                    }`}
                    onClick={() => handleTimeFrameChange("3months")}
                  >
                    3 Months
                  </button>
                </div>

                <Space
                  direction="vertical"
                  size={12}
                  className="w-full sm:w-auto"
                >
                  <RangePicker
                    className="w-full sm:w-auto h-9"
                    value={dateRange}
                    onChange={(dates) => {
                      setDateRange(dates);
                      setActiveTimeFrame(null);
                      // Optionally, you can auto-apply filters when dates are cleared
                      if (!dates) {
                        const updatedFilters = { ...currentFilters };
                        if (dateType === "createdDate") {
                          delete updatedFilters.initialFrom;
                          delete updatedFilters.initialTo;
                        } else {
                          delete updatedFilters.deadlineFrom;
                          delete updatedFilters.deadlineTo;
                        }
                        setCurrentFilters(updatedFilters);
                        dispatch(
                          fetchFilterPlans(
                            currentPage,
                            pageSize,
                            updatedFilters
                          )
                        );
                      }
                    }}
                    placeholder={[
                      `Start ${
                        dateType === "createdDate" ? "Created Date" : "Deadline"
                      }`,
                      `End ${
                        dateType === "createdDate" ? "Created Date" : "Deadline"
                      }`,
                    ]}
                    allowClear={true}
                    format="YYYY-MM-DD"
                  />
                </Space>
              </div>
            </div>

            {/* Status and Priority Filters */}
            {activeTab === "all" && (
              <div className="mt-4 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-8">
                <div className="flex items-center space-x-2 whitespace-nowrap">
                  <label className="text-gray-600 flex items-center">
                    Plan Status
                    <div className="relative group ml-2">
                      <div className="w-4 h-4 bg-gray-400 text-white rounded-full flex items-center justify-center cursor-pointer">
                        i
                      </div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 hidden group-hover:block bg-white text-primary text-xs rounded py-1 px-2 w-40 border border-gray-300 z-10">
                        This is a plan status filter
                      </div>
                    </div>
                  </label>
                </div>
                <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                  <div
                    className="inline-flex rounded-md shadow-sm min-w-max"
                    role="group"
                  >
                    <button
                      type="button"
                      className={`px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-s-lg ${
                        activeStatus === "draft"
                          ? "bg-orange-100 text-primary border-primary"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveStatus(
                          activeStatus === "draft" ? null : "draft"
                        );
                      }}
                    >
                      Draft
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 ${
                        activeStatus === "pending"
                          ? "bg-orange-100 text-primary border-primary"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveStatus(
                          activeStatus === "pending" ? null : "pending"
                        );
                      }}
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 ${
                        activeStatus === "approved"
                          ? "bg-orange-100 text-primary border-primary"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveStatus(
                          activeStatus === "approved" ? null : "approved"
                        );
                      }}
                    >
                      Approved
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 ${
                        activeStatus === "rejected"
                          ? "bg-orange-100 text-primary border-primary"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveStatus(
                          activeStatus === "rejected" ? null : "rejected"
                        );
                      }}
                    >
                      Rejected
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4 flex space-x-8">
              <div className="flex items-center space-x-2">
                <label className="text-gray-600 flex items-center">
                  Plan Priority
                  <div className="relative group ml-2">
                    <div className="w-4 h-4 bg-gray-400 text-white rounded-full flex items-center justify-center cursor-pointer">
                      i
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 hidden group-hover:block bg-white text-primary text-xs rounded py-1 px-2 w-40 border border-gray-300">
                      This is a plan priority filter
                    </div>
                  </div>
                </label>
              </div>
              <div className="inline-flex rounded-md shadow-sm " role="group">
                <button
                  type="button"
                  className={`flex-1 px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-s-lg ${
                    priorityInput === "Low"
                      ? "bg-orange-100 text-primary border-primary"
                      : ""
                  }`}
                  onClick={() => {
                    setPriorityInput(priorityInput === "Low" ? null : "Low");
                  }}
                >
                  Low
                </button>
                <button
                  type="button"
                  className={`flex-1 px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-e-lg  ${
                    priorityInput === "High"
                      ? "bg-orange-100 text-primary border-primary"
                      : ""
                  }`}
                  onClick={() => {
                    setPriorityInput(priorityInput === "High" ? null : "High");
                  }}
                >
                  High
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Plans Summary and Actions */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mt-10 mb-5 text-gray-600 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span>Selected Plans: {selectedRowKeys.length}</span>
            <span className="text-gray-400">|</span>
            <span>Total Plans: {plans.total || 0}</span>
            <div className="relative inline-flex items-center">
              <select
                className="border border-gray-300 text-sm px-4 py-2 pr-8 rounded-md focus:outline-none appearance-none"
                onChange={handleRowsChange}
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

          <div className="flex flex-wrap gap-2">
            <button
              className="flex-1 sm:flex-none bg-orange-50 text-primary font-bold px-2 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-primary hover:text-white text-sm sm:text-base"
              onClick={handleOptimizePlan}
            >
              Optimize Based on Selected Plan
            </button>
            <button
              className="bg-white flex items-center text-[#8F96A9] border font-bold border-gray-300 px-2 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-gray-200 text-sm sm:text-base"
              onClick={handleDeletePlans}
            >
              <RiDeleteBack2Line className="mr-1 sm:mr-2 text-sm sm:text-base" />
              Withdraw Plan
            </button>
            <button
              className="bg-white text-[#8F96A9] border font-bold border-gray-300 px-2 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-gray-200 text-sm sm:text-base"
              onClick={handleEditPlans}
            >
              Edit Plan Information
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={tableData}
            loading={isLoading}
            locale={{
              emptyText: <CustomEmpty />,
            }}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: plans?.total || 0,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
                // Use the saved filters
                dispatch(fetchFilterPlans(page, size, currentFilters));
              },
            }}
            components={{
              header: {
                cell: (props) => (
                  <th
                    {...props}
                    style={{ backgroundColor: "#f0f0f0", color: "#000" }}
                  >
                    {props.children}
                  </th>
                ),
              },
            }}
            scroll={{ x: true }} // Enable horizontal scrolling
          />
        </div>
      </div>

      {/* Modals - Update modal widths for different screen sizes */}
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded shadow-lg relative w-full max-w-2xl mx-4">
            <button
              className="absolute top-2 right-2 text-gray-400 text-xl"
              onClick={handleCloseModal}
            >
              <IoMdClose />
            </button>
            <h2 className="text-xl text-center font-bold mb-10">
              Please select how you would like to add your order.
            </h2>
            <div className="flex space-x-4 justify-center mx-auto">
              <button
                className="flex flex-col items-center bg-white text-gray-600 w-72 h-48 px-4 py-2 justify-center rounded border border-gray-300 hover:border-green-500"
                onClick={showUploadModal}
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <FaFileExcel className="text-green-500 text-3xl" />
                </div>
                <span className="text-lg font-semibold">
                  Add multiple items to Excel
                </span>
              </button>
              <button
                className="flex flex-col items-center bg-white text-gray-600 w-72 h-48 px-4 py-2 justify-center rounded border border-gray-300 hover:border-blue-500"
                onClick={handleShowAddOneModal}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <IoIosCreate className="text-blue-500 text-3xl" />
                </div>
                <span className="text-lg font-semibold">Add one directly</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isSecondModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg relative w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white pt-5 px-4 sm:px-8 z-10">
              <h1 className="text-base text-gray-500 flex justify-between items-center">
                Add plan
                <IoMdClose
                  className="cursor-pointer text-gray-400 text-xl"
                  onClick={() => setIsSecondModalVisible(false)}
                />
              </h1>
              <hr className="my-5" />
            </div>

            <div className="px-4 sm:px-8 pb-8">
              <h2 className="text-xl text-left font-bold mb-5">
                Plan Information
              </h2>
              <form className="space-y-4" onSubmit={handleAddOneDirectly}>
                <div className="space-y-2">
                  <label className="block">Plan Creation Date</label>
                  <input
                    type="date"
                    value={new Date().toISOString().split("T")[0]}
                    className="border border-gray-300 rounded p-2 w-full"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <label className="block">Deadline</label>
                  <DatePicker
                    onChange={(date, dateString) =>
                      setDeadlineInput(dateString)
                    }
                    className={`border border-gray-300 rounded p-2 w-full ${
                      isFormSubmitted && !deadlineInput ? "border-red-500" : ""
                    }`}
                    placeholder="Select your deadline"
                    required
                    disabledDate={(current) =>
                      current && current < moment().startOf("day")
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="block">Demand</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={demandInput}
                    onChange={(e) => setDemandInput(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                    placeholder="Enter demand in tons"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block">Plan Priority</label>
                  <div
                    className="mt-2 mb-4 rounded-md shadow-sm w-full flex"
                    role="group"
                  >
                    <button
                      type="button"
                      className={`flex-1 px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-s-lg ${
                        modalPriorityInput === "Low"
                          ? "bg-orange-100 text-primary border-primary"
                          : ""
                      }`}
                      onClick={() => {
                        setModalPriorityInput("Low");
                      }}
                    >
                      Low
                    </button>
                    <button
                      type="button"
                      className={`flex-1 px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-e-lg  ${
                        modalPriorityInput === "High"
                          ? "bg-orange-100 text-primary border-primary"
                          : ""
                      }`}
                      onClick={() => {
                        setModalPriorityInput("High");
                      }}
                    >
                      High
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block">Destination</label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(event) => {
                      const value = event.target.value;
                      setDestination(value); // Update destination state directly
                      fetchPredictions(value); // Fetch predictions based on input
                    }}
                    className={`border border-gray-300 rounded p-2 w-full ${
                      isFormSubmitted && !destination ? "border-red-500" : ""
                    }`} // Highlight if empty on submit
                    placeholder="Enter your destination"
                  />
                  {predictions.length > 0 && (
                    <ul className="border border-gray-300 rounded mt-2 max-h-40 overflow-y-auto">
                      {predictions.map((prediction) => (
                        <li
                          key={prediction.place_id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setDestination(prediction.description);
                            setPredictions([]);
                          }}
                        >
                          {prediction.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSecondModalVisible(false);
                      resetFormFields(); // Reset form fields when closing modal
                      setIsFormSubmitted(false); // Reset form submitted state
                    }}
                    className="w-full sm:w-24 font-medium text-gray-400 border border-gray-300 px-4 py-2 rounded-lg"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className={`w-full sm:w-32 bg-primary/50 font-medium text-white px-4 py-2 rounded-lg 
                      hover:bg-primary ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isUploadModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-lg relative w-[40rem]">
            <button
              className="absolute top-2 right-2 text-gray-400 text-xl"
              onClick={handleCloseUploadModal}
            >
              <IoMdClose />
            </button>
            <h2 className="text-xl text-center font-bold mb-10">
              Please upload the procurement plan (.xlsx, .xls)
            </h2>
            <div className="flex flex-col items-center border border-gray-300 rounded p-5">
              <FaFileUpload className="text-primary w-9 h-9" />
              <span className="my-3 text-sm text-gray-500">
                Please drag and drop files here
              </span>
              <label className="border border-gray-300 rounded p-2 mb-4 cursor-pointer text-xs text-gray-500 hover:bg-gray-50">
                Browse on my PC
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            <p className="text-center mt-4">
              Don&apos;t have the template? Click the button below to download
              it.
            </p>
            <div className="flex justify-center">
              <button
                className="mt-2 text-primary font-medium underline hover:text-primary/80"
                onClick={downloadTemplate}
              >
                Download Procurement Plan Template
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 text-xl"
              onClick={() => setIsEditModalVisible(false)}
            >
              <IoMdClose />
            </button>

            <div className="p-6">
              <h2 className="text-xl text-center font-bold mb-6">
                Edit Selected Plans
              </h2>

              <div className="mb-6">
                <h3 className="font-semibold">Editing Plans:</h3>
                <div className="mt-2 text-sm text-gray-600 break-words">
                  {editData.map((plan, index) => (
                    <span key={plan.key}>
                      {plan.id}
                      {index < editData.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              </div>

              <form className="space-y-4">
                {singleEditPlan && (
                  <>
                    <div className="space-y-2">
                      <label className="block">Deadline</label>
                      <DatePicker
                        defaultValue={
                          singleEditPlan.deadline
                            ? dayjs(singleEditPlan.deadline, "YYYY-MM-DD")
                            : null
                        }
                        onChange={(date) => {
                          setSingleEditPlan((prev) => ({
                            ...prev,
                            deadline: date ? date.format("YYYY-MM-DD") : null,
                          }));
                        }}
                        className="border border-gray-300 rounded p-2 w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block">Priority</label>
                      <select
                        value={singleEditPlan.priority}
                        onChange={(e) => {
                          setSingleEditPlan((prev) => ({
                            ...prev,
                            priority: e.target.value,
                          }));
                        }}
                        className="border border-gray-300 rounded p-2 w-full"
                      >
                        <option value="High">High</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block">Demand</label>
                      <input
                        type="number"
                        min="1"
                        value={singleEditPlan.demand}
                        onChange={(e) => {
                          setSingleEditPlan((prev) => ({
                            ...prev,
                            demand: e.target.value,
                          }));
                        }}
                        className="border border-gray-300 rounded p-2 w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block">Destination</label>
                      <input
                        type="text"
                        value={singleEditPlan.destination}
                        onChange={(e) => {
                          setSingleEditPlan((prev) => ({
                            ...prev,
                            destination: e.target.value,
                          }));
                        }}
                        className="border border-gray-300 rounded p-2 w-full"
                      />
                    </div>
                  </>
                )}

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditModalVisible(false)}
                    className="w-full sm:w-24 font-medium text-gray-400 border border-gray-300 px-4 py-2 rounded-lg"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-32 bg-primary/50 font-medium text-white px-4 py-2 rounded-lg hover:bg-primary"
                    onClick={handleUpdatePlans}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg relative w-1/4">
            <h2 className="text-xl text-center font-bold mb-4">
              Confirm Deletion
            </h2>
            <p className="text-center mb-6">
              Are you sure you want to delete the selected plans?
            </p>
            <div className="flex justify-center">
              <button
                className="bg-primary hover:bg-orange-600 text-white px-4 py-2 w-28 rounded mr-5"
                onClick={confirmDeletePlans}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 w-28 rounded"
                onClick={cancelDeletePlans}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isOptimizeModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg relative w-80">
            <div className="flex flex-col items-center">
              <Progress
                type="circle"
                percent={optimizeProgress}
                size={80}
                strokeColor={{
                  "0%": "#ff8c00",
                  "100%": "#ff8c00",
                }}
              />
              <div className="mt-6">
                {!isOptimizeComplete ? (
                  <BouncyText text="Optimizing" />
                ) : (
                  <div className="text-primary font-bold text-xl">
                    Optimize Successfully
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
