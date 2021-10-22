// ----------Project Configuration-----------

var firebaseConfig = {
  apiKey: "AIzaSyBFmb3cKcA7su3cMS3zUhJo1Mbi00fKgHQ",
  authDomain: "melanoma-auth.firebaseapp.com",
  projectId: "melanoma-auth",
  storageBucket: "melanoma-auth.appspot.com",
  messagingSenderId: "456373419745",
  appId: "1:456373419745:web:5910755a45b92f5ddb41a0",
  measurementId: "G-N45BBTNDGB"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

// ----------check login credentials----------------

let currentUserMail = "";

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    currentUserMail = user.email;
   console.log(currentUserMail);
  } else {
    console.log("no user");
  }
});
 

// ------------log out-------------------------


function logOut() {
  firebase.auth().signOut().then(
    function() {
      window.location.href = "http://192.168.0.106:5000";
      console.log("logged out");
    },
    function(error) {
      // An error happened.
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert(errorMessage);
    }
  );
}

