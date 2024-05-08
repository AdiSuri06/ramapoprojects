
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
    const tbody = document.querySelector('body');
	console.log(response +  "" + response.data +"" + response.data.contacts);


    if (response && response.data && response.data.contacts) {
        for (const g of response.data.contacts) {
            marker = L.marker([g.lat, g.long]).addTo(map) .bindPopup(`<b>${g.firstname + " " + g.lastname}</b>`);
            markers.push(marker);
            const tr = document.createElement('tr');
            tr.dataset.lat = g.lat; tr.dataset.long = g.long;
            tr.onclick = on_row_click;
            tr.innerHTML = `

				<td> <a(href="/"+${g.id})> ${g.firstname} &nbsp;  &nbsp;  ${g.lastname}</td>
				<td>
				<section> ${g.phonenumber}</section>
				<section> ${g.emailaddress}</section>
				</td><td>
				<section> ${g.street}</section>
				<section> ${g.city +", " + g.state +" " + g.zip}</section>
				<section> ${g.country}</section>
				</td><td>
				<section>
				<input(checked=${g.contact_by_phone} name="contact_by_phone" type="checkbox" disabled value="true")/>
				<label(for="contact_by_phone")> Phone

				</section><section>
				<input(checked=${g.contact_by_email} name="contact_by_email" type="checkbox" disabled value="true" )/>
				<label(for="contact_by_email")> Email

                <td>
                    <button class='btn btn-danger' onclick='deletePlace(${g.id})'>Delete</button>
                </td>
                </section>
            `;
            tbody.appendChild(tr);
        }
    }

}