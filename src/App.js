import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import Signin from './pages/Auth/Signin';
import Signup from './pages/Auth/Signup';
import Profile from './pages/Profile/Profile';

function App() {

	const user = JSON.parse(localStorage.getItem('profile'));

	return (
		<Router>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/signin' element={(!user ? <Signin /> : <Navigate to='/' />)} />
				<Route path='/signup' element={(!user ? <Signup /> : <Navigate to='/' />)} />
				<Route path='/profile/:id' element={<Profile />} />
				<Route path='*' element={<Navigate to='/' />} />
			</Routes>
		</Router>
	);
}

export default App;
