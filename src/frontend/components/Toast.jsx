import { toast } from "react-toastify";

// Custom Toast Component
const ErrorToast = ({ message }) => (
  <div
    style={{
      backgroundColor: "#1e1e1e",
      borderRadius: "8px",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }}
  >
    ⚠️ {message}
  </div>
);

const SuccessToast = ({ message }) => (
  <div
    style={{
      backgroundColor: "#1e1e1e",
      borderRadius: "8px",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }}
  >
    ✅ {message}
  </div>
);

// Reduce toast size on smaller screens
const customToastContainerStyle = {
  "@media (maxWidth: 480px)": {
    width: "180px !important", // Make it smaller on mobile
    fontSize: "12px", // Reduce text size
    padding: "6px 10px",
  },
};

// Apply this to <ToastContainer />
export { ErrorToast, SuccessToast, customToastContainerStyle };
