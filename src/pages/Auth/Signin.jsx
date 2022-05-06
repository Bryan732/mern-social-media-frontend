import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../components/Footer/Footer';
import SignIn from '../../images/signin.jpg';
import './Signin.css';

// material ui
import Alert from '@mui/material/Alert';

function Signin() {

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [userInfo, setUserInfo] = useState({
        username: '',
        password: '',
    });

    useEffect(() => {
        setTimeout(() => setError(''), 5000);
    }, [error]);

    const onSubmit = (e) => {
        const data = { username: userInfo.username, password: userInfo.password };
        e.preventDefault();
        axios
            .post('http://localhost:3001/user/signin', data)
            .then((res) => {
                if (res.data.err) {
                    console.log(res.data.err);
                } else {
                    localStorage.setItem('profile', JSON.stringify(res.data));
                    navigate('/');
                }
            })
            .catch((error) => {
                setError(error.response.data.message);
            });
        //setUserInfo({ username: '', password: '' });
    };

    return (
        <div className='signin'>
            <div className='signin-left'>
                <img src={SignIn} alt='by cottonbro' />
                <div className='copyright'>Photo By: <a href='https://www.pexels.com/@cottonbro/' target='_blank' rel='noreferrer'>cottonbro</a></div>
            </div>
            <div className='signin-right'>
                <div className='exist'>
                    <p>Not a member? <span onClick={() => navigate('/signup')}>Sign up now</span></p>
                </div>
                <div className='signin-form'>
                    <h2>Sign in to <span>Social</span></h2>
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
                        <label>Password: </label>
                        <input
                            type='password'
                            required
                            value={userInfo.password}
                            onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                        />
                        <button type='submit'>Sign In</button>
                    </form>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Signin