
  mapboxgl.accessToken = mapToken ;
    const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/light-v11', // style URL
	center: hotel.geometry.coordinates, // starting position [lng, lat]
	zoom: 11, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(hotel.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 15})
        .setHTML(
            `<h3>${hotel.title}</h3><p>${hotel.location}</p>`
        )
    )
    .addTo(map)

