import { toast } from 'react-toastify';

export const notify = () =>
  toast(
    'Debes de configurar tu fecha de corte y presupuesto antes de utilizar la app.'
  );
