import './Home.css';
import Header from '../Header/Header';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import cart_png from '../assets/cart.png';
import link_png from '../assets/link.png';


function Home() {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const url = new URL(window.location.href);
        const next = url.searchParams.get('next');
        if (next) {
            navigate(next);
        }
    }, [])

    return (
        <>
        <Header />
        <div className="content">
        {role === 'cl' &&
            <>
                <Link to='/orders' className='home-links-buttons btn-main'>
                    <div>
                        <img src={cart_png} width='40rem' />
                        <span>Мои заказы</span>
                    </div>
                </Link>
            </>
        }
        {role === 'sl' &&
            <>
                <Link to='/orders' className='home-links-buttons btn-main'>
                    <div>
                        <img src={cart_png} width='40rem' />
                        <span>Мои заказы</span>
                    </div>
                </Link>
                <Link to='/orders/create' className='home-links-buttons btn-main'>
                    <div>
                        <img src={link_png} width='40rem' />
                        <span>Создать ссылку на заказ</span>
                    </div>
                </Link>
            </>
        }
        </div>
        </>
    )
}


export default Home;
