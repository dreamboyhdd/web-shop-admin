import Swal from 'sweetalert2';
const AlertConfirm = (title, message, confirm, callback) => {
    Swal.fire({
        title: title,
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: confirm,
      }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
      })
}

export const ConfirmAlert = AlertConfirm;