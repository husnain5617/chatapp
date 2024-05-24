import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDVboYQjfLsH5j6PxekNjvLuI6N786yPiI",
    authDomain: "bukharisbchat.firebaseapp.com",
    projectId: "bukharisbchat",
    storageBucket: "bukharisbchat.appspot.com",
    messagingSenderId: "1028462078746",
    appId: "1:1028462078746:web:f2d91591abe8ae3a811aa3"
};

export const app = initializeApp(firebaseConfig);