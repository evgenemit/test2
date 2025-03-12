import './Registration.css';
import Header from '../../Header/Header';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backend from '../../settings';


function Registration() {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState(null);

    const [emailClass, setEmailClass] = useState('w-100');
    const [passwordClass, setPasswordClass] = useState('w-100');
    const [firstNameClass, setFirstNameClass] = useState('w-100');
    const [nameClass, setNameClass] = useState('w-100');
    const [aboutClass, setAboutClass] = useState('w-100');
    const [formError, setFormError] = useState('');

    const navigate = useNavigate();


    const choseRole = (e) => {
        setStep(2);
        setRole(e.target.name);
        setEmailClass('w-100');
        setPasswordClass('w-100');
        setFirstNameClass('w-100');
        setNameClass('w-100');
        setAboutClass('w-100');
        setFormError('');
    }

    const stepBack = () => {
        setStep(step - 1);
    }

    const removeError = (e) => {
        const name = e.target.name;
        if (name === 'email') {setEmailClass('w-100')}
        else if (name === 'password') {setPasswordClass('w-100')}
        else if (name === 'first_name') {setFirstNameClass('w-100')}
        else if (name === 'seller_name') {setNameClass('w-100')}
        else if (name === 'point_name') {setNameClass('w-100')}
        else if (name === 'about') {setAboutClass('w-100')}
        setFormError('');
    }

    const authSubmit = async(e) => {
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

        let url = null;
        let data = null;
        if (role === 'cl') {
            const first_name = e.target.first_name.value;
            if (first_name.length === 0) {
                setFirstNameClass('w-100 error');
                success = false;
            }
            url = `${backend}/auth/clients/`
            data = JSON.stringify({
                email: email,
                password: password,
                first_name: first_name
            })
        }
        else if (role === 'sl') {
            const name = e.target.seller_name.value;
            const about = e.target.about.value;
            if (name.length === 0) {
                setNameClass('w-100 error');
                success = false;
            }
            if (about.length === 0) {
                setAboutClass('w-100 error');
                success = false;
            }
            url = `${backend}/auth/sellers/`
            data = JSON.stringify({
                email: email,
                password: password,
                name: name,
                about: about
            })
        }
        else if (role === 'pt') {
            const name = e.target.point_name.value;
            if (name.length === 0) {
                setNameClass('w-100 error');
                success = false;
            }
            url = `${backend}/auth/points/`
            data = JSON.stringify({
                email: email,
                password: password,
                name: name
            })
        }

        if (success) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: data
                });
                const rdata = await response.json();
                if (response.status === 200) {
                    if (rdata.status) {
                        navigate('/login/');
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
        <h2>Регистрация</h2>
        {step === 1 && 
            <div className='reg-chose-role'>
                <button className='btn-main' onClick={choseRole} name='cl'>Покупатель</button>
                <button className='btn-main' onClick={choseRole} name='sl'>Продавец</button>
                <button className='btn-main' onClick={choseRole} name='pt'>Пункт выдачи</button>
            </div>
        }
        {step === 2 && 
            <form id='auth-form' autoComplete='off' onSubmit={authSubmit}>
                <input name='email' type="text" className={emailClass} placeholder='Email' onClick={removeError} onChange={removeError} />
                <input name='password' type="password" className={passwordClass} placeholder='Пароль' onClick={removeError} onChange={removeError} />
                {role === 'cl' &&
                    <><input name='first_name' type='text' className={firstNameClass} placeholder='Имя' onClick={removeError} onChange={removeError}></input></>
                }
                {role === 'sl' &&
                    <>
                    <input name='seller_name' type='text' className={nameClass} placeholder='Название' onClick={removeError} onChange={removeError}></input>
                    <textarea name='about' className={aboutClass} rows={3} placeholder='Описание' onClick={removeError} onChange={removeError}></textarea>
                    </>
                }
                {role === 'pt' &&
                    <><input name='point_name' type='text' className='w-100' placeholder='Адрес' onClick={removeError} onChange={removeError}></input></>
                }
                <div className='form-buttons'>
                    <button type='button' className='btn-main' onClick={stepBack}>&lt;</button>
                    <button type='submit' className='btn-main'>Зарегестрироваться</button>
                </div>
                {formError &&
                    <p className='form-error'>Ошибка: {formError}.</p>
                }
            </form>
        }
        </div>
        </>
    )
}


export default Registration
