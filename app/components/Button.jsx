'use client'
import React from 'react'

const Button = ({btnName, handleClick}) => {
  return (
    <div>
        <button onClick={handleClick} className='bg-blue-500 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded'>{btnName}</button>
    </div>
  )
}

export default Button