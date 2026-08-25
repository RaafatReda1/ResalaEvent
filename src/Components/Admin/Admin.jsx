import AdminHeader from "./Components/AdminHeader/AdminHeader";
import AdminAside from "./Components/AdminAside/AdminAside";
import styles from "./Admin.module.css";

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
          
        </div>
      </div>
    </div>
  );
};

export default Admin;
