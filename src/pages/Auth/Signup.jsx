import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignUp from '../../images/signup.jpg';
import './Signup.css';

// material ui
import Alert from '@mui/material/Alert';
import Footer from '../../components/Footer/Footer';

function Signup() {

    const navigate = useNavigate();
    const colors = ['#f06292', '#f48fb1', '#e57373', '#7b1fa2', '#ff5252', '#43a047', '#9ccc65', '#03a9f4', '#009688', '#fbc02d', '#795548', '#455a64'];
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        password: '',
        color: colors[Math.floor(Math.random() * colors.length)]
    });
    const [error, setError] = useState('');

    useEffect(() => {
        setTimeout(() => setError(''), 5000);
    }, [error]);

    const onSubmit = (e) => {
        const data = { username: userInfo.username, email: userInfo.email, password: userInfo.password, color: userInfo.color };
        e.preventDefault();
        axios
            .post('http://localhost:3001/user/signup', data)
            .then((res) => {
                if (res.data.err) {
                    console.log(res.data.err);
                } else {
                    localStorage.setItem('profile', JSON.stringify(res.data));
                    navigate('/');
                };
            })
            .catch((error) => {
                setError(error.response.data.message);
            });
        //setUserInfo({ username: '', email: '', password: '', color: colors[Math.floor(Math.random() * colors.length)] });
    };

    return (
        <div className='signup'>
            <div className='signup-left'>
                <img src={SignUp} alt='by cottonbro' />
                <div className='copyright'>Photo By: <a href='https://www.pexels.com/@cottonbro/' target='_blank' rel='noreferrer'>cottonbro</a></div>
            </div>
            <div className='signup-right'>
                <div className='exist'>
                    <p>Already a member? <span onClick={() => navigate('/signin')}>Sign In</span></p>
                </div>
                <div className='signup-form'>
                    <h2>Sign up to <span onClick={() => navigate('/')}>Social</span></h2>
                    <form onSubmit={onSubmit}>
                        {error ? (
                            <Alert severity="error">
                                {error}
                            </Alert>
                        ) : null}
                        <label>Username: </label>
                        <input
                            type='text'
                            required
                            value={userInfo.username}
                            onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                        />
                        <label>Email: </label>
                        <input
                            type='email'
                            required
                            value={userInfo.email}
                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        />
                        <label>Password: </label>
                        <input
                            type='password'
                            required
                            value={userInfo.password}
                            onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                        />
                        <button type='submit'>Create Account</button>
                    </form>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Signup