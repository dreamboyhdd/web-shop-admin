import 'react-toastify/dist/ReactToastify.css';
import { toast, Zoom } from 'react-toastify';

export const Alertwarning = (title) => {
  toast.warning(title, {
    theme: 'colored',
    autoClose: 2500,
    position: toast.POSITION.TOP_CENTER,
    transition: Zoom,
    draggable: true,
    closeOnClick: true,
  });
};

export const Alertsuccess = (title) => {
  toast.success(title, {
    theme: 'colored',
    autoClose: 2500,
    position: toast.POSITION.TOP_CENTER,
    transition: Zoom,
    draggable: true,
    closeOnClick: true,
  });
};


export const Alertinfo = (title) => {
  toast.info(title, {
    theme: 'colored',
    autoClose: 2500,
    position: toast.POSITION.TOP_CENTER,
    transition: Zoom,
    draggable: true,
    closeOnClick: true,
  });
};

export const Alerterror = (title) => {
  toast.error(title, {
    theme: 'colored',
    autoClose: 2500,
    position: toast.POSITION.TOP_CENTER,
    transition: Zoom,
    draggable: true,
    closeOnClick: true,
  });
} 