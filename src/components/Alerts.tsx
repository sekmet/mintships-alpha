import Swal from 'sweetalert2';
import type { SweetAlertIcon } from 'sweetalert2';

export function Alert(
  icon: SweetAlertIcon,
  title: string,
  message: string,
  buttonText?: string,
  callBack?: any
) {
  // #7066e0
  Swal.fire({
    title,
    text: message,
    icon,
    confirmButtonColor: '#3085d6',
    confirmButtonText: buttonText || 'Ok',
  }).then(async (result) => {
    if (result.isConfirmed && typeof callBack === 'function') {
      await callBack();
    }
  });
}

export function ConfirmAlert(
  icon: SweetAlertIcon,
  title: string,
  message: string,
  buttonText: string,
  confirmTitle: string,
  confirmMessage: string,
  confirmIcon: SweetAlertIcon,
  callBack: any,
  router: any
) {
  Swal.fire({
    title,
    text: message,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: buttonText,
  }).then(async (result) => {
    if (result.isConfirmed && typeof callBack === 'function') {
      await callBack();

      Swal.fire(confirmTitle, confirmMessage, confirmIcon).then(() => {
        if (
          router !== 'undefined' &&
          router !== null &&
          typeof router === 'function'
        ) {
          router.reload();
        }
      });
    }
  });
}
