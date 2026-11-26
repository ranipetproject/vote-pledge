import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBookOpen } from 'react-icons/fa'

function Navbar() {
    const navigate = useNavigate()

    return (
        <div className='flex items-center gap-3 px-4 py-4 md:px-6 md:py-5 shadow bg-white'>
            <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate('/')}>
                <span className='bg-emerald-700 text-white p-2 rounded-xl'><FaBookOpen size={22} /></span>
                <div className='leading-tight'>
                    <h1 className='text-sm md:text-xl font-semibold text-emerald-900'>இராணிப்பேட்டை புத்தகத் திருவிழா</h1>
                    <p className='text-xs md:text-sm text-gray-500'>Ranipet Book Fair · Ranipet District Administration</p>
                </div>
            </div>
        </div>
    )
}

export default Navbar
