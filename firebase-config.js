// ======================================================
// MUSAS - CONFIGURAÇÃO DO FIREBASE
// ======================================================

// Dados do projeto Firebase 
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAsYHUObcCtKtVUqqnd6zUH-V72WIb21eU",
  authDomain: "musas-2764a.firebaseapp.com",
  projectId: "musas-2764a",
  storageBucket: "musas-2764a.firebasestorage.app",
  messagingSenderId: "221128403771",
  appId: "1:221128403771:web:2e21597216df510c19e51e"
};


// ======================================================
// CONFIGURAÇÕES DO SISTEMA 
// ======================================================

const APP_CONFIG = {

  // Nome que aparecerá nas notificações/e-mails
  employeeName: "Adriana",

  // IMPORTANTE:
  // Troque pelo e-mail que deverá receber
  // os avisos de novos agendamentos.
  employeeEmail: "brenocosta7744@gmail.com"

};

window.FIREBASE_CONFIG = FIREBASE_CONFIG;
window.APP_CONFIG = APP_CONFIG;

console.log("Configuração do Firebase Musas carregada.");