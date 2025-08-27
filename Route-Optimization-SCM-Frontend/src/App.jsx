import { BrowserRouter as Router } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { useRef } from "react";
import AppContent from "./Components/Layout/AppContent";
import { SocketProvider } from "./contexts/SocketContext";
import { NotificationProvider } from "./contexts/NotificationContext";

function App() {
  const isLoading = useSelector((state) => state.account.isLoading);
  const firstRenderRef = useRef(true);

  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <SocketProvider>
      <NotificationProvider>
        <Router>
          {isLoading ? (
            <div style={style}>
              <HashLoader color={"#fd7e14"} loading={true} size={150} />
            </div>
          ) : (
            <AppContent firstRenderRef={firstRenderRef} />
          )}
        </Router>
      </NotificationProvider>
    </SocketProvider>
  );
}

export default App;
