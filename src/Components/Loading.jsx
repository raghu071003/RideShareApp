import React from 'react'
import './Loading.css'

const Loading = () => {
  return (
    // <div className="clock-loader absolute top-0 left-0"></div>
    <div className="flex items-center justify-center h-screen">
    <div className="loader border-t-4 border-b-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
</div>


  )
}

export default Loading