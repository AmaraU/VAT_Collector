import React, { useEffect, useRef, useState } from "react";
import styles from './AuditLogs.module.css';
import { format } from 'date-fns';
import axios from 'axios';
import Pagination from "../../../Components/Pagination/Pagination";


export const AuditLogs = () => {

    const [ logs, setLogs ] = useState([]);
    const [ period, setPeriod ] = useState('daily');
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ openCustom, setOpenCustom ] = useState(false);
    const popupRef = useRef(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const result = await axios('https://connectedge.covenantmfb.com/FirsCollection.AP/api/reports/dashboard-vat-collections/');
            setLogs(result.data.result.data.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)));
        } catch (err) {
            console.log(err);
        }
    }


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

    const setCustom = () => {
        setPeriod('custom');
        setOpenCustom(false);        
    }

    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            setOpenCustom(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);


    return (
        <div className={styles.whole}>
            
            <div className={styles.auditLogsHeader}>
                <h2>Audit Logs</h2>

                <div className={styles.periods}>
                    Period:
                    <button onClick={()=>setPeriod('daily')} className={period === 'daily' ? styles.active : ''}>Daily</button>
                    <button onClick={()=>setPeriod('weekly')} className={period === 'weekly' ? styles.active : ''}>Weekly</button>
                    <button onClick={()=>setPeriod('monthly')} className={period === 'monthly' ? styles.active : ''}>Monthly</button>
                    <div>
                        <button onClick={()=>setOpenCustom(!openCustom)} className={period === 'custom' ? styles.active : ''}>Custom</button>
                        <div className={`${styles.closed} ${openCustom && styles.customDiv}`} ref={popupRef}>
                            <h4>CUSTOM PERIOD</h4>
                            <div className={styles.dates}>
                                <input type="date" />
                                <input type="date" />
                            </div>
                            <button onClick={setCustom}>Set Custom Date</button>
                        </div>
                    </div>
                </div>
            </div>


            <div className={styles.tableDiv}>
                <table className={styles.auditTable}>
                    <thead>
                        <th>SN</th>
                        <th>User</th>
                        <th>Type</th>
                        <th>Tax Type</th>
                        <th>Amount (Naira)</th>
                        <th>Date</th>
                        <th>Time</th>
                    </thead>

                    <tbody>
                        {currentLogs.map((log, index) => (
                            <tr key={index}>
                                <td>{index+1 < 10 ? `0` : ``}{index+1}</td>
                                <td>{log.tenantName}</td>
                                <td>{log.tenant}</td>
                                <td>VAT</td>
                                <td>{formatNumber(log.amount)}</td>
                                <td>{format(new Date(log.transactionDate), 'dd-MM-yyyy')}</td>
                                <td>{format(new Date(log.transactionDate), 'hh:mm a')}</td>
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