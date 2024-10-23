import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils';
import styles from './Welcome.module.css';

export const Welcome = () => {

    const navigate = useNavigate();

    return (
        <div className={styles.whole}>
            <div className={styles.div}>
                <img src={getImageUrl('whiteLogo.svg')} />
                <button onClick={()=>navigate('admin-signin')}>VAT Monitoring</button>
                <button onClick={()=>navigate('fin-signin')}>Financial Analysis</button>
            </div>
        </div>
    );
}