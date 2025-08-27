/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";
import { useSelector, useDispatch } from "react-redux";
import { fetchFilterPlans } from "../redux/action/plannerAction";

const NotificationContext = createContext();

const STORAGE_KEY = "notifications";

export const NotificationProvider = ({ children }) => {
  // Initialize state from localStorage
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const socket = useSocket();
  const user = useSelector((state) => state.account.userInfo);
  const dispatch = useDispatch();

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (socket && user) {
      const role = user.roleWithPermission?.name;

      if (role === "manager") {
        socket.on("highPriorityPlan", (data) => {
          setNotifications((prev) => [
            {
              id: Date.now(),
              type: "highPriority",
              message: data.message,
              plan: {
                ...data.plan,
                details: `Priority: High\nPlan ID: ${
                  data.plan.id
                }\nDestination: ${data.plan.destination}\nDeadline: ${new Date(
                  data.plan.deadline
                ).toLocaleDateString()}\nDemand: ${
                  data.plan.demand
                }\nPlanner: ${data.plan.planner}`,
              },
              timestamp: new Date().toISOString(),
              isRead: false,
            },
            ...prev,
          ]);

          dispatch(
            fetchFilterPlans(
              1,
              50,
              {
                status: ["pending", "approved", "rejected"],
              },
              ["priority", "DESC"]
            )
          );
        });
      } else if (role === "planner") {
        socket.on("planStatusChanged", (data) => {
          setNotifications((prev) => [
            {
              id: Date.now(),
              type: "statusChange",
              message: data.message,
              plan: {
                ...data.plan,
                details: `Plan ID: ${
                  data.plan.id
                }\nStatus: ${data.plan.status.toUpperCase()}\nDestination: ${
                  data.plan.destination
                }\nPriority: ${data.plan.priority === 1 ? "High" : "Normal"}`,
              },
              timestamp: new Date().toISOString(),
              isRead: false,
            },
            ...prev,
          ]);

          dispatch(fetchFilterPlans());
        });
      }
    }

    return () => {
      if (socket) {
        socket.off("highPriorityPlan");
        socket.off("planStatusChanged");
      }
    };
  }, [socket, user, dispatch]);

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const clearNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAsRead,
        clearNotification,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
