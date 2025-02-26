import './Order.css';
import Header from '../Header/Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import backend from '../settings';


function Order() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const uid = localStorage.getItem('uid');
    const { order_id } = useParams();
    const navigate = useNavigate();

    const [seller, setSeller] = useState('');
    const [point, setPoint] = useState('');
    const [about, setAbout] = useState('');
    const [canCancle, setCanCancle] = useState(false);
    const [canAccept, setCanAccept] = useState(false);

    useEffect(() => {
        const getOrder = async() => {
            try {
                const url = `${backend}/orders/${order_id}/?role=${role}`
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const rdata = await response.json();
                if (response.status === 200) {
                    if (rdata.status) {
                        if (role === 'cl')
                            setSeller(rdata.seller_name);
                        else if (role === 'sl')
                            setSeller(rdata.first_name);
                        setPoint(rdata.point_name);
                        setAbout(rdata.about);
                        setCanCancle(rdata.can_cancle);
                        setCanAccept(rdata.can_accept);
                    }
                }
                else if (response.status === 401) {
                    localStorage.removeItem('role');
                    localStorage.removeItem('token');
                    localStorage.removeItem('uid');
                    navigate('/login/');
                }
            } catch (error) {
                console.log(error);
            }
        }
        
        getOrder();
    }, [])

    const cancleOrder = async(e) => {
        e.preventDefault();
        try {
            const url = `${backend}/orders/${order_id}/?role=${role}`
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const rdata = await response.json();
            if (response.status === 200) {
                if (rdata.status) {
                    console.log('Отменен');
                    navigate('/orders/');
                }
            }
            else if (response.status === 401) {
                localStorage.removeItem('role');
                localStorage.removeItem('token');
                localStorage.removeItem('uid');
                navigate('/login/');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const acceptOrder = async(e) => {
        e.preventDefault();
        try {
            const url = `${backend}/orders/${order_id}/`
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const rdata = await response.json();
            if (response.status === 200) {
                if (rdata.status) {
                    console.log('Принят');
                    navigate('/orders/');
                }
            }
            else if (response.status === 401) {
                localStorage.removeItem('role');
                localStorage.removeItem('token');
                localStorage.removeItem('uid');
                navigate('/login/');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
        <Header />
        <div className="content">
            <div className="order-info">
                {role === 'cl' &&
                <>
                <p>Продавец:</p>
                <p><b>{seller}</b></p>
                </>
                }
                {role === 'sl' &&
                <>
                <p>Покупатель:</p>
                <p><b>{seller}</b></p>
                </>
                }
                <p>Пункт выдачи:</p>
                <p><b>{point}</b></p>
                <p>Описание:</p>
                <p><b>{about}</b></p>
                <div>
                    <Link className='btn-main' to='/orders/'>&lt;</Link>
                    {canCancle &&
                        <button className='btn-main w-100' onClick={cancleOrder}>Отменить</button>
                    }
                    {!(canCancle) &&
                        <p>Нельзя отменить</p>
                    }
                    {role == 'sl' && canAccept &&
                        <button className='btn-main w-100' onClick={acceptOrder}>Принять</button>
                    }
                </div>
                
            </div>
        </div>
        </>
    )
}


export default Order;
