import React, { useState, useEffect, useRef } from "react";
import { getImageUrl } from "../../../utils";
import styles from './Header.module.css';
import { useNavigate } from "react-router-dom";

export const Header = () => {

    const [ opened, setOpened ] = useState(false);
    const signpop = useRef(null)
    const navigate = useNavigate();
    const currentPath = window.location.pathname;

    const handleClickOutside = (event) => {
        if (signpop.current && !signpop.current.contains(event.target)) {
            setOpened(false);
        }
    };
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return (
        <div className={styles.header}>
            <img className={styles.logo} src={getImageUrl('blackLogo.svg')} alt="FIRS" />

            <div className={styles.links}>
                <button onClick={()=>navigate('/admin/overview')} className={currentPath === "/admin/overview" ? styles.active : ''}>Overview</button>
                <button onClick={()=>navigate('/admin/banking')} className={currentPath === "/admin/banking" ? styles.active : ''}>Banking</button>
                <button onClick={()=>navigate('/admin/telcos')} className={currentPath === "/admin/telcos" ? styles.active : ''}>Telcos</button>
                <button onClick={()=>navigate('/admin/invoicing')} className={currentPath === "/admin/invoicing" ? styles.active : ''}>Invoicing</button>
                <button onClick={()=>navigate('/admin/auditlogs')} className={currentPath === "/admin/auditlogs" ? styles.active : ''}>Audit Logs</button>
                <button onClick={()=>navigate('/admin/reports')} className={currentPath === "/admin/reports" ? styles.active : ''}>Reports</button>
            </div>

            <div className={styles.buttons}>
                <button><img src={getImageUrl('filter.png')} /></button>
                <button><img src={getImageUrl('bell.png')} /></button>
                <button className={styles.profile} onClick={()=>setOpened(!opened)}>UB</button>
                <div className={`${styles.closed} ${opened && styles.signOut}`} ref={signpop}>
                    <a href="/signin">Sign out</a>
                </div>
            </div>
        </div>
    )
}