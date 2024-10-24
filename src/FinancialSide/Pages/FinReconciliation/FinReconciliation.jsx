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
    const [ variance, setVariance ] = useState(0);
    const [ bank, setBank ] = useState('');
    const [ date, setDate ] = useState('');
    const { isOpen: isOpenRecon, onOpen: onOpenRecon, onClose: onCloseRecon } = useDisclosure();
    const { isOpen: isOpenLoading, onOpen: onOpenLoading, onClose: onCloseLoading } = useDisclosure();
    const { isOpen: isOpenComplete, onOpen: onOpenComplete, onClose: onCloseComplete } = useDisclosure();
    const popupRef = useRef(null);

    // useEffect(() => {
    //     fetchData();
    // });

    // const fetchData = async () => {
    //     try {
    //         const result = await axios('https://connectedge.covenantmfb.com/FirsCollection.AP/api/reports/dashboard-vat-collections/');
    //         setReports(result.data.result.data);
    //         console.log(result.data.result.data);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    const recons = [
        {
            id: 'GT-00119402-201',
            commission_earned: 77391.45,
            user: 'Toluwani Ojo',
            wallet_balance: 15767876,
            date: '20-10-2024',
        },
        {
            id: 'GT-00119402-201',
            commission_earned: 63356.88,
            user: 'Adebayo Olufemi',
            wallet_balance: 21767876,
            date: '19-10-2024',
        },
        {
            id: 'GT-00119402-201',
            commission_earned: 12000.23,
            user: 'Chinaza Okeke',
            wallet_balance: 13456789,
            date: '18-10-2024',
        },
        {
            id: 'GT-00119402-201',
            commission_earned: 24985.41,
            user: 'Emeka Adedoyin',
            wallet_balance: 48912345,
            date: '17-10-2024',
        },
        {
            id: 'GT-00119402-201',
            commission_earned: 15400.89,
            user: 'Tolu Alabi',
            wallet_balance: 8912345,
            date: '16-10-2024',
        },
        {
            id: 'GT-00119402-201',
            commission_earned: 40000.76,
            user: 'Zainab Hassan',
            wallet_balance: 3456789,
            date: '15-10-2024',
        },
        {
            id: 'GT-00119402-201',
            commission_earned: 12020.54,
            user: 'Ngozi Uche',
            wallet_balance: 8901234,
            date: '03-10-2024',
        },
        {
            id: 'GT-00119402-201',
            commission_earned: 77391.45,
            user: 'Toluwani Ojo',
            wallet_balance: 15767876,
            date: '02-10-2024',
        },
        {
            id: 'GT-00119402-201',
            commission_earned: 63356.88,
            user: 'Adebayo Olufemi',
            wallet_balance: 21767876,
            date: '02-10-2024',
        },
        {
            id: 'GT-00119402-201',
            commission_earned: 77391.45,
            user: 'Chinaza Okeke',
            wallet_balance: 15767876,
            date: '01-10-2024',
        },
        {
            id: 'GT-00119402-201',
            commission_earned: 77391.45,
            user: 'Emeka Adedoyin',
            wallet_balance: 15767876,
            date: '01-10-2024',
        }
    ]


    // const filteredReports = reports.filter(report => {
    //     return (
    //         (category === "" || report.tenant.toLowerCase() === category) 
    //         // (period === "" || report.period.toLowerCase() === period)
    //     )
    // })

    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRecons = recons.slice(indexOfFirstItem, indexOfLastItem);

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
        if (bank === 'access') {
            setVariance(100000);
        } else if (bank === 'gtb') {
            setVariance(-10000);
        } else if (bank === 'polaris') {
            setVariance(-1000000);
        } else {
            setVariance(500);
        }
        setBank('');
        setDate('');
        onCloseRecon();
        onOpenLoading();
        setTimeout(() => onCloseLoading(), 5000);
        setTimeout(() => onOpenComplete(), 5000);
    }

    const handleBack = () => {
        onCloseComplete();
        onOpenRecon();
        setVariance(0);
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
                        <th>Transaction ID</th>
                        <th>Total Commission Earned</th>
                        <th>User</th>
                        <th>Total Wallet Balance</th>
                        <th>Date</th>
                    </thead>

                    <tbody>
                        {currentRecons.map((rec, index) => (
                            <tr key={index}>
                                <td>{index+1 < 10 ? `0` : ``}{index+1}</td>
                                <td>{rec.id}</td>
                                <td>{formatNumberDec(rec.commission_earned)}</td>
                                <td>{rec.user}</td>
                                <td>₦{formatNumberDec(rec.wallet_balance)}</td>
                                <td>{rec.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination
                    currentData={recons}
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
                    <form action="" className={styles.theForm}>

                        <label htmlFor="bank">Select Bank</label>
                        <select name="bank" id="" onChange={(e)=>setBank(e.target.value)}>
                            <option value="">Select bank</option>
                            <option value="access">Access Bank</option>
                            <option value="fidelity">Fidelity Bank</option>
                            <option value="fcmb">First City Monument Bank</option>
                            <option value="first">First Bank</option>
                            <option value="gtb">GT Bank</option>
                            <option value="union">Union Bank</option>
                            <option value="uba">UBA</option>
                            <option value="zenith">Zenith Bank</option>
                            <option value="keystone">Keystone Bank</option>
                            <option value="optimus">Optimus Bank</option>
                            <option value="polaris">Polaris Bank</option>
                        </select>

                        <label htmlFor="date">Date</label>
                        <input type="date" name="date" onChange={(e)=>setDate(e.target.value)} />

                        <div className={styles.formTotals}>
                            <p>Amount made:</p>
                            <p><b>{(date === '') || (bank === '') ? '...' : '₦' + formatNumberDec(51000000)}</b></p>
                        </div>

                        <label htmlFor="statement">Upload Statement</label>
                        <input type="file" name="statement" />

                    </form>
                </ModalBody>

                <ModalFooter pt={2} borderTop='1px solid #DFE1E7'>
                    <button onClick={handleSubmit} className={styles.reconcileButton}>Reconcile</button>
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
                <ModalHeader><button onClick={handleBack}><img src={getImageUrl('prevIcon.png')} style={{width: '18px'}}/></button></ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div className={`${styles.complete} ${variance > 0 ? styles.more : variance <= -1000000 ? styles.lesser : styles.less}`}>
                        <h4>Variance</h4>
                        <h3>₦{formatNumber(variance)}</h3>
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