import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./pages/auth/Navigation";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const App = () => {
  return (
    <PayPalScriptProvider deferLoading={true}>
      <div className="flex bg-slate-900 min-h-screen">
        <ToastContainer />

        {/* Sidebar */}
        <Navigation />

        {/* Page Content */}
        <main className="flex-1 ml-[4%] xl:ml-[15%] p-4 transition-all duration-300 bg-slate-900">
          <Outlet />
        </main>
      </div>
    </PayPalScriptProvider>
  );
};

export default App;
