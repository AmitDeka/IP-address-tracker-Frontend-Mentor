document.addEventListener("DOMContentLoaded", function () {
  const map = L.map("map").setView([0, 0], 13);
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const ipAddressElement = document.getElementById("ipAddress");
  const apiKey = "at_89AtfzHrpurlMVp95zavX7hurJlul";

  fetchIpAddress();

  function fetchIpAddress() {
    fetch("https://api.ipify.org?format=json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch IP address");
        }
        return response.json();
      })
      .then((data) => {
        const ipAddress = data.ip;
        ipAddressElement.textContent = ipAddress;
        fetchIpDetails(ipAddress);
      })
      .catch((error) => console.error("Error fetching IP address:", error));
  }

  function fetchIpDetails(input) {
    const url = input.includes(".")
      ? `https://geo.ipify.org/api/v1?apiKey=${apiKey}&domain=${input}`
      : `https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${input}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch IP details");
        }
        return response.json();
      })
      .then((data) => {
        const { lat, lng } = data.location;
        const isp = data.isp;

        updateMap(lat, lng);
        updateKeyInformation(
          data.location.city,
          data.location.country,
          data.location.postalCode,
          data.location.timezone,
          isp
        );
        updateBannerCard(data.ip);
      })
      .catch((error) => console.error("Error fetching IP details:", error));
  }

  searchButton.addEventListener("click", function () {
    let searchTerm = searchInput.value.trim();

    const cleanTerm = searchTerm.replace(
      /(https?:\/\/)?(www\.)?([^\/]+)(\/.*)?$/,
      "$3"
    );

    if (isValidInput(cleanTerm)) {
      fetchIpDetails(cleanTerm);
    } else {
      alert("Please enter a valid IP address or domain.");
    }
  });

  function isValidInput(input) {
    const ipAddressRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    const domainRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}$/;

    return ipAddressRegex.test(input) || domainRegex.test(input);
  }

  function updateMap(lat, lng) {
    map.setView([lat, lng], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: "/images/icon-location.svg",
      iconSize: [45, 55],
    });

    L.marker([lat, lng], { icon: customIcon }).addTo(map);
  }

  function updateKeyInformation(city, country, postalCode, timezone, isp) {
    const locationElement = document.getElementById("location");
    const timezoneElement = document.getElementById("timezone");
    const ispElement = document.getElementById("isp");

    const locationString = `${city}, ${country} ${postalCode}`;

    locationElement.textContent = locationString;
    timezoneElement.textContent = timezone;
    ispElement.textContent = isp;
  }

  function updateBannerCard(ipAddress) {
    const ipAddressElement = document.getElementById("ipAddress");
    ipAddressElement.textContent = `${ipAddress}`;
  }
});
