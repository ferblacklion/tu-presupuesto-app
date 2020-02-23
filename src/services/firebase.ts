import firebase from 'firebase/app';
import 'firebase/auth';
declare interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export default function loginWithGoogle() {
  const firebaseConfig: IFirebaseConfig = {
    apiKey: 'AIzaSyBMH2Hk-ieriWWDYnH2oz6l0F7ndMIaWsM',
    authDomain: 'presupuesto-app-1582410219393.firebaseapp.com',
    databaseURL: 'https://presupuesto-app-1582410219393.firebaseio.com',
    projectId: 'presupuesto-app-1582410219393',
    storageBucket: 'presupuesto-app-1582410219393.appspot.com',
    messagingSenderId: '672626645688',
    appId: '1:672626645688:web:5e11071fe35be00bd8324d'
  };
  firebase.initializeApp(firebaseConfig);
  return firebase
    .auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(snap => {
      console.log(snap);
      return snap.user;
    });
}
