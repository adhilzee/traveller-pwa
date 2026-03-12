var askPrompt = null;
var button = document.getElementById("install-button");

$(document).ready(function () {

  // LOAD CATEGORIES
  $.ajax({
    url: "https://traveller.talrop.works/api/v1/places/categories/",
    success: function (response) {

      let categories = response.data;
      let categories_html = "";

      categories.forEach((category) => {
        categories_html += `
          <li>
            <a href="#">
              <img class="rest" src="${category.image}" alt="${category.name}" />
              <span>${category.name}</span>
            </a>
          </li>`;
      });

      $("div.head ul").append(categories_html);
    },
  });

  // LOAD PLACES
  $.ajax({
    url: "https://traveller.talrop.works/api/v1/places/",
    success: function (response) {

      let places = response.data;
      let places_html = "";

      places.forEach((place) => {
        places_html += `
          <div class="item">
            <a href="detail.html?id=${place.id}">
              <div class="top">
                <img src="${place.image}" alt="${place.name}" />
              </div>
              <div class="middle">
                <h3>${place.name}</h3>
              </div>
              <div class="bottom">
                <img src="images/place.svg" alt="Image" />
                <span>${place.location}</span>
              </div>
            </a>
          </div>`;
      });

      $("div.items").append(places_html);
    },
  });

  // INSTALL BUTTON LOGIC
  if (button) {

    // Hide button if running as installed app
    if (window.matchMedia('(display-mode: standalone)').matches) {
      button.style.display = "none";
    }

    button.addEventListener("click", installApp);
  }

});


// SERVICE WORKER REGISTER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").then(function () {
    console.log("Service worker registered!");
  });
}


// INSTALL FUNCTION
const installApp = () => {

  if (askPrompt) {

    askPrompt.prompt();

    askPrompt.userChoice.then((result) => {

      console.log(result.outcome);

      if (result.outcome === "dismissed") {
        console.log("User dismissed");
      } else {
        console.log("App installed");
      }

      askPrompt = null;

    });
  }

};


// TRIGGER INSTALL PROMPT
window.addEventListener("beforeinstallprompt", (event) => {

  console.log("before install prompt triggered");

  event.preventDefault();

  askPrompt = event;

  if (button) {
    button.style.display = "block";
  }

});


// AFTER INSTALL HIDE BUTTON
window.addEventListener("appinstalled", () => {

  console.log("App installed");

  if (button) {
    button.style.display = "none";
  }

});
