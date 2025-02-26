import './Orders.css';
import Header from '../../Header/Header';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import backend from '../../settings';


function Orders() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const uid = localStorage.getItem('uid');
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [qrStep, setQrStep] = useState(false);

    useEffect(() => {

        const getOrders = async() => {
            try {
                const url = `${backend}/orders/?role=${role}&uid=${uid}`
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const rdata = await response.json();
                console.log(rdata)
                if (response.status === 200) {
                    if (rdata.status) {
                        setOrders(rdata.orders);
                        setCompletedOrders(rdata.completed_orders);
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

        getOrders();

    }, [])

    const hideQr = () => {
        setQrStep(false);
    }

    const showQr = () => {
        setQrStep(true);
    }

    return (
        <>
        <Header />
        <div className="content">
            <div className="active-orders">
                {role === 'cl' &&
                <>
                    <div className="qr" onClick={showQr}>
                        <div className='qr-small-img'>
                        <QRCode
                            size={'3rem'}
                            value={'dfgrethfghf 3435'}
                        />
                        </div>
                        <p>Покажите QR-код<br />или назовите код <b>000000</b></p>
                    </div>
                    {qrStep &&
                        <div className="qr-big">
                            <div>
                                <div className='qr-big-img'>
                                <QRCode
                                    size={'20rem'}
                                    value={'dfgrethfghf 3435'}
                                />
                                </div>
                                <p>000000</p>
                                <button className='btn-main w-100' onClick={hideQr}>Назад</button>
                            </div>
                        </div>
                    }
                    
                </>
                }
                <h3>Активные</h3>
                {orders.map((item, index) => (
                    <Link className="order1" to={'/orders/' + item.id} key={index}>
                        <div>
                            {role === 'cl' && 
                                <h4 className={item.status === 'Готов к получению' ? 'order-status ready' : 'order-status'}>{item.status}</h4>
                            }
                            {role === 'sl' && 
                                <h4 className={item.status === 'Принят' ? 'order-status ready' : 'order-status'}>{item.status}</h4>
                            }
                            <h4 className='order-id'># {item.id}</h4>
                        </div>
                        {role === 'cl' && <p>{item.address}</p>}
                        {role === 'sl' && <p>{item.first_name}</p>}
                    </Link>
                ))}
                {orders.length === 0 && <p className='no-orders'>Нет активных заказов</p>}
                <br />
                <h3>Завершенные</h3>
                {completedOrders.map((item, index) => (
                    <Link className="order1" to={'/orders/' + item.id} key={index}>
                        <div>
                            <h4 className='order-status'>{item.status}</h4>
                            <h4 className='order-id'># {item.id}</h4>
                        </div>
                        {role === 'cl' && <p>{item.address}</p>}
                        {role === 'sl' && <p>{item.first_name}</p>}
                    </Link>
                ))}
                {completedOrders.length === 0 && <p className='no-orders'>Нет завершенных заказов</p>}

            </div>
        </div>
        </>
    )
}


export default Orders;
