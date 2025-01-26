// Initialize the HERE platform and map
const platform = new H.service.Platform({
  apikey: 'mW2mJ6BrjiNpUisGOdNK8JYya7jeYRGBvdzrJYO9QUw' // Replace with your HERE API Key
});

const defaultLayers = platform.createDefaultLayers();
const map = new H.Map(document.getElementById('map'), defaultLayers.vector.normal.map, {
  zoom: 10,  // Adjusted zoom level to fit both locations
  center: { lat: 10.7867, lng: 76.6548 } // Set center to Palakkad (PKD)
});

// Add UI components like zoom control
const ui = H.ui.UI.createDefault(map, defaultLayers);

// Define the coordinates for Palakkad and Thrissur
const palakkadCoordinates = { lat: 10.7867, lng: 76.6548 };
const thrissurCoordinates = { lat: 10.5276, lng: 76.2144 };

// Create markers for both locations
const palakkadMarker = new H.map.Marker(palakkadCoordinates);
const thrissurMarker = new H.map.Marker(thrissurCoordinates);

// Add the markers to the map
map.addObject(palakkadMarker);
map.addObject(thrissurMarker);

// Add information windows for each marker
palakkadMarker.setData("Palakkad (PKD)");
thrissurMarker.setData("Thrissur (THSR)");

// Enable geolocation to track the user's position
navigator.geolocation.watchPosition(function (position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  console.log(`Current position: ${lat}, ${lng}`);

  // Create a new marker for the user's current position
  const userMarker = new H.map.Marker({ lat, lng });

  // Add the marker to the map
  map.addObject(userMarker);

  // Center the map to the user's location
  map.setCenter({ lat, lng });

}, function (error) {
  console.error("Error occurred: ", error);
}, {
  enableHighAccuracy: true,
  timeout: 10000
});
