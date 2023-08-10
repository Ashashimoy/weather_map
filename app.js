// api key
apikey = "p1oLnzvzXZz0mgRWcIGtqfPz5JkZEHL2";

// get city
const getCity = async (city) => {
  const baseUrl =
  "http://dataservice.accuweather.com/locations/v1/cities/search";

  const queryParameters =`?apikey=${apikey}&q=${city}`;;
  const response = await fetch(baseUrl + queryParameters);
  const data = await response.json();
  return data[0];
};

//get weather of the city
const getWeather = async (locationKey) => {
  const baseUrl = "https://dataservice.accuweather.com/currentconditions/v1/";
  const queryParameters = `${locationKey}?apikey=${apikey}`;
  const response = await fetch(baseUrl + queryParameters);
  const data = await response.json();
  return data[0];
};


const cityForm = document.querySelector("form");

//update city
const updateCity = async (city) => {
  const cityDetails = await getCity(city);
  const cityWeather = await getWeather(cityDetails.Key);

  return { cityDetails, cityWeather };
};

//loading city from localstorage
if (localStorage.getItem("weathercity")) {
  updateCity(localStorage.getItem("weathercity"))
    .then((data) => updateUI(data))
    .catch((err) => console.log(err));
}

//get city name from form
cityForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const city = cityForm.city.value.trim();
  cityForm.reset();

  localStorage.setItem("weathercity", city);

  updateCity(localStorage.getItem("weathercity"))
    .then((data) => updateUI(data))
    .catch((err) => {
      alert("Something went wrong, please try later");
      console.log(err);
      throw new Error("Please enter the correct city name");
    });
});

// UI update
const card = document.querySelector(".card");

const updateUI = (data) => {
  const { cityDetails, cityWeather } = data;

  card.innerHTML = `
  <!-- Weather details -->
  <div class="text-muted text-uppercase">
      <h4 class="my-1">${cityDetails.EnglishName}</h4>
      <h5 class="my-1">(${
        cityDetails.AdministrativeArea.EnglishName
      })</h5>
      <h6>${cityDetails.Country.EnglishName}</h6>
      <div class="mt-3">${cityWeather.WeatherText}</div>
      <div class="display-4 my-2">
          <span>${cityWeather.Temperature.Metric.Value}</span>
          <span>&deg;C</span>
      </div>
  </div>
`;
};
