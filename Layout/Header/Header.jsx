import React, { useState } from 'react';
import { Bell, MessageSquare, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SubComponents/SearchBar';
import NotificationPopup from './SubComponents/NotificationPopup';
import { userContext } from '../../../../utils/AppContexts';
import { useContext } from 'react';
import { useNotifications } from './SubComponents/useNotifications';
import { useContactMessages } from '../../CMS/hooks/cmsHooks';
import styles from './Header.module.css';

const Header = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [user] = useContext(userContext); // Extract for avatar loading
    
    const [showNotifications, setShowNotifications] = useState(false);
    
    // Fetch notifications
    const { data: notifData } = useNotifications();
    const unreadNotifs = notifData?.unreadCount || 0;

    // Fetch messages
    const { data: messages } = useContactMessages();
    const unreadMsgs = messages ? messages.filter(m => !m.seen).length : 0;

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(nextLang);
    };

    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <h2 className={styles.pageTitle}>{t('admin.sidebar.dashboard')}</h2>
                <SearchBar />
            </div>

            <div className={styles.rightSection}>
                {/* Communication and Alerts */}
                <div className={styles.iconGroup}>
                    <button className={styles.iconBtn} onClick={toggleLanguage} style={{fontWeight: 800, fontSize: '14px', color:'var(--primary-hover)'}}>
                        {i18n.language === 'ar' ? 'EN' : 'AR'}
                    </button>
                    <button className={styles.iconBtn} onClick={() => navigate('/admin/messages')} title={t('admin.header.messages', 'Messages')}>
                        <MessageSquare size={20} />
                        {unreadMsgs > 0 && <span className={styles.badge}>{unreadMsgs}</span>}
                    </button>
                    <div style={{ position: 'relative' }}>
                        <button 
                            className={styles.iconBtn} 
                            onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}
                            title={t('admin.header.notifications', 'Notifications')}
                        >
                            <Bell size={20} />
                            {unreadNotifs > 0 && <span className={`${styles.badge} ${styles.alert}`}>{unreadNotifs}</span>}
                        </button>
                        {showNotifications && <NotificationPopup onClose={() => setShowNotifications(false)} />}
                    </div>
                </div>

                <div className={styles.divider}></div>

                {/* Profile Controls */}
                <div className={styles.profileSection}>
                    <div className={styles.profileInfo}>
                        <span className={styles.name}>{user?.fullName || "Admin"}</span>
                        <span className={styles.role}>{t('admin.header.super_admin', 'Super Admin')}</span>
                    </div>
                    <img 
                        src={user?.avatarUrl || "https://ui-avatars.com/api/?name=Admin&background=00b4d8&color=fff"} 
                        alt="Admin" 
                        className={styles.avatar} 
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
