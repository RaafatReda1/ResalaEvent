import React from 'react'
import styles from "./AdminHeader.module.css"
const AdminHeader = () => {
  return (
    <header className={styles.headerContainer}>
        <div className={styles.profile}>profile</div>
        <div className={styles.logout}>LogOutBn</div>
        <div className={styles.notification}>Notification</div>
        <div className={styles.logo}>Logo</div>
    </header>
  )
}

export default AdminHeader