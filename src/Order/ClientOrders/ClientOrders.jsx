import './ClientOrders.css';
import Header from '../../Header/Header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


function ClientOrders() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const uid = localStorage.getItem('uid');
    const navigate = useNavigate();
    const client_code = '080323';

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const getOrders = async() => {
            try {
                const url = `${backend}/orders/client/client_code=${client_code}&uid=${uid}`
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const rdata = await response.json();
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
    }, [])

    return (
        <>
            <Header />
            <div className="content">
                {orders.map((item, index) => (
                    <Link className="order1" to={'/orders/' + item.id} key={index}>
                        <div>
                            <h4 className='order-status'>{item.status}</h4>
                            <h4 className='order-id'># {item.id}</h4>
                        </div>
                        {role === 'cl' && <p>{item.address}</p>}
                        {role === 'sl' && <p>{item.first_name}</p>}
                    </Link>
                ))}
                {orders.length === 0 && <p className='no-orders'>Нет заказов</p>}
            </div>
        </>
    )
}


export default ClientOrders;
