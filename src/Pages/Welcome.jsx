import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBookReader } from 'react-icons/fa'
import Navbar from '../Components/Navbar'

function Welcome() {
    const navigate = useNavigate()

    return (
        <div className='min-h-screen bg-amber-50 flex flex-col'>
            <Navbar />

            <main className='grow flex flex-col items-center px-5 py-10'>
                <div className='bg-emerald-700 text-white p-6 rounded-full shadow-lg'>
                    <FaBookReader size={56} />
                </div>

                <h1 className='text-3xl md:text-5xl font-bold text-center text-emerald-800 mt-8'>
                    புத்தகத் திருவிழாவிற்கு வருக!
                </h1>
                <p className='text-lg md:text-2xl text-center text-gray-700 mt-2'>
                    Welcome to the Ranipet Book Fair
                </p>

                <p className='text-center text-gray-700 mt-6 max-w-xl'>
                    உங்கள் வாசிப்பு விருப்பங்களையும் கருத்துகளையும் பகிர்ந்துகொள்ளுங்கள்.
                    அடுத்த புத்தகத் திருவிழாவை இன்னும் சிறப்பாக நடத்த இது உதவும். (1 நிமிடம் மட்டுமே)
                </p>
                <p className='text-center text-sm text-gray-500 mt-2 max-w-xl'>
                    Share your reading interests and feedback – it takes just 1 minute.
                </p>

                <div className='bg-white w-full max-w-md mt-10 p-5 rounded-2xl shadow'>
                    <button
                        className='w-full bg-emerald-700 hover:bg-emerald-800 text-white py-4 rounded-xl font-semibold text-lg'
                        onClick={() => navigate('/register')}
                    >
                        தொடங்குக / Start
                    </button>
                </div>
            </main>

            <footer className='text-center text-xs text-gray-500 py-4'>
                Ranipet District Administration · Government of Tamil Nadu
            </footer>
        </div>
    )
}

export default Welcome
