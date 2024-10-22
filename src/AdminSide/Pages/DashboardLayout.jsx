import { Outlet } from 'react-router-dom';
import styles from '../../App.module.css';
import { Header } from '../Header/Header';
// import { Header } from './FinancialSide/Components/FinHeader/Header';

export const DashboardLayout = () => {
    return (
        <>
        <Header />
        <div className={styles.withHeader}>
            <Outlet />
        </div>
        </>
    );
}