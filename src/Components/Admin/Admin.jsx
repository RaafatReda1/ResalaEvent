import AdminHeader from "./Components/AdminHeader/AdminHeader";
import AdminAside from "./Components/AdminAside/AdminAside";
import styles from "./Admin.module.css";
import { Route, Routes } from "react-router-dom";

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
            <Route path="/dashboard" element={<h1>Dashboard</h1>} />
            <Route path="/students" element={<h1>Students</h1>} />
            <Route path="/reports" element={<h1>Reports</h1>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
