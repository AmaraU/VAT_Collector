import { Outlet } from 'react-router-dom';
import styles from '../../App.module.css';
import { FinHeader } from '../FinHeader/FinHeader';

export const FinDashboardLayout = () => {
    return (
        <>
        <FinHeader />
        <div className={styles.withHeader}>
            <Outlet />
        </div>
        </>
    );
}