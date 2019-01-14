// Store our API endpoint inside queryUrl
var v_hour ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"; //past Hour
var v_day = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";//Past day
var v_week ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"; //past Week
var v_month = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"; //past Month


var queryUrl = v_hour

var v_click_hour = d3.select("#pills-hour");
var v_click_day = d3.select("#pills-day");
var v_click_week = d3.select("#pills-week");
var v_click_month = d3.select("#pills-month");

f_run_get_data(queryUrl);

function f_run_get_data(selectedURL){
  
d3.json(selectedURL, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});
}
var markers = L.markerClusterGroup();
var quakes = L.markerClusterGroup();
function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    
    markers.addLayer(L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      fillOpacity: 0.75,color: "white",fillColor: "purple",radius: feature.properties.mag*20000})
      .bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>" + feature.properties.mag + " Magnitude </p>"));
    
    quakes.addLayer(L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])
    .bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>" + feature.properties.mag + " Magnitude </p>"));


  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
}


function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Dark Map": darkmap,
    "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Locations: quakes,
    Magnitude:markers
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [darkmap, markers]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
} 

v_click_hour.on("click", function() {
  markers.clearLayers();
   f_run_get_data(v_hour);
  console.log("Clicked by Hour");
});
v_click_day.on("click", function() {
  markers.clearLayers();
  f_run_get_data(v_day);
  console.log("Clicked by Day");
});
v_click_week.on("click", function() {
  markers.clearLayers();
  f_run_get_data(v_week);
  console.log("Clicked by Week");
});
v_click_month.on("click", function() {
  markers.clearLayers();
  f_run_get_data(v_month);
  console.log("Clicked by Month");
});