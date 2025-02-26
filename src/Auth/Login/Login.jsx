import '../Registration/Registration.css';
import Header from '../../Header/Header';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backend from '../../settings';


function Login() {
    const navigate = useNavigate();
    const [formError, setFormError] = useState('');

    const [emailClass, setEmailClass] = useState('w-100');
    const [passwordClass, setPasswordClass] = useState('w-100');

    const removeError = (e) => {
        const name = e.target.name;
        if (name === 'email') {setEmailClass('w-100')}
        else if (name === 'password') {setPasswordClass('w-100')}
        setFormError('');
    }

    const loginSubmit = async(e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        let success = true;

        if (email.length === 0) {
            setEmailClass('w-100 error');
            success = false;
        }
        if (password.length === 0) {
            setPasswordClass('w-100 error');
            success = false;
        }

        if (success) {
            try {
                const url = `${backend}/auth/session/`
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });
                const rdata = await response.json();
                if (response.status === 200) {
                    if (rdata.status) {
                        const token = rdata.token;

                        localStorage.removeItem('role');
                        localStorage.removeItem('uid');
                        localStorage.setItem('token', token);
                        
                        const url = `${backend}/auth/user/`
                        const response = await fetch(url, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        const rdata2 = await response.json();
                        if (response.status === 200) {
                            if (rdata2.status) {
                                localStorage.setItem('role', rdata2.role);
                                localStorage.setItem('uid', rdata2.uid);
                                navigate('/');
                            }
                        }
                    } else {
                        setFormError(rdata.detail);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <>
        <Header />
        <div className="content">
        <h2>Вход</h2>
        <form id='auth-form' autoComplete='off' onSubmit={loginSubmit}>
            <input type='text' name='email' placeholder='Email' className={emailClass} onClick={removeError} onChange={removeError} />
            <input type='password' name='password' placeholder='Пароль' className={passwordClass} onClick={removeError} onChange={removeError} />
            <button className='btn-main w-100' type='submit'>Войти</button>
            <Link to='/password'><b>Забыли пароль?</b></Link>
            {formError &&
                <p className='form-error'>Ошибка: {formError}.</p>
            }
        </form>
        </div>
        </>
    )
}

export default Login
