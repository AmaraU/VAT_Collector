import React, { useEffect, useRef, useState } from "react";
import styles from './Overview.module.css';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);


export const Overview = () => {

    const [ period, setPeriod ] = useState('daily');
    const [ pieItems, setPieItems ] = useState([]);
    const [ lineItems, setLineItems ] = useState([]);
    const [ openCustom, setOpenCustom ] = useState(false);
    const [ updateIndex, setUpdateIndex ] = useState(0);

    const [ _data, setData ] = useState([]);
    const [ bankingData, setBankingData ] = useState([]);
    const [ telcosData, setTelcosData ] = useState([]);
    const [ invoicingData, setInvoicingData ] = useState([]);
    const [ banking, setBanking ] = useState([]);
    const [ telcos, setTelcos ] = useState([]);
    const [ invoicing, setInvoicing ] = useState([]);
    const popupRef = useRef(null);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await axios('https://41.78.157.3/FirsCollection.API/api/reports/dashboard');
            setData(result.data.result.data);
            
            setBankingData(result.data.result.data.summaryDetails.dashBoardReport[0]);
            setTelcosData(result.data.result.data.summaryDetails.dashBoardReport[1]);
            setInvoicingData(result.data.result.data.summaryDetails.dashBoardReport[2]);
            setBanking(result.data.result.data.summaryDetails.dashBoardReport[0].transactionDetails.sort((a, b) => a.totalAmount - b.totalAmount));
            setTelcos(result.data.result.data.summaryDetails.dashBoardReport[1].transactionDetails.sort((a, b) => a.totalAmount - b.totalAmount));
            setInvoicing(result.data.result.data.summaryDetails.dashBoardReport[2].transactionDetails.sort((a, b) => a.totalAmount - b.totalAmount));
        } catch (err) {
            console.log(err);
        }
    }

    const updates = [
        'Someone just made a transaction',
        'Someone else just made another transaction',
        'You guessed it. Another transaction.'
    ];

    
    const pieData = {
        labels: [ 'BANKING', "TELCOS", 'INVOICING' ],
        datasets: [
            {
                label: "",
                data: [ bankingData.totalVat, telcosData.totalVat, invoicingData.totalVat ],
                backgroundColor: [ '#4C72FA', '#FFBE4C', '#40C4AA'],
                borderWidth: 0,
            },
        ],
    };

    const pieOptions = {
        animation: {
            duration: 300,
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    
    const lineData = {
        labels: ['', '', '', '', '', '', ''],
        datasets: [
            {
                label: 'BANKING',
                data: [65000000, 22000000, 80000000, 81000000, 56000000, 55000000, 40000000],
                fill: false,
                borderColor: '#4C72FA',
                pointRadius: 0,
                borderWidth: 2,
            },
            {
                label: 'TELCOS/SME',
                data: [45000000, 49000000, 60000000, 43000000, 61000000, 35000000, 20000000],
                fill: false,
                borderColor: '#FFBE4C',
                pointRadius: 0,
                borderWidth: 2,
            },
            {
                label: 'INVOICING',
                data: [10000000, 35000000, 23000000, 65000000, 90000000, 15000000, 42000000],
                fill: false,
                borderColor: '#40C4AA',
                pointRadius: 0,
                borderWidth: 2,
            },
        ],
    };
    
    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: false,
                    text: 'Months',
                },
                ticks: {
                    callback: (value) => {return null},
                },
            },
            
            y: {
                title: {
                    display: true,
                },
                position: 'right',
                min: 1000000,
                max: 100000000,
                ticks: {
                    callback: (value) => {
                        if (value === 1000000) return '1M';
                        if (value === 100000000) return '100M';
                        return ''; 
                    },
                },
                grid: {
                    drawTicks: false,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };


    useEffect(() => {
        const chart = ChartJS.getChart('pieChart');
        if (chart) {
            const dataset = chart.data.datasets[0];
            const items = chart.data.labels.map((label, i) => ({
                label,
                value: dataset.data[i],
                color: dataset.backgroundColor[i],
            }));
            setPieItems(items);
        }
    }, [pieData]);

    useEffect(() => {
        const updateLineItems = () => {
            const chart = ChartJS.getChart('lineChart');
            if (chart) {
                const items = chart.data.datasets.map(dataset => ({
                    label: dataset.label,
                    color: dataset.borderColor,
                    value: dataset.data.reduce((acc, val) => acc + val, 0),
                }));
                setLineItems(items);
            }
        };
        updateLineItems();
    }, [lineData]);


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

    useEffect(() => {
        const interval = setInterval(() => {
            setUpdateIndex((prevIndex) => (prevIndex + 1) % updates.length);
        }, 10000);
        return() => clearInterval(interval);
    }, [updates.length]);


    return (
        <div className={styles.whole}>
            
            <div className={styles.overviewHeader}>
                <h2>Overview</h2>

                <div className={styles.updates}>
                    <div className={styles.slider}>{updates[updateIndex]}</div>
                </div>

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


            <div className={styles.threeRow}>
                <div className={styles.infoDiv} >
                    <h5>TODAY'S TRANSACTIONS</h5>
                    <h1>{formatNumber(_data.transactions)}</h1>
                </div>
                <div className={styles.infoDiv} >
                    <h5>TOTAL AMOUNT</h5>
                    <h1>{formatNumberDec(_data.totalDaily)}</h1>
                </div>
                <div className={styles.infoDiv} >
                    <h5>VAT GENERATED</h5>
                    <div className={styles.vatDiv}>
                        <h1>{formatNumberDec(_data.vatDaily)}</h1>
                        <div className={styles.percentage}>10%</div>
                    </div>
                </div>
            </div>

            <div className={styles.twoRow}>
                
                <div className={styles.lineDiv}>
                    <h5>USE CASES</h5>
                    <div style={{height: '310px', width: '100%'}}>
                        <Line data={lineData} options={lineOptions} id="lineChart" />
                    </div>
                    <div className={styles.lineLegend}>
                        {lineItems.map((item, index) => (
                            <div className={styles.lineLegendItem} key={index}>
                                <div className={styles.lineLegColor} style={{backgroundColor: item.color}}></div>
                                <p>{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className={styles.flexDiv}>
                    <div className={styles.pieDiv}>
                        <h5>TOP PERFORMERS</h5>
                        <div className={styles.pieChart}>
                            <div style={{maxWidth: '230px'}}>
                                <Pie data={pieData} options={pieOptions} id="pieChart" />
                            </div>
                            <div className={styles.pieLegend}>
                                {pieItems.map((item, index) => (
                                    <div className={styles.pieLegendItem} key={index}>
                                        <div className={styles.labelColor} style={{backgroundColor: item.color}}></div>
                                        <div>
                                            <p>{item.label}</p>
                                            <h6>{formatNumber(item.value)}</h6>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.ratingDiv}>
                        <h5>TOP RATINGS</h5>
                        
                        <div className={styles.ratings}>
                            <div className={styles.list}>
                                <h6>Banking</h6>
                                {banking.slice(0,5).map((bank, i) => (
                                    <p key={i}>{bank.name}</p>
                                ))}
                            </div>

                            <div className={styles.list}>
                                <h6>Telcos</h6>
                                {telcos.slice(0,5).map((tel, i) => (
                                    <p key={i}>{tel.name}</p>
                                ))}
                            </div>

                            <div className={styles.list}>
                                <h6>Invoicing</h6>
                                {invoicing.slice(0,5).map((invo, i) => (
                                    <p key={i}>{invo.name}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}