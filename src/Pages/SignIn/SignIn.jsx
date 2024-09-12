import React, { useState } from "react";
import styles from './SignIn.module.css';
import { getImageUrl } from "../../../utils";
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
    
    const [ showPassword, setShowPassword ] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={styles.whole}>
            <div className={styles.signin}>
                <img className={styles.logo} src={getImageUrl('kb_logo.png')} alt="KB" />
                <h3>Sign in to your account</h3>

                <label htmlFor="email">Email</label>
                <input className={styles.emailInput} type="email" name="email" placeholder="xyz@samplemail.com" autoComplete="off" />
                
                <label htmlFor="password">Password</label>
                <div className={styles.passwordDiv}>
                    <input type={showPassword ? 'text' : 'password'} name="password" autoComplete="off" />
                    <button type="button" onClick={()=> setShowPassword(!showPassword)}><img src={getImageUrl('showPass.png')} /></button>
                </div>
                <a href="">Forgot Password</a>

                <button className={styles.signInButton} onClick={()=>navigate('/dashboard')}>Sign In</button>

            </div>
        </div>
    )
}