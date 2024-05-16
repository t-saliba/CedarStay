
mapboxgl.accessToken = mapToken ;
    const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/light-v11', // style URL
	center: hotel.geometry.coordinates, // starting position [lng, lat]
	zoom: 11, // starting zoom
});

/* map.addControl(new mapboxgl.NavigationControl()); */

new mapboxgl.Marker()
    .setLngLat(hotel.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 15})
        .setHTML(
            `<h3>${place_1[0].properties.name}</h3><p>${place_1[0].properties.full_address}</p>`
        )
    )
    .addTo(map)

new mapboxgl.Marker()
    .setLngLat(place_1[0].geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 15})
        .setHTML(
            `<h3>${place_1[0].properties.name}</h3><p>${place_1[0].properties.full_address}</p>`
        )
    )
    .addTo(map)

new mapboxgl.Marker()
    .setLngLat(place_1[1].geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 15})
        .setHTML(
            `<h3>${place_1[1].properties.name}</h3><p>${place_1[1].properties.full_address}</p>`
        )
    )
    .addTo(map)

    new mapboxgl.Marker()
    .setLngLat(place_2[0].geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 15})
        .setHTML(
            `<h3>${place_2[0].properties.name}</h3><p>${place_2[0].properties.full_address}</p>`
        )
    )
    .addTo(map)
    
    new mapboxgl.Marker()
    .setLngLat(place_2[1].geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 15})
        .setHTML(
            `<h3>${place_2[1].properties.name}</h3><p>${place_2[1].properties.full_address}</p>`
        )
    )
    .addTo(map)

    new mapboxgl.Marker()
    .setLngLat(place_3[0].geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 15})
        .setHTML(
            `<h3>${place_3[0].properties.name}</h3><p>${place_3[0].properties.full_address}</p>`
        )
    )
    .addTo(map)

new mapboxgl.Marker()
    .setLngLat(place_3[1].geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 15})
        .setHTML(
            `<h3>${place_3[1].properties.name}</h3><p>${place_3[1].properties.full_address}</p>`
        )
    )
    .addTo(map)