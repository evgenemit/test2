import './Header.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import backend from '../settings';


function Header() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const logout = async() => {
        try {
            const url = `${backend}/auth/session/`
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const rdata = await response.json();
            if (response.status === 200) {
                if (rdata.status) {
                    localStorage.removeItem('role');
                    localStorage.removeItem('token');
                    localStorage.removeItem('uid');
                    navigate('/login/');
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="header">
                <h2><Link to='/'>Доставка</Link></h2>
                {token &&
                    <div className="auth-buttons">
                        <button className='btn-main' onClick={logout}>Выйти</button>
                    </div>
                }
                {token === null &&
                    <div className="auth-buttons">
                        <Link to='/login' className='btn-main'>Вход</Link>
                        <Link to='/reg' className='btn-main'>Регистрация</Link>
                    </div>
                }
            </div>
        </>
    )
}

export default Header
