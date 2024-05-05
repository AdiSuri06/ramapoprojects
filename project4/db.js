require('dotenv').config();
const Database = require('dbcmps369');

class PlacesDB {
    constructor() {
        this.db = new Database();
    }

    async initialize() {
        await this.db.connect();
        await this.db.schema('Place', [
            { name: 'id', type: 'INTEGER' },
            { name: 'label', type: 'TEXT' },
            { name: 'lat', type: 'TEXT' },
            { name: 'long', type: 'TEXT' }

        ], 'id');
    }

    async findPlaces() {
        const places = await this.db.read('Place', []);
        return places;
    }

    async createPlace(label, address,location) {
        var lat,long;
        console.log(location);
        if (location.length>0) 
        { 
            console.log(location[0].lat + ":" + location[0].long);
            lat= location[0].latitude;
            long = location[0].longitude;
        }
        const id = await this.db.create('Place', [
            { column: 'label', value: label },
            { column: 'address', value: address },
            { column: 'lat', value: lat},
            { column: 'long', value: long }
        ]);
        return id;
    }

    async deletePlace(id) {
        await this.db.delete('Place', [{ column: 'id', value: id }]);
    }
}

module.exports = PlacesDB;