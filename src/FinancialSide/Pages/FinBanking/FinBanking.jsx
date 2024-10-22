import React, { useEffect, useRef, useState } from "react";
import styles from './FinBanking.module.css'; 
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import axios from "axios";
import { getImageUrl } from "../../../../utils";
import Pagination from "../../../Components/Pagination/Pagination";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react";

ChartJS.register(LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export const FinBanking = () => {

    const [ openCustom, setOpenCustom ] = useState(false);
    const [ period, setPeriod ] = useState('daily');
    const [ modalType, setModalType ] = useState('daily');
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ showValues, setShowValues ] = useState(true);
    const { isOpen: isOpenLink, onOpen: onOpenLink, onClose: onCloseLink } = useDisclosure();
    const { isOpen: isOpenDownload, onOpen: onOpenDownload, onClose: onCloseDownload } = useDisclosure();
    const { isOpen: isOpenLoading, onOpen: onOpenLoading, onClose: onCloseLoading } = useDisclosure();
    const { isOpen: isOpenComplete, onOpen: onOpenComplete, onClose: onCloseComplete } = useDisclosure();
    const popupRef = useRef(null);


    const bankData = [
        {
            bank: 'First Bank',
            total_amount: 10235951.23,
            type: 'Corporate',
            account_number: 6678899900,
        },
        {
            bank: 'Guaranty Trust Bank',
            total_amount: 21235951.23,
            type: 'Corporate',
            account_number: 5566778899,
        },
        {
            bank: 'Access Bank',
            total_amount: 49522951.23,
            type: 'Corporate',
            account_number: 987654321,
        },
        {
            bank: 'FCMB',
            total_amount: 10235951.23,
            type: 'Corporate',
            account_number: 6678899900,
        },
    ];

    const summary = [
        {
            account: 'GTBank',
            type: 'Credit',
            amount: 34000000,
            count: 44011,
            date: '15-10-2024',
        },
        {
            account: 'Access Bank',
            type: 'Credit',
            amount: 17000000,
            count: 50576,
            date: '08-10-2024',
        },
        {
            account: 'First Bank',
            type: 'Credit',
            amount: 20000000,
            count: 45567,
            date: '01-10-2024',
        },
        {
            account: 'FCMB',
            type: 'Credit',
            amount: 34000000,
            count: 35321,
            date: '24-09-2024',
        },
        {
            account: 'Zenith Bank',
            type: 'Credit',
            amount: 8000000,
            count: 55441,
            date: '17-09-2024',
        },
        {
            account: 'Jaiz Bank',
            type: 'Credit',
            amount: 71500000,
            count: 42022,
            date: '10-09-2024',
        },
        {
            account: 'Providus Bank',
            type: 'Credit',
            amount: 34050000,
            count: 48111,
            date: '03-09-2024',
        },
        {
            account: 'Union Bank',
            type: 'Credit',
            amount: 8000000,
            count: 38712,
            date: '03-09-2024',
        },
        {
            account: 'Polaris Bank',
            type: 'Credit',
            amount: 34000000,
            count: 44011,
            date: '23-08-2024',
        },
        {
            account: 'Access Bank',
            type: 'Credit',
            amount: 34000000,
            count: 44011,
            date: '15-08-2024',
        },
        {
            account: 'First Bank',
            type: 'Credit',
            amount: 34000000,
            count: 44011,
            date: '14-08-2024',
        },
        {
            account: 'GTBank',
            type: 'Credit',
            amount: 34000000,
            count: 44011,
            date: '13-08-2024',
        },
    ]

    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US').format(number);
    };
    const formatNumberDec = (number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    };
    const formatNumber2Dec = (number) => {
        return number % 1 === 0
          ? new Intl.NumberFormat('en-US').format(number)
          : new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
    };

    // useEffect(() => {
    //     fetchData();
    // }, []);

    // const fetchData = async () => {
    //     try {
    //         const result = await axios('https://connectedge.covenantmfb.com/FirsCollection.AP/api/reports/dashboard-vat-collections/');
    //         setBankingData(result.data.result.data.filter(e => e.tenant.toLowerCase() === "banking"));
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    const groupByTenantNameAndCalculateTotal = (items) => {
        return items.reduce((acc, item) => {
          const key = item.tenantName;
          if (!acc[key]) {
            acc[key] = { totalValue: 0, items: [] };
          }
          acc[key].totalValue += item.vat;
          acc[key].items.push(item);
          return acc;
        }, {});
    };

    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSummary = summary.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    
    const setCustom = () => {
        setPeriod('custom');
        setOpenCustom(false);        
    }

    const copyToClipboard = (toCopy) => {
        navigator.clipboard.writeText(toCopy);
    }

    const handleSubmit = (type) => {
        setModalType(type)
        onCloseLink();
        onCloseDownload();
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
            
            <div className={styles.bankingHeader}>
                <h2>Banking</h2>

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


            <div className={styles.secondHeader}>
                <div className={styles.totalBal}>
                    <h5>Total balance</h5>
                    <div>
                        <h3>₦{showValues ? formatNumber2Dec(bankData.reduce((sum, item) => sum + item.total_amount, 0)) : '*********'}</h3>
                        <button onClick={()=>setShowValues(!showValues)}><img src={getImageUrl('show.svg')} alt="view" /></button>
                    </div>
                </div>

                <div className={styles.buttons}>
                    <button className={styles.buttonOne} onClick={onOpenComplete}><img src={getImageUrl('refresh.svg')} alt="refresh" /></button>
                    <button className={styles.buttonTwo} onClick={onOpenDownload}>
                        <img src={getImageUrl('orangeDownload.svg')} alt="" />
                        Download Statement
                    </button>
                    <button className={styles.buttonThree} onClick={onOpenLink}>
                        <img src={getImageUrl('whitePlus.svg')} alt="" />
                        Link Account
                    </button>
                </div>
            </div>


            <div className={styles.banksRow}>
                {bankData.map((bank, i) => (
                    <div className={styles.bankDiv} key={i}>
                        <div className={styles.header}>
                            <div>
                                <h6>TOTAL AMOUNT</h6>
                                <h5>₦{showValues ? formatNumber2Dec(bank.total_amount) : '*********'}</h5>
                            </div>
                            <p>{bank.type}</p>
                        </div>

                        <div className={styles.bankInfo}>
                            <img 
                                src={bank.bank.toLowerCase() === 'first bank' ? getImageUrl('firstBank.svg') :
                                    bank.bank.toLowerCase() === 'guaranty trust bank' ? getImageUrl('gtBank.svg') :
                                    bank.bank.toLowerCase() === 'access bank' ? getImageUrl('accessBank.svg') :
                                    bank.bank.toLowerCase() === 'fcmb' ? getImageUrl('fcmb.svg') :
                                    ""
                                }
                                className={styles.bankImg}
                            />
                            <div className={styles.infoText}>
                                <h4>{bank.bank}</h4>
                                <div>
                                    <p>{bank.account_number}</p>
                                    <p><b>Federal Inland Reveue Service</b></p>
                                    <button onClick={()=>copyToClipboard(bank.account_number)}><img src={getImageUrl('orangeCopy.svg')} alt="copy" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className={styles.summaryHeader}>Account Summary</h2>

            <div className={styles.tableDiv}>

                <table className={styles.summaryTable}>
                    <thead>
                        <th>SN</th>
                        <th>Account</th>
                        <th>Type</th>
                        <th>Total Amount</th>
                        <th>Transaction Count</th>
                        <th>Date</th>
                    </thead>

                    <tbody>
                        {currentSummary.map((sum, index) => (
                            <tr key={index}>
                                <td>{index+1 < 10 ? `0` : ``}{index+1}</td>
                                <td>{sum.account}</td>
                                <td className={sum.type === 'Credit' ? styles.credit : styles.debit }>{sum.type}</td>
                                <td>{formatNumber(sum.amount)}</td>
                                <td>{formatNumber(sum.count)}</td>
                                <td>{sum.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination
                    currentData={summary}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>


        <Modal isCentered size='sm' closeOnOverlayClick={false} isOpen={isOpenLink} onClose={onCloseLink} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader><h4 className={styles.linkHeader}>Link Account</h4></ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <form action="" className={styles.linkForm}>
                        <label htmlFor="type">Account Type</label>
                        <select name="type" id="">
                            <option value="">Select account type</option>
                        </select>

                        <label htmlFor="currency">Currency</label>
                        <select name="currency" id="">
                            <option value="">Select currency</option>
                        </select>

                        <label htmlFor="institution">Financial Institution</label>
                        <select name="institution" id="">
                            <option value="">Select institution</option>
                        </select>

                        <label htmlFor="acct_number">Account Number</label>
                        <input type="number" name="acct_number" id="" placeholder="e.g 9876543221"/>
                    </form>
                </ModalBody>

                <ModalFooter pt={2} borderTop='1px solid #DFE1E7'>
                    <button onClick={()=>handleSubmit('link')} className={styles.linkButton}>Add Account</button>
                </ModalFooter>
            </ModalContent>
        </Modal>

        <Modal isCentered size='md' closeOnOverlayClick={false} isOpen={isOpenDownload} onClose={onCloseDownload} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader><h4 className={styles.downloadHeader}>Download Statement</h4></ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <form action="" className={styles.downloadForm}>
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

                        <label htmlFor="format">Download Format</label>
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
                        {modalType === 'download' ? <h3>Your Statement Is Ready!</h3>
                        : modalType === 'link' ? <h3>Account Added</h3>
                        : ''}
                        {modalType === 'download' ? <p>Your statement has been downloaded. Check your downloads folder to view it.</p> : ''}
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