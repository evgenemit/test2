import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Auth/Login/Login';
import Registration from './Auth/Registration/Registration';
import Home from './Home/Home';
import CreateOrder from './Order/Create/CreateOrder';
import Orders from './Order/Orders/Orders';
import Order from './Order/Order';
import './App.css'


function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/reg' element={<Registration />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/orders/' element={<Orders />} />
                    <Route path='/orders/create' element={<CreateOrder />} />
                    <Route path='/orders/:order_id' element={<Order />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
