import { Outlet } from "react-router";
import { ToastContainer, Slide } from "react-toastify";

export default function MainLayout() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Slide}
      />
      <Outlet />
    </>
  )
}