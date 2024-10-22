import React, { useEffect, useRef, useState } from "react";
import styles from './FinReconciliation.module.css';
import { getImageUrl } from "../../../../utils";
import axios from 'axios';
import Pagination from "../../../Components/Pagination/Pagination";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react";


export const FinReconciliation = () => {

    const [ reports, setReports ] = useState([]);
    const [ period, setPeriod ] = useState('daily');
    const [ category, setCategory ] = useState('');
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ openCustom, setOpenCustom ] = useState(false);
    const { isOpen: isOpenRecon, onOpen: onOpenRecon, onClose: onCloseRecon } = useDisclosure();
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
    const formatNumberDec = (number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    };

    const setCustom = () => {
        setPeriod('custom');
        setOpenCustom(false);        
    }

    const handleSubmit = () => {
        onCloseRecon();
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
            
            <div className={styles.reconHeader}>
                <h2>Reconciliation</h2>
                <button onClick={onOpenRecon}><img src={getImageUrl('whitePlus.svg')}/>Reconcile</button>
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

        <Modal isCentered size='md' closeOnOverlayClick={false} isOpen={isOpenRecon} onClose={onCloseRecon} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader><h4 className={styles.modalHeader}>Reconcile</h4></ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <div className={styles.modalForm}>

                        <div className={styles.formTotals}>
                            <p>Total Wallet Balance</p>
                            <p><b>₦{formatNumberDec(142000000)}</b></p>
                        </div>
                        <div className={styles.formTotals}>
                            <p>Total Commission Earned</p>
                            <p><b>₦{formatNumberDec(51000000)}</b></p>
                        </div>

                        <form action="" className={styles.theForm}>

                            <label htmlFor="unpaid">Unpaid Fund</label>
                            <input type="number" placeholder="Enter total unpaid amount" />

                            <label htmlFor="investment">Investment Fund</label>
                            <input type="number" placeholder="Enter amount in investments" />

                            <label htmlFor="format">Additional Charges</label>
                            <input type="number" placeholder="Enter other charges" />

                            <label htmlFor="format">Post Account Balance</label>
                            <input type="number" placeholder="Enter final account balance" />

                        </form>
                    </div>
                </ModalBody>

                <ModalFooter pt={2} borderTop='1px solid #DFE1E7'>
                    <button onClick={()=>handleSubmit('download')} className={styles.downloadButton}>Download</button>
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
                        <h3>Reconciliation Added</h3>
                        {/* {modalType === 'download' ? <p>Your statement has been downloaded. Check your downloads folder to view it.</p> : ''} */}
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