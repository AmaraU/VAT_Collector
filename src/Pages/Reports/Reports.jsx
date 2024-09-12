import React, { useEffect, useRef, useState } from "react";
import styles from './Reports.module.css';
import Pagination from "../../Components/Pagination/Pagination";
import { getImageUrl } from "../../../utils";

export const Reports = () => {

    const [ period, setPeriod ] = useState('daily');
    const [ category, setCategory ] = useState('');
    const [ currentPage, setCurrentPage ] = useState(1);


    const reports = [
        {
            sn: 1,
            user: 'GTBank',
            type: 'Banking',
            amount: 34000,
            period: 'Daily'
        },
        {
            sn: 2,
            user: 'Glo',
            type: 'Telco',
            amount: 19800,
            period: 'Daily'
        },
        {
            sn: 3,
            user: 'Access Bank',
            type: 'Banking',
            amount: 12000,
            period: 'Monthly'
        },
        {
            sn: 4,
            user: 'First Bank',
            type: 'Banking',
            amount: 15400,
            period: 'Weekly'
        },
        {
            sn: 5,
            user: 'Airtel',
            type: 'Telco',
            amount: 24985,
            period: 'Daily'
        },
        {
            sn: 6,
            user: 'NNPC',
            type: 'Invoicing',
            amount: 40000,
            period: 'Weekly'
        },
        {
            sn: 7,
            user: 'GTBank',
            type: 'Banking',
            amount: 12020,
            period: 'Monthly'
        },
        {
            sn: 8,
            user: 'Mobile',
            type: 'Telco',
            amount: 19000,
            period: 'Monthly'
        },
        {
            sn: 6,
            user: 'NNPC',
            type: 'Invoicing',
            amount: 40000,
            period: 'Daily'
        },
        {
            sn: 7,
            user: 'GTBank',
            type: 'Banking',
            amount: 12020,
            period: 'Daily'
        },
        {
            sn: 8,
            user: 'Mobile',
            type: 'Telco',
            amount: 19000,
            period: 'Weekly'
        },
        {
            sn: 9,
            user: 'GTBank',
            type: 'Banking',
            amount: 3400,
            period: 'Daily'
        },
        {
            sn: 10,
            user: 'GTBank',
            type: 'Banking',
            amount: 3400,
            period: 'Weekly'
        },
        {
            sn: 11,
            user: 'GTBank',
            type: 'Banking',
            amount: 3400,
            period: 'Monthly'
        },
        {
            sn: 12,
            user: 'GTBank',
            type: 'Banking',
            amount: 3400,
            period: 'Daily'
        },
        {
            sn: 13,
            user: 'GTBank',
            type: 'Banking',
            amount: 3400,
            period: 'Weekly'
        },
        {
            sn: 14,
            user: 'Airtel',
            type: 'Telco',
            amount: 24985,
            period: 'Monthly'
        },
        {
            sn: 15,
            user: 'NNPC',
            type: 'Invoicing',
            amount: 40000,
            period: 'Daily'
        },
        {
            sn: 16,
            user: 'GTBank',
            type: 'Banking',
            amount: 12020,
            period: 'Monthly'
        },
        {
            sn: 17,
            user: 'Mobile',
            type: 'Telco',
            amount: 19000,
            period: 'Weekly'
        },
        {
            sn: 18,
            user: 'NNPC',
            type: 'Invoicing',
            amount: 40000,
            period: 'Daily'
        }
    ]

    const filteredReports = reports.filter(report => {
        return (
            (category === "" || report.type.toLowerCase() === category) &&
            (period === "" || report.period.toLowerCase() === period)
        )
    })

    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US').format(number);
    };



    return (
        <div className={styles.whole}>
            
            <div className={styles.reportsHeader}>
                <h2>Reports</h2>
                <button><img src={getImageUrl('generate.png')}/>Generate Report</button>
            </div>


            <div className={styles.tableDiv}>
                
                <div className={styles.choices}>
                    <div className={styles.categories}>
                        Category:
                        <button onClick={()=>setCategory('')} className={category === '' ? styles.active : ''}>All</button>
                        <button onClick={()=>setCategory('banking')} className={category === 'banking' ? styles.active : ''}>Banking</button>
                        <button onClick={()=>setCategory('telco')} className={category === 'telco' ? styles.active : ''}>Telco</button>
                        <button onClick={()=>setCategory('invoicing')} className={category === 'invoicing' ? styles.active : ''}>Invoicing</button>
                    </div>

                    <div className={styles.periods}>
                        Period:
                        <button onClick={()=>setPeriod('daily')} className={period === 'daily' ? styles.active : ''}>Daily</button>
                        <button onClick={()=>setPeriod('weekly')} className={period === 'weekly' ? styles.active : ''}>Weekly</button>
                        <button onClick={()=>setPeriod('monthly')} className={period === 'monthly' ? styles.active : ''}>Monthly</button>
                        <button onClick={()=>setPeriod('custom')} className={period === 'custom' ? styles.active : ''}>Custom</button>
                    </div>
                </div>

                <table className={styles.reportTable}>
                    <thead>
                        <th>SN</th>
                        <th>User</th>
                        <th>Type</th>
                        <th>Amount (Naira)</th>
                        <th>Period</th>
                    </thead>

                    <tbody>
                        {currentReports.map((log, index) => (
                            <tr key={index}>
                                <td>{log.sn < 10 ? `0` : ``}{log.sn}</td>
                                <td>{log.user}</td>
                                <td>{log.type}</td>
                                <td>{formatNumber(log.amount)}</td>
                                <td>{log.period}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination
                    currentData={filteredReports}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            </div>

        </div>
    )
}