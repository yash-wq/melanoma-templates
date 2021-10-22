const BaseUrl = "http://143.244.129.237:5000/";
const modelResult = document.getElementById("model-result");
const uploadScreen = document.getElementById("upload-screen");

function proceedNext() {
  uploadScreen.style.display = "none";
  const imageInput = document.getElementById("image-input");
  const formData = new FormData();

  formData.append("img", imageInput.files[0]);
  console.log(imageInput.files[0]);

  fetch(BaseUrl+"saveimg", {
    method: "POST",
    body: formData
  })
    .then((response) => response.json())
    .then((result) => {
      pushUrl(result);
      //console.log("Sent for receiving result");
      if (result.statusCode == 0) {
        //console.log(result.payload.data);
        if (result.payload.data == "Not Melanoma") {
          var str = "Melonoma Negative";
          var setColor = str.fontcolor("green");
          modelResult.innerHTML = setColor;
        } else {
          var str = "Melonoma Positive";
          var setColor = str.fontcolor("red");
          modelResult.innerHTML = setColor;
        }
      } else {
        console.log("An error occured. Please try again!");
        modelResult.innerHTML = "An error occured. Please try again!";
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function pushUrl(result) {
  let flagVal = false;
  if(result.statusCode == 1){
    flagVal = true;
  }
  const pushData = {url: `${result.payload.url}`, flag : flagVal, email: currentUserMail }
  //console.log(pushData);
  //console.log(result.payload.url);
  fetch(BaseUrl+"addimgurl", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(pushData)
  })
    .then((responseThen) => responseThen.text())
    .then((outcome) => {
      outcomeJson = JSON.parse(outcome);
      //console.log(outcomeJson);
      if (outcomeJson.statusCode == 0){
        let successMsg = outcomeJson.payload.data;
        console.log("Success:", successMsg);
      } else if (outcomeJson.statusCode == 1){
        let errorMsg = outcomeJson.payload.data;
        console.log("Success:", errorMsg);
      } else {
        console.log("An error occured!");
      }
    })
    .catch((errorLast) => {
      console.log("Error:", errorLast);
    });
}
