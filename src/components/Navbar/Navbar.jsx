import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import decode from 'jwt-decode';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import './Navbar.css';

function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);

            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location, user?.token]);

    // Menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        //navigate(`/profile/${user?.result?._id}`);
    };

    const logout = () => {
        localStorage.removeItem('profile');
        window.location.reload();
    };

    return (
        <div className='navbar'>
            <Link to='/' style={{ textDecoration: 'none' }}>
                <h1>Social</h1>
            </Link>
            <div className='navbar-right'>
                {user ? (
                    <>
                        <Link to={`/profile/${user?.result?._id}`} style={{ textDecoration: 'none', color: 'black' }}>
                            <div className='navbar-profile'>
                                <Avatar sx={{ bgcolor: user?.result?.profile_style, height: 34, width: 34 }}></Avatar>
                                <p>{user?.result?.username.replace(/\w\S*/g, m => m.charAt(0).toUpperCase() + m.substr(1).toLowerCase())}</p>
                            </div>
                        </Link>
                        <div>
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                sx={{ minWidth: '18px !important' }}
                            >
                                <ArrowDropDownIcon sx={{ color: 'black', padding: '2px 0 0 0' }} />
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                                PaperProps={{ style: { marginLeft: -20, marginTop: 10, width: 150 } }}
                            >
                                <MenuItem onClick={handleClose}>Profile</MenuItem>
                                <MenuItem onClick={() => { handleClose(); logout(); }}>Logout</MenuItem>
                            </Menu>
                        </div>
                    </>
                ) : (
                    <>
                        <button className='signin-button' onClick={() => navigate('/signin')}>Sign in</button>
                        <button className='signup-button' onClick={() => navigate('/signup')}>Sign up</button>
                    </>
                )}
            </div>
        </div >
    )
}

export default Navbar