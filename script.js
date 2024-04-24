const svgTurkeyMap = document.getElementById("svg-turkey-map").getElementsByTagName("path");
const cardCity = document.getElementById("card__city");
const weather = document.getElementById("weather");
const cityName = document.getElementById("city-name");
const degree = document.getElementById("degree");
const imgElement = document.querySelector("dialog img");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const dialogContainer = document.getElementById("dialog__container");
const dialogClose = document.querySelector(".dialog__close");

for (let i = 0; i < svgTurkeyMap.length; i++) {
  svgTurkeyMap[i].addEventListener("mousemove", function () {
    cityName.classList.add("show-city-name--active");
    cityName.style.left = event.clientX + 16 + "px";
    cityName.style.top = event.clientY + 16 + "px";
    cityName.innerHTML = this.getAttribute("title");
  });

  svgTurkeyMap[i].addEventListener("mouseleave", function () {
    cityName.classList.remove("show-city-name--active");
  });

  svgTurkeyMap[i].addEventListener("click", function () {
    //! API CALL
    async function fetchData() {
      try {
        const response = await fetch(
          // &lang=tr Eklenerek dil destekli api alınabilir.
          // `https://api.openweathermap.org/data/2.5/weather?q=${cityName.innerHTML}&appid=${apiKey}&lang=tr&units=metric`

          `https://api.openweathermap.org/data/2.5/weather?q=${cityName.innerHTML}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();
        imgElement.src = `./assets/iconWeather/${data.weather[0].icon}.svg`;
        cardCity.innerText = data.name.split(" ")[0];
        weather.innerText = data.weather[0].description;
        degree.innerText = Math.round(data.main.temp) + "°";
        humidity.innerText = data.main.humidity;
        wind.innerText = data.wind.speed;
      } catch (error) {
        console.error("Hata:", error);
      }
    }
    fetchData();

    dialogContainer.showModal();
  });
}

dialogClose.addEventListener("click", function () {
  dialogContainer.close();
});

// ! Dialog kartın dışına tıklandığında kart kapanır.
dialogContainer.addEventListener("click", (event) => {
  const rect = dialogContainer.getBoundingClientRect();
  if (event.clientY < rect.top || event.clientY > rect.bottom || event.clientX < rect.left || event.clientX > rect.right) {
    dialogContainer.close();
  }
});

var typed = new Typed("#turkey", {
  strings: ["Turkey"],
  typeSpeed: 200,
  startDelay: 500,
  showCursor: false,
  loop: false,
});

//! LOCATİON

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      var requestOptions = {
        method: "GET",
      };

      //! API CALL
      async function fetchData() {
        try {
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_API_KEY}`,
            requestOptions
          );
          const locationInfo = await response.json();
          document.querySelector(".location__text").innerText = locationInfo.features[0].properties.county;
        } catch (error) {
          console.error("Hata:", error);
        }
      }
      fetchData();
    },
    function (error) {
      // Handle errors, if any
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.error("User denied the request for geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          console.error("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          console.error("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          console.error("An unknown error occurred.");
          break;
      }
    }
  );
} else {
  console.error("Geolocation is not available in this browser.");
}
