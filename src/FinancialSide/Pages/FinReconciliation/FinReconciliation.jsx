import React, { useEffect, useRef, useState } from "react";
import styles from './FinReconciliation.module.css';
import { getImageUrl } from "../../../../utils";
import axios from 'axios';
import Pagination from "../../../Components/Pagination/Pagination";
import { Modal } from "@chakra-ui/react";


export const FinReconciliation = () => {

    const [ reports, setReports ] = useState([]);
    const [ period, setPeriod ] = useState('daily');
    const [ category, setCategory ] = useState('');
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ openCustom, setOpenCustom ] = useState(false);
    const popupRef = useRef(null);

    useEffect(() => {
        fetchData();
    });

    const fetchData = async () => {
        try {
            const result = await axios('https://connectedge.covenantmfb.com/FirsCollection.AP/api/reports/dashboard-vat-collections/');
            setReports(result.data.result.data);
            console.log(result.data.result.data);
        } catch (err) {
            console.log(err);
        }
    }


    const filteredReports = reports.filter(report => {
        return (
            (category === "" || report.tenant.toLowerCase() === category) 
            // (period === "" || report.period.toLowerCase() === period)
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
        <>
        <div className={styles.whole}>
            
            <div className={styles.reconHeader}>
                <h2>Reconciliation</h2>
                <button><img src={getImageUrl('whitePlus.svg')}/>Reconcile</button>
            </div>

            <div className={styles.totals}>
                <div className={styles.totalDiv}>
                    <h5>TOTAL ACCOUNT BALANCE</h5>
                    <h2>396,235,951.23</h2>
                </div>
                <div className={styles.totalDiv}>
                    <h5>TOTAL COMMISSIONS</h5>
                    <h2>195,540,965.88</h2>
                </div>
            </div>


            <div className={styles.tableDiv}>
                
                <div className={styles.choices}>
                    {/* <div className={styles.categories}>
                        Category:
                        <button onClick={()=>setCategory('')} className={category === '' ? styles.active : ''}>All</button>
                        <button onClick={()=>setCategory('banking')} className={category === 'banking' ? styles.active : ''}>Banking</button>
                        <button onClick={()=>setCategory('telcos')} className={category === 'telcos' ? styles.active : ''}>Telco</button>
                        <button onClick={()=>setCategory('invoicing')} className={category === 'invoicing' ? styles.active : ''}>Invoicing</button>
                    </div> */}

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

                <table className={styles.reportTable}>
                    <thead>
                        <th>SN</th>
                        <th>User</th>
                        <th>Type</th>
                        <th>Amount (Naira)</th>
                        <th>Period</th>
                    </thead>

                    <tbody>
                        {currentReports.map((rep, index) => (
                            <tr key={index}>
                                <td>{index+1 < 10 ? `0` : ``}{index+1}</td>
                                <td>{rep.tenantName}</td>
                                <td>{rep.tenant}</td>
                                <td>{formatNumber(rep.amount)}</td>
                                <td>{rep.period}</td>
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

        <Modal>

        </Modal>
        </>
    )
}