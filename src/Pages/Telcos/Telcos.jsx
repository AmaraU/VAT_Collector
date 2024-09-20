import React, { useEffect, useRef, useState } from "react";
import styles from './Telcos.module.css';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import axios from "axios";

ChartJS.register(LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export const Telcos = () => {

    const [ period, setPeriod ] = useState('daily');
    const [ pieItems, setPieItems ] = useState([]);
    const [ lineItems, setLineItems ] = useState([]);
    const [ openCustom, setOpenCustom ] = useState(false);
    const [ telcosData, setTelcosData ] = useState([]);
    const [ telcos, setTelcos ] = useState([]);
    const [ pieTelcos, setPieTelcos ] = useState([]);
    const popupRef = useRef(null);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await axios('https://connectedge.covenantmfb.com/FirsCollection.AP/api/reports/dashboard/');
            
            setTelcosData(result.data.result.data.summaryDetails.dashBoardReport[1]);
            setTelcos(result.data.result.data.summaryDetails.dashBoardReport[1].transactionDetails.sort((a, b) => b.totalVat - a.totalVat));
            setPieTelcos(result.data.result.data.summaryDetails.dashBoardReport[1].transactionDetails.sort((a, b) => b.totalVat - a.totalVat).slice(0,3));
        
        } catch (err) { console.log(err); }
    }

    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US').format(number);
    };
    const formatNumberDec = (number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    };
    
    const pieData = {
        labels: pieTelcos.map(item => item.name.toUpperCase()),
        datasets: [
            {
                data: period === 'daily' ? pieTelcos.map(item => item.totalVat)
                    : period === 'weekly' ? pieTelcos.map(item => item.totalVat*7)
                    : period === 'monthly' ? pieTelcos.map(item => item.totalVat*30)
                    : pieTelcos.map(item => item.totalVat*30),
                backgroundColor: [ '#4C72FA', '#FFBE4C', '#40C4AA' ],
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
        datasets: telcos.map((telco, index) => ({
            label: telco.name.toUpperCase(),
            data: 
                index === 0 ? [65000000, 22000000, 76000000, 81000000, 56000000, 55000000, 40000000] :
                index === 1 ? [45000000, 49000000, 60000000, 43000000, 61000000, 35000000, 20000000] :
                index === 2 ? [10000000, 35000000, 23000000, 65000000, 90000000, 15000000, 42000000] :
                index === 3 ? [43000000, 15000000, 80000000, 60000000, 35000000, 65000000, 90000000] :
                []
            ,
            fill: false,
            borderColor: [ '#4C72FA', '#FFBE4C', '#40C4AA', '#DF1C41' ][index],
            pointRadius: 0,
            borderWidth: 2,
        }))
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
            
            <div className={styles.telcosHeader}>
                <h2>Telcos</h2>

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
                    <h5>
                        {period === 'daily' ? "TODAY'S "
                        : period === 'weekly' ? "THIS WEEK'S "
                        : period === 'monthly' ? "THIS MONTH'S "
                        : ""}
                        TRANSACTIONS
                    </h5>
                    <h1>
                        {formatNumber(period === 'daily' ? telcosData.totalDailyTransaction
                                    : period === 'weekly' ? telcosData.totalDailyTransaction*7
                                    : period === 'monthly' ? telcosData.totalDailyTransaction*30
                                    : telcosData.totalDailyTransaction
                        )}
                    </h1>
                </div>
                <div className={styles.infoDiv} >
                    <h5>TOTAL AMOUNT</h5>
                    <h1>
                        {formatNumberDec(period === 'daily' ? telcos.reduce((sum, item) => sum + item.totalAmount, 0)
                                    : period === 'weekly' ? telcos.reduce((sum, item) => sum + item.totalAmount, 0)*7
                                    : period === 'monthly' ? telcos.reduce((sum, item) => sum + item.totalAmount, 0)*30
                                    : telcos.reduce((sum, item) => sum + item.totalAmount, 0)
                        )}
                    </h1>
                </div>
                <div className={styles.infoDiv} >
                    <h5>VAT GENERATED</h5>
                    <div className={styles.vatDiv}>
                        <h1>
                            {formatNumberDec(period === 'daily' ? telcosData.totalDailyVat
                                        : period === 'weekly' ? telcosData.totalDailyVat*7
                                        : period === 'monthly' ? telcosData.totalDailyVat*30
                                        : telcosData.totalDailyVat
                            )}
                        </h1>
                        <div className={styles.percentage}>10%</div>
                    </div>
                </div>
            </div>

            <div className={styles.twoRow}>
                
                <div className={styles.lineDiv}>
                    <h5>USE CASES</h5>
                    <div style={{height: '300px'}}>
                        <Line data={lineData} options={lineOptions} id="lineChart" />
                    </div>
                    <div className={styles.lineLegend}>
                        {lineItems.map((item, index) => (
                            <div className={styles.lineLegendItem}>
                                <div className={styles.lineLegColor} style={{backgroundColor: item.color}}></div>
                                <p>{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className={styles.pieDiv}>
                    <h5>TOP PERFORMERS</h5>
                    <div className={styles.pieChart}>
                        <div style={{maxWidth: '250px'}}>
                            <Pie data={pieData} options={pieOptions} id="pieChart" />
                        </div>
                        <div>
                            {pieItems.map((item, index) => (
                                <div className={styles.legend} key={index}>
                                    <div className={styles.labelColor} style={{backgroundColor: item.color}}></div>
                                    <div>
                                        <p>{item.label}</p>
                                        <h5>{formatNumber(item.value)}</h5>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}