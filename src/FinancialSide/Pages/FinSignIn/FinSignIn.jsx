import React, { useState } from "react";
import styles from './FinSignIn.module.css';
import { getImageUrl } from "../../../../utils";

export const FinSignIn = () => {
    
    const [ showPassword, setShowPassword ] = useState(false);

    const handleSignIn = () => {
        window.location.href = "/dashboard";
    }

    return (
        <div className={styles.whole}>
            <div className={styles.signin}>
                <img className={styles.logo} src={getImageUrl('blackLogo.svg')} alt="FIRS" />
                <h3>Sign in to your account</h3>

                <label htmlFor="email">Email</label>
                <input className={styles.emailInput} type="email" name="email" placeholder="admin@firs.gov.ng" autoComplete="off" />
                
                <label htmlFor="password">Password</label>
                <div className={styles.passwordDiv}>
                    <input type={showPassword ? 'text' : 'password'} name="password" autoComplete="off" placeholder="**********" />
                    <button type="button" onClick={()=> setShowPassword(!showPassword)}><img src={getImageUrl('showPass.png')} /></button>
                </div>
                <a href="">Forgot Password</a>

                <button className={styles.signInButton} onClick={handleSignIn}>Sign In</button>

            </div>
        </div>
    )
}