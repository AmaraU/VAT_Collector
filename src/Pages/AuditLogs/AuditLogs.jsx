import React, { useEffect, useRef, useState } from "react";
import styles from './AuditLogs.module.css';
import Pagination from "../../Components/Pagination/Pagination";

export const AuditLogs = () => {

    const [ period, setPeriod ] = useState('daily');
    const [ currentPage, setCurrentPage ] = useState(1);


    const logs = [
        {
            sn: 1,
            user: 'GTBank',
            type: 'Banking',
            amount: 34000,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 2,
            user: 'Glo',
            type: 'Telco',
            amount: 19800,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 3,
            user: 'Access Bank',
            type: 'Banking',
            amount: 12000,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 4,
            user: 'First Bank',
            type: 'Banking',
            amount: 15400,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 5,
            user: 'Airtel',
            type: 'Telco',
            amount: 24985,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 6,
            user: 'NNPC',
            type: 'Invoicing',
            amount: 40000,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 7,
            user: 'GTBank',
            type: 'Banking',
            amount: 12020,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 8,
            user: 'Mobile',
            type: 'Telco',
            amount: 19000,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 6,
            user: 'NNPC',
            type: 'Invoicing',
            amount: 40000,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 7,
            user: 'GTBank',
            type: 'Banking',
            amount: 12020,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 8,
            user: 'Mobile',
            type: 'Telco',
            amount: 19000,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 9,
            user: 'GTBank',
            type: 'Banking',
            amount: 3400,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 10,
            user: 'GTBank',
            type: 'Banking',
            amount: 3400,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 11,
            user: 'GTBank',
            type: 'Banking',
            amount: 3400,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 12,
            user: 'GTBank',
            type: 'Banking',
            amount: 3400,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 13,
            user: 'GTBank',
            type: 'Banking',
            amount: 3400,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 14,
            user: 'Airtel',
            type: 'Telco',
            amount: 24985,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 15,
            user: 'NNPC',
            type: 'Invoicing',
            amount: 40000,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 16,
            user: 'GTBank',
            type: 'Banking',
            amount: 12020,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 17,
            user: 'Mobile',
            type: 'Telco',
            amount: 19000,
            date: '03-09-2024',
            time: '12:32 pm'
        },
        {
            sn: 18,
            user: 'NNPC',
            type: 'Invoicing',
            amount: 40000,
            date: '03-09-2024',
            time: '12:32 pm'
        }
    ]

    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLogs = logs.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US').format(number);
    };


    return (
        <div className={styles.whole}>
            
            <div className={styles.auditLogsHeader}>
                <h2>Audit Logs</h2>

                <div className={styles.periods}>
                    Period:
                    <button onClick={()=>setPeriod('daily')} className={period === 'daily' ? styles.active : ''}>Daily</button>
                    <button onClick={()=>setPeriod('weekly')} className={period === 'weekly' ? styles.active : ''}>Weekly</button>
                    <button onClick={()=>setPeriod('monthly')} className={period === 'monthly' ? styles.active : ''}>Monthly</button>
                    <button onClick={()=>setPeriod('custom')} className={period === 'custom' ? styles.active : ''}>Custom</button>
                </div>
            </div>


            <div className={styles.tableDiv}>
                <table className={styles.auditTable}>
                    <thead>
                        <th>SN</th>
                        <th>User</th>
                        <th>Type</th>
                        <th>Amount (Naira)</th>
                        <th>Date</th>
                        <th>Time</th>
                    </thead>

                    <tbody>
                        {currentLogs.map((log, index) => (
                            <tr key={index}>
                                <td>{log.sn < 10 ? `0` : ``}{log.sn}</td>
                                <td>{log.user}</td>
                                <td>{log.type}</td>
                                <td>{formatNumber(log.amount)}</td>
                                <td>{log.date}</td>
                                <td>{log.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination
                    currentData={logs}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            </div>

        </div>
    )
}