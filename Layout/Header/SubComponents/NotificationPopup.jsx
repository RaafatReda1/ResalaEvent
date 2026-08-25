import React, { useRef, useEffect } from 'react';
import { Truck, User, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useNotifications } from './useNotifications';
import styles from './NotificationPopup.module.css';

const NotificationPopup = ({ onClose }) => {
    const { t } = useTranslation();
    const { data, isLoading } = useNotifications();
    const popupRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const getIcon = (type, status) => {
        if (type === 'client') return <div className={styles.iconWrapper} style={{ background: '#e0f2fe', color: '#0ea5e9' }}><User size={16} /></div>;
        if (type === 'cancelled') return <div className={styles.iconWrapper} style={{ background: '#fee2e2', color: '#ef4444' }}><AlertCircle size={16} /></div>;
        if (status === 'delivered') return <div className={styles.iconWrapper} style={{ background: '#dcfce7', color: '#22c55e' }}><CheckCircle size={16} /></div>;
        return <div className={styles.iconWrapper} style={{ background: '#fef3c7', color: '#f59e0b' }}><Truck size={16} /></div>;
    };

    return (
        <div className={styles.popupWrapper} ref={popupRef}>
            <div className={styles.popupHeader}>
                <h3 className={styles.popupTitle}>{t('admin.header.notifications', 'Notifications')}</h3>
            </div>
            
            <div className={styles.popupBody}>
                {isLoading ? (
                    <div className={styles.loading}>{t('admin.header.loading_activity', 'Loading recent activity...')}</div>
                ) : !data || Object.keys(data.groupedEvents).length === 0 ? (
                    <div className={styles.empty}>{t('admin.header.no_notifications', 'No recent notifications.')}</div>
                ) : (
                    Object.entries(data.groupedEvents).map(([day, events]) => (
                        <div key={day} className={styles.dayGroup}>
                            <div className={styles.dayHeader}>{day}</div>
                            {events.map((evt) => (
                                <div key={`${evt.type}-${evt.id}-${evt.time}`} className={styles.notificationItem}>
                                    {getIcon(evt.type, evt.status)}
                                    <div className={styles.content}>
                                        <div className={styles.title}>{evt.title}</div>
                                        <div className={styles.subtitle}>{evt.subtitle}</div>
                                        <div className={styles.time}>{formatDistanceToNow(new Date(evt.time), { addSuffix: true })}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationPopup;
