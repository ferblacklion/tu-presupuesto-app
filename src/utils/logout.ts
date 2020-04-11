import { deleteLS } from '.';

const logout = (e: React.MouseEvent) => {
  e.preventDefault();
  deleteLS('userData');
  setTimeout(() => {
    console.log('redirect');

    window.location.href = '/';
  }, 800);
};

export default logout;
