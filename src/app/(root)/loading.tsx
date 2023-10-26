'use client'
import React from 'react'
import { RotatingLines } from 'react-loader-spinner'

const loading = () => {
  return (
    <div className='w-full flex justify-center items-center min-h-[80vh]'>
      <RotatingLines
        strokeColor="#877EFF"
        strokeWidth="4"
        animationDuration="1"
        width="48"
        visible={true}
      /></div>
  )
}

export default loading