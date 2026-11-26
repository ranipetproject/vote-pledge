import React from 'react'
import { BsBank } from 'react-icons/bs'

function Navbar() {

    return (
        <div className='flex justify-between items-center text-lg gap-5 sm:text-2xl p-5 bg-neutral-50 shadow-2xl'>
            <div className='flex gap-3'>
                <BsBank size={30} />
                <h2>இராணிப்பேட்டை புத்தகத் திருவிழா / Ranipet Book Fair</h2>
            </div>
        </div>
    )
}

export default Navbar