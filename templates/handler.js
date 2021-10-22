const BaseUrl = "http://143.244.129.237:5000/";
const imgsContainer = document.getElementById("photo-grid");
const downVote = document.getElementById("downvote");
const upVote = document.getElementById("upvote");
const sendButton = document.getElementById("mail-button");
const msgOverlay = document.getElementById("message-overlay");
const subject = document.getElementById("subject-ip");
const message = document.getElementById("message-ip");
const sendBtn = document.getElementById("send-mail");


//All Global Variables
var currentUserMailId = null;

// ---------fetching all images and displaying them---------


fetch(BaseUrl + "getimgs")
  .then((response) => response.json())
  .then((dataObject) => {
    let imageArr = dataObject.data;
    for (i = 0; i < imageArr.length; i++) {
      let image = imageArr[i];
      let melResult = "Negative";
      if (image.prediction == true) {
        melResult = "Positive";
      } else {
        melResult = "Negative";
      }

      imgsContainer.innerHTML += `<div class="photo-grid-div"><img src="${image.url}" alt="" ><p>Result: ${melResult} </p><div id="${image.id}"><p class="count" id="upvote-num-${i}">${image.ratio["isMelanoma"]}</p><button id="in-${i}" onclick="incVote(id)" value="true" class="circle-button upvote"></button><button id="de-${i}"  onclick="decVote(id)" value="false" class="circle-button downvote"></button><p class="count" id="downvote-num-${i}">${image.ratio["isNotMelanoma"]}</p></div><button class="mail-button" id="mail-button" name="${image.id}" onclick="getMail(name, id)" >Notify Patient</button> </div>`;
    }
  });


// ------------- Upvoting and Downvoting ------------


function incVote(id) {
  let idVal = document.getElementById(id).parentNode.id;
  let countVal = document.getElementById(id).value;
  countVal = countVal === "true";

  const IncData = { urlid: idVal, value: countVal };
  //console.log(IncData);

  fetch(BaseUrl + "inccount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(IncData),
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log("Success:", data);
      updateIncInfo(idVal);
      console.log("Upvoted Successfully!");
      document.getElementById(idVal).style.pointerEvents = "none";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function decVote(id) {
  let idVal = document.getElementById(id).parentNode.id;
  let countValNeg = document.getElementById(id).value;
  countValNeg = countValNeg === !"false";
  //console.log(countValNeg);

  const decData = { urlid: idVal, value: countValNeg };

  fetch(BaseUrl + "inccount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(decData),
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log("Success:", data);
      updateDecInfo(idVal);
      console.log("Downvoted Successfully!");
      document.getElementById(idVal).style.pointerEvents = "none";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}


// -------Displaying the updated number of upvotes and downvotes respectively--------


function updateDecInfo(idVal) {
  const imgInfo = { imgurl: `${idVal}`};
  let parentDivChildren = document.getElementById(idVal).childNodes;
  //console.log(imgInfo);

  fetch(BaseUrl+"getimgdetails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imgInfo),
  })
    .then((response) => response.json())
    .then((updatedData) => {
      //console.log("updatedInfo:", updatedData);
      let countInfo = updatedData.payload.data.counts.isNotMelanoma;
      //console.log(countInfo);
      parentDivChildren[3].innerHTML = countInfo;
      //console.log("Down Value Updated!");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function updateIncInfo(idVal) {
  const imgInfo = { imgurl: `${idVal}`};
  let parentDivChildren = document.getElementById(idVal).childNodes;
  //console.log(imgInfo);

  fetch(BaseUrl+"getimgdetails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imgInfo),
  })
    .then((response) => response.json())
    .then((updatedData) => {
      //console.log("updatedInfo:", updatedData);
      let countInfo = updatedData.payload.data.counts.isMelanoma;
      //console.log(countInfo);
      parentDivChildren[0].innerHTML = countInfo;
      //console.log("Up Value Updated!");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}


// ------- Get patient's email id (the one who uploaded the image)-------


function getMail(name,id){
  msgOverlay.style.display = "flex";
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.documentElement.style.overflow = 'hidden';
  document.body.scroll = "no";
  //msgOverlay.style.bottom = "";
  const mailReq = {"document" : name};
  
  fetch(BaseUrl + "getemail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mailReq),
  })
    .then((response) => response.json())
    .then((resObject) => {
      patientMail = resObject.payload.data;
      //console.log(patientMail);
      sendBtn.name = patientMail;
     // return patientMail;
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Patient's email address unavailable!")
    });
}

// -------Send email to the person who uploaded the photo-------

function sendMail(name){
  let mailSub = subject.value;
  let mailContent = message.value;
  let mailObject = {"patient": name, "subject": mailSub,  "content": mailContent, "docid": currentUserMail};

  fetch(BaseUrl + "sendmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mailObject),
  })
    .then((response) => response.json())
    .then((success) => {
      console.log("success:", success);
      alert("Email sent successfully!");
      msgOverlay.style.display = "none";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Email could not be sent!")
    });
    document.documentElement.style.overflow = 'scroll';
    document.body.scroll = "yes";
}

