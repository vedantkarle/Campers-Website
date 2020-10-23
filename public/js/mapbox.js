mapboxgl.accessToken =
  "pk.eyJ1IjoidmVkYW50a2FybGUiLCJhIjoiY2tmc2Zmd3ViMDZsYTJxdDhoamtqd3h6NiJ9.Fy8wFBFgzgYL2F4ufQ5W6A";
var map = new mapboxgl.Map({
  container: "map",
  center: campground.geometry.coordinates,
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 6,
});

map.addControl(new mapboxgl.NavigationControl());

var marker = new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
  )
  .addTo(map);
