
var markers = [];
var map = L.map('map');
//south brunswick school 
map.setView([40.37, -74.56], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);

const on_row_click = (e) => 
{ 

    let row = e.target; 
    if (e.target.tagName.toUpperCase() === 'TD')
    { 
        row = e.target.parentNode; 
    }
    const lat = row.dataset.lat; 
    const long = row.dataset.long;
    if(lat  && long)
    map.flyTo(new L.LatLng(lat, long));
}

const addPlace = async () => {
    const label = document.querySelector("#label").value;
    const address = document.querySelector("#address").value;
    await axios.put('/places', { label: label, address: address });
    await loadPlaces();
}

const deletePlace = async (id) => {
    await axios.delete(`/places/${id}`);
    for (var i = 0; i < markers.length; i++) { map.removeLayer(markers[i]); }
    await loadPlaces();
}

const loadPlaces = async () => {
    const response = await axios.get('/places');
    const tbody = document.querySelector('tbody');
      
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    if (response && response.data && response.data.places) {
        for (const place of response.data.places) {
            marker = L.marker([place.lat, place.long]).addTo(map) .bindPopup(`<b>${place.label}</b><br/>${place.address}`);
            markers.push(marker);
            const tr = document.createElement('tr');
            tr.dataset.lat = place.lat; tr.dataset.long = place.long;
            tr.onclick = on_row_click;
            tr.innerHTML = `
                <td>${place.label}</td>
                <td>${place.address}</td>
                <td>${place.lat}</td>
                <td>${place.long}</td>

                <td>
                    <button class='btn btn-danger' onclick='deletePlace(${place.id})'>Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        }
    }
   
}