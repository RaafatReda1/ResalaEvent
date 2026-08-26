import AdminHeader from "./Components/AdminHeader/AdminHeader";
import AdminAside from "./Components/AdminAside/AdminAside";
import styles from "./Admin.module.css";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import AdminControls from "./Components/AdminControls/AdminControls";
import AdminReports from "./Components/AdminReports/AdminReports";
const Admin = () => {
  return (
    <div className={styles.adminWrapper}>
      {/* Sidebar */}
      <AdminAside />

      {/* Main content shell */}
      <div className={styles.mainContainer}>
        <AdminHeader />
        <div className={styles.contentArea}>
          {/* Dashboard content will be rendered here */}
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/students" element={<AdminControls />} />
            <Route path="/reports" element={<AdminReports />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
