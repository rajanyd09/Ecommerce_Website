import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./pages/auth/Navigation";

const App = () => {
  return (
    <div className="flex">
      <ToastContainer />

      {/* Sidebar */}
      <Navigation />

      {/* Page Content */}
      <main className="flex-1 ml-[4%] xl:ml-[15%] p-4 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
