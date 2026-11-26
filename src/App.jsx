import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Welcome from './Pages/Welcome'
import Register from './Pages/Register'
import ThankYou from './Pages/ThankYou'
import './App.css'

function App() {
    return (
        <Routes>
            <Route path='/' element={<Welcome />} />
            <Route path='/register' element={<Register />} />
            <Route path='/thanks' element={<ThankYou />} />
            <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
    )
}

export default App
