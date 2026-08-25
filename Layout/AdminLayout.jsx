import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import { userContext } from '../../../utils/AppContexts';
import { useTranslation } from 'react-i18next';
import styles from './AdminLayout.module.css';
import { ReactLenis } from 'lenis/react';


const AdminLayout = () => {
    const [user] = React.useContext(userContext);
    const { t, i18n } = useTranslation();

    // Enforce LTR globally for the Admin panel (important for Modals/Portals)
    useEffect(() => {
        const originalDir = document.documentElement.dir;
        document.documentElement.dir = 'ltr';
        
        return () => {
            // Restore to current i18n direction when leaving Admin panel
            document.documentElement.dir = i18n.dir();
        };
    }, [i18n.language]);

    
    // Security layer 
    if (user.type !== 'admin') {
        return <Navigate to="/" />;
    }

    return (
        <div className={styles.adminWrapper} dir="ltr">
            <Sidebar />
            <div className={styles.mainContainer}>
                <Header />
                <ReactLenis className={styles.contentArea}>
                    <Outlet />
                </ReactLenis>

            </div>
        </div>
    );
};

export default AdminLayout;
