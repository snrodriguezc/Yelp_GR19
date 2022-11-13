import React from 'react'
import Swal from 'sweetalert2';


const Alert = ({ variant, children }) => {

    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3800,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: variant,
        title: children
    })


    return (
        <></>
    )
}

Alert.defaultProps = {
    variant: 'info'
}

export default Alert
