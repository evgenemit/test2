import './CreateOrder.css';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Header/Header';
import { useEffect, useState } from 'react';
import backend from '../../settings';


function CreateOrder() {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    const navigate = useNavigate();

    const url = new URL(window.location.href);
    const [url_seller_id, setUrlSellerId] = useState(url.searchParams.get('seller_id'));
    const url_about = url.searchParams.get('about');


    const [aboutClass, setAboutClass] = useState('w-100');
    const [createdLink, setCreatedLink] = useState('');
    const [sellerName, setSellerName] = useState('');
    const [points, setPoints] = useState([]);

    useEffect(() => {
        const getSellerName = async() => {
            try {
                
                const response = await fetch(`${backend}/auth/seller/info/?seller_id=${url_seller_id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const rdata = await response.json();
                if (response.status === 200) {
                    if (rdata.status) {
                        setSellerName(rdata.name);
                    }
                }
                else if (response.status === 401) {
                    localStorage.removeItem('role');
                    localStorage.removeItem('token');
                    localStorage.removeItem('uid');
                    navigate('/login/');
                }
                else {
                    setUrlSellerId(null);
                }
            } catch (error) {
                console.log(error);
            }
        }
        const getPoints = async() => {
            try {
                
                const response = await fetch(`${backend}/auth/points/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const rdata = await response.json();
                if (response.status === 200) {
                    if (rdata.status) {
                        setPoints(rdata.points);
                    }
                }
                else if (response.status === 401) {
                    localStorage.removeItem('role');
                    localStorage.removeItem('token');
                    localStorage.removeItem('uid');
                    navigate('/login/');
                }
                else {
                    setUrlSellerId(null);
                }
            } catch (error) {
                console.log(error);
            }
        }

        if (role === 'cl' && url_seller_id) {
            getSellerName();
            getPoints();
        }
    }, []);

    const formSubmit = async(e) => {
        e.preventDefault();
        let success = true;
        const product_about = e.target.product_about.value;

        if (product_about.length === 0) {
            success = false;
            setAboutClass('w-100 error');
        }

        let seller_id = null;
        try {
            const response = await fetch(`${backend}/auth/seller/?user_id=${uid}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const rdata = await response.json();

            if (response.status === 200) {
                if (rdata.status) {
                    console.log(rdata)
                    seller_id = rdata.seller_id;
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

        if (success) {
            let url2 = `/orders/create/?seller_id=${seller_id}&about=${encodeURIComponent(product_about)}`;
            let order_url = `${location.origin}/?next=${encodeURIComponent(url2)}`;
            console.log(order_url)
            setCreatedLink(order_url);
        }
    }

    const formSubmitClient = async(e) => {
        e.preventDefault();
        const point_id = e.target.point_id.value;

        const response = await fetch(`${backend}/orders/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'point_id': point_id,
                'seller_id': url_seller_id,
                'client_id': uid,
                'about': url_about
            })
        });
        const rdata = await response.json();
        if (response.status === 200) {
            if (rdata.status) {
                console.log(rdata);
                navigate('/');
            }
        }
        else if (response.status === 401) {
            localStorage.removeItem('role');
            localStorage.removeItem('token');
            localStorage.removeItem('uid');
            navigate('/login/');
        }
    }


    const removeError = (e) => {
        const name = e.target.name;
        if (name === 'product_name') { setNameClass('w-100') }
        else if (name === 'product_about') { setAboutClass('w-100') }
    } 

    return (
        <>
        <Header />
        <div className="content">
            {role === 'sl' &&
                <>
                {createdLink === '' &&
                    <form id='craete-order-form' onSubmit={formSubmit} autoComplete='off'>
                        <p>Описание</p>
                        <textarea name='product_about' className={aboutClass} placeholder='Описание товара' rows={5} onClick={removeError} onChange={removeError}></textarea>
                        <div className='form-buttons'>
                            <Link to='/' className='btn-main'>&lt;</Link>
                            <button type='submit' className='btn-main w-100'>Создать</button>
                        </div>
                    </form>
                }
                {createdLink &&
                    <div className='craeted-link'>
                        <Link to='/' className='btn-main'>&lt;</Link>
                        <input type='text' defaultValue={createdLink} className='w-100' />
                    </div>
                }
                </>
            }
            {role === 'cl' &&
                <>
                {(url_seller_id === null || url_about === null) &&
                <p>Ошибка.</p>
                }
                {url_seller_id && url_about &&
                <form id='craete-order-form' onSubmit={formSubmitClient}>
                    <p>Пункт выдачи</p>
                    <select name='point_id' className='w-100' onClick={removeError} onChange={removeError}>
                        {points.map((item, index) => (
                            <option value={item.id} key={index}>{item.name}</option>
                        ))}
                    </select>
                    <p>Продавец</p>
                    <input name='seller_id' type='text' className='w-100' onClick={removeError} onChange={removeError} value={sellerName} disabled />
                    <p>Описание</p>
                    <textarea name='product_about' className='w-100' rows={5} disabled value={url_about}></textarea>
                    <div className='form-buttons'>
                        <Link to='/' className='btn-main'>&lt;</Link>
                        <button type='submit' className='btn-main w-100'>Заказать</button>
                    </div>
                </form>
                }
                </>
            }

        </div>
        </>
    )
}


export default CreateOrder;
