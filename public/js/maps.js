let map;




async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: coordinates.lat, lng:  coordinates.lng },
    zoom: 15,
    mapTypeId:"terrain"
  });
  const marker = new google.maps.Marker({
    position :{ lat: coordinates.lat, lng:  coordinates.lng},
    map:map,
    draggable:false,
    animation:google.maps.Animation.DROP,
  });
  

}
initMap();

