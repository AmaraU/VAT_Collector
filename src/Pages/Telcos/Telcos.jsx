import React, { useEffect, useRef, useState } from "react";
import styles from './Telcos.module.css';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export const Telcos = () => {

    const [ period, setPeriod ] = useState('daily');
    const [ pieItems, setPieItems ] = useState([]);
    const [ lineItems, setLineItems ] = useState([]);
    const [ openCustom, setOpenCustom ] = useState(false);
    const popupRef = useRef(null);

    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US').format(number);
    };
    
    const pieData = {
        labels: ['Glo', 'Airtel', 'MTN'],
        datasets: [
            {
                label: "",
                data: [547954, 253977, 203977],
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
                label: 'AIRTEL',
                data: [65000000, 22000000, 80000000, 81000000, 56000000, 55000000, 40000000],
                fill: false,
                borderColor: '#4C72FA',
                pointRadius: 0,
                borderWidth: 2,
            },
            {
                label: 'MTN',
                data: [45000000, 49000000, 60000000, 43000000, 61000000, 35000000, 20000000],
                fill: false,
                borderColor: '#FFBE4C',
                pointRadius: 0,
                borderWidth: 2,
            },
            {
                label: 'GLO',
                data: [10000000, 35000000, 23000000, 65000000, 90000000, 15000000, 42000000],
                fill: false,
                borderColor: '#40C4AA',
                pointRadius: 0,
                borderWidth: 2,
            },
            {
                label: '9MOBILE',
                data: [43000000, 15000000, 80000000, 60000000, 35000000, 65000000, 90000000],
                fill: false,
                borderColor: '#DF1C41',
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
    }, []);

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
                    <h5>TODAY'S TRANSACTIONS</h5>
                    <h1>1,540,965</h1>
                </div>
                <div className={styles.infoDiv} >
                    <h5>TOTAL AMOUNT</h5>
                    <h1>396,235,951.23</h1>
                </div>
                <div className={styles.infoDiv} >
                    <h5>VAT GENERATED</h5>
                    <div className={styles.vatDiv}>
                        <h1>3,962,359.23</h1>
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
                        <div style={{width: '250px'}}>
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