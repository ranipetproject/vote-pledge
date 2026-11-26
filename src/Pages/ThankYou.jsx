import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaCheckCircle } from 'react-icons/fa'
import Navbar from '../Components/Navbar'

function ThankYou() {
    const navigate = useNavigate()
    const name = useLocation().state?.name

    return (
        <div className='min-h-screen bg-amber-50 flex flex-col'>
            <Navbar />
            <main className='grow flex flex-col items-center justify-center px-5 text-center'>
                <FaCheckCircle className='text-emerald-600' size={80} />
                <h1 className='text-2xl md:text-4xl font-bold text-emerald-800 mt-6'>
                    நன்றி{name ? `, ${name}` : ''}!
                </h1>
                <p className='text-lg text-gray-700 mt-2'>Thank you{name ? `, ${name}` : ''}!</p>
                <p className='text-gray-700 mt-6 max-w-md'>
                    உங்கள் விவரங்கள் வெற்றிகரமாகப் பதிவு செய்யப்பட்டன. புத்தகத் திருவிழாவை மகிழ்ந்து அனுபவியுங்கள்.
                </p>
                <p className='text-sm text-gray-500 mt-1 max-w-md'>
                    Your response has been recorded. Enjoy the Book Fair – happy reading!
                </p>
                <button
                    onClick={() => navigate('/register', { replace: true })}
                    className='mt-10 px-6 py-3 rounded-xl border border-emerald-700 text-emerald-800 font-semibold hover:bg-emerald-50'
                >
                    இன்னொருவரைப் பதிவு செய்ய / Register another person
                </button>
            </main>
        </div>
    )
}

export default ThankYou
