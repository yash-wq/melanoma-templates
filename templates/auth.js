const BaseUrl = "http://143.244.129.237:5000/";

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

// ----------------User Create an Account-------------

function signUp() {
  let emailInput = document.getElementById("email").value;
  let passwordInput = document.getElementById("password").value;
  let checkboxVal = document.getElementById("doctor");
  let isDoctor = false;
  firebase
    .auth()
    .createUserWithEmailAndPassword(emailInput, passwordInput)
    .then(userCredential => {
      // Signed in
      var user = userCredential.user;
      window.alert("User created Successfully!");
      if (checkboxVal.checked == true) {
        isDoctor = true;
        registerDoc(isDoctor, user);
        //window.location.href = "doctorDashboard.html";
      } else {
        window.location.href = "uploadPage.html";
      }
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert(`${errorMessage} Please log into the account.`);
      // ..
    });
}

// ---------------User Log In------------------

function logIn() {
  let emailInput = document.getElementById("email").value;
  let passwordInput = document.getElementById("password").value;
  let checkboxVal = document.getElementById("doctor");
  firebase
    .auth()
    .signInWithEmailAndPassword(emailInput, passwordInput)
    .then(userCredential => {
      // Signed in
      var user = userCredential.user;
      window.alert(`User Signed in!`);
      if (checkboxVal.checked == true) {
        window.location.href = "doctorDashboard.html";
      } else {
        window.location.href = "uploadPage.html";
      }
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert("This account doesn't exist. Please Sign up to create one!");
    });
}

// ---------------User Log Out---------------

function logOut() {
  firebase.auth().signOut().then(
    function() {
      window.location.href = "index.html";
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


//-------------Register Doctor as a user------------//

function registerDoc(isDoctor, user) {
  let docDetails = {
    "emailid" : user.email,
    "isdoctor" : isDoctor,
    "firebaseid" : user.uid
  }
  //console.log(docDetails);
  fetch(BaseUrl + "registeruser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(docDetails)
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

