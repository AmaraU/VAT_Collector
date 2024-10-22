import React, { useEffect, useRef, useState } from "react";
import styles from './FinReports.module.css';
import { getImageUrl } from "../../../../utils";
import axios from 'axios';
import Pagination from "../../../Components/Pagination/Pagination";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react";


export const FinReports = () => {

    const [ reports, setReports ] = useState([]);
    const [ period, setPeriod ] = useState('daily');
    const [ category, setCategory ] = useState('');
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ openCustom, setOpenCustom ] = useState(false);
    const { isOpen: isOpenReport, onOpen: onOpenReport, onClose: onCloseReport } = useDisclosure();
    const { isOpen: isOpenLoading, onOpen: onOpenLoading, onClose: onCloseLoading } = useDisclosure();
    const { isOpen: isOpenComplete, onOpen: onOpenComplete, onClose: onCloseComplete } = useDisclosure();
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

    const handleSubmit = () => {
        onCloseReport();
        onOpenLoading();
        setTimeout(() => onCloseLoading(), 5000);
        setTimeout(() => onOpenComplete(), 5000);
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
            
            <div className={styles.reportsHeader}>
                <h2>Reports</h2>
                <button onClick={onOpenReport}><img src={getImageUrl('generate.png')}/>Generate Report</button>
            </div>


            <div className={styles.tableDiv}>

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


        <Modal isCentered size='md' closeOnOverlayClick={false} isOpen={isOpenReport} onClose={onCloseReport} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader><h4 className={styles.formHeader}>Generate Report</h4></ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <form action="" className={styles.reportForm}>
                        <div className={styles.dates}>
                            <div>
                                <label htmlFor="from_date">From:</label>
                                <input type="date" name="from_date" id="" />
                            </div>

                            <div>
                                <label htmlFor="to_date">To:</label>
                                <input type="date" name="to_date" id="" />
                            </div>
                        </div>

                        <label htmlFor="format">Report Format</label>
                        <select name="format" id="">
                            <option value="">Select format</option>
                            <option value="">PDF (Portable Document Format)</option>
                            <option value="">CSV (Comma Separated Values)</option>
                            <option value="">XLSX (Microsoft Excel)</option>
                        </select>

                        <label htmlFor="account">Account</label>
                        <select name="account" id="">
                            <option value="">Select account</option>
                        </select>
                    </form>
                </ModalBody>

                <ModalFooter pt={2} borderTop='1px solid #DFE1E7'>
                    <button onClick={()=>handleSubmit('download')} className={styles.reportButton}>Generate</button>
                </ModalFooter>
            </ModalContent>
        </Modal>

        <Modal isCentered size='sm' closeOnOverlayClick={false} isOpen={isOpenLoading} onClose={onCloseLoading} >
            <ModalOverlay />
            <ModalContent alignItems='center' h='200px' maxHeight='80vh' justifyContent='center'>
                <Spinner color="#D94F00" h='48px' w='48px' thickness="4px" />
            </ModalContent>
        </Modal>

        <Modal isCentered size='md' closeOnOverlayClick={false} isOpen={isOpenComplete} onClose={onCloseComplete} >
            <ModalOverlay />
            <ModalContent>
                <ModalBody>
                    <div className={styles.complete}>
                        <img src={getImageUrl('success.svg')} alt="" />
                        <h3>Report Generated</h3>
                        <p>Your report is ready for download. Check your email inbox for details.</p>
                    </div>
                </ModalBody>
                <ModalFooter pt={2} borderTop='1px solid #DFE1E7'>
                    <button onClick={onCloseComplete} className={styles.completeButton}>Continue</button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}