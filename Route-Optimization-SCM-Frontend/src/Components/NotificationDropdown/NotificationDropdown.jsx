import { useState } from "react";
import { useNotifications } from "../../contexts/NotificationContext";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import noti from "../../assets/Planner/noti.png";
const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, clearNotification } =
    useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.type === "highPriority") {
      navigate("/manager");
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="relative mr-5 inline-flex items-center p-3 text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-orange-600 focus:ring-2 focus:outline-none focus:ring-orange-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={noti}
          alt="Notifications"
          className="w-4 h-4 filter invert contrast-200 brightness-200"
        />
        {unreadCount > 0 && (
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-secondary border-2 border-white rounded-full -top-2 -end-2">
            {unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? "bg-orange-50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                        {notification.plan.details}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(
                          new Date(notification.timestamp),
                          "MMM d, yyyy HH:mm"
                        )}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(notification.id);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
