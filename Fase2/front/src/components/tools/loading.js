import React from 'react'
import BounceLoader from "react-spinners/BounceLoader"

const Loading = () => {
    return (
        <div className='position-absolute top-0 start-0 w-100'>
            <div className='position-relative' style={{ height: '100vh', backgroundColor: 'rgba(230,230,230,0.7)' }}>
                <br />
                <div className='position-absolute btn-lg top-50 start-50 translate-middle'>
                    <BounceLoader color="#FAC900" size={150} css={{ display: 'block', margin: 'auto' }} />
                </div>

            </div>
        </div>
    )
}

export default Loading
