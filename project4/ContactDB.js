require('dotenv').config();
const bcrypt = require('bcryptjs');
const Database = require('dbcmps369');

class ContactsDB {
    constructor() {
        this.db = new Database();
    }

    async createcmps369User()
    {
      const username = "cmps369";
      const firstname = "Prof. Scott";
      const lastname = "Frees";
      const p = "rcnj";
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(p, salt);
      const id = await this.findUserByUserName(username);
      if(!id) await this.createUser(username, firstname,lastname,hash);
    }

    async initialize() {
        await this.db.connect();
        await this.db.schema("Contacts" , [
            { name: 'id', type: 'INTEGER' },
            { name: 'firstname', type: 'TEXT' },
            { name: 'lastname', type: 'TEXT' },
            { name: 'phonenumber', type: 'TEXT' },
            { name: 'emailaddress', type: 'TEXT' },
            { name: 'street', type: 'TEXT' },
            { name: 'city', type: 'TEXT' },
            { name: 'state', type: 'TEXT' },
            { name: 'zip', type: 'TEXT' },
            { name: 'country', type: 'TEXT' },
            { name: 'contact_by_email', type: 'INTEGER' },
            { name: 'contact_by_phone', type: 'INTEGER' },
            { name: 'lat', type: 'TEXT' },
		    { name: 'long', type: 'TEXT' }
         ] ,"id");

        await this.db.schema('Users', [
            { name: 'id', type: 'INTEGER' },
            { name: 'password', type: 'TEXT' },
            { name: 'firstname', type: 'TEXT' },
            { name: 'lastname', type: 'TEXT' },
            { name: 'username', type: 'TEXT' }
        ], 'id');
		await this.createcmps369User();

    }

    async createContact(firstname,lastname,phonenumber,emailaddress,street,city,state,zip,country, contact_by_email,contact_by_phone ,location) {
		var lat,long;

		if (location.length>0)
		{
			lat= location[0].latitude;
			long = location[0].longitude;

		}
        const id = await this.db.create('Contacts', [
            { column: 'firstname', value: firstname },
            { column: 'lastname', value: lastname },
            { column: 'phonenumber', value: phonenumber },
            { column: 'emailaddress', value: emailaddress },
            { column: 'street', value: street },
            { column: 'city', value: city },
            { column: 'state', value: state },
            { column: 'zip', value: zip },
            { column: 'country', value: country },
            { column: 'contact_by_email', value: contact_by_email },
            { column: 'contact_by_phone', value: contact_by_phone },
            { column: 'lat', value: lat},
            { column: 'long', value: long }
        ])
        return id;
    }

    async createUser(username, firstname,lastname,password) {
        const id = await this.db.create('Users', [
            { column: 'username', value: username },
            { column: 'firstname', value: firstname },
            { column: 'lastname', value: lastname },
            { column: 'password', value: password }

        ])
        return id;
    }

    async findUserByUserName(username) {
        const us = await this.db.read('Users', [{ column: 'username', value: username }]);
        if (us.length > 0) return us[0];
        else {
            return undefined;
        }
    }

    async findUserById(id) {
        const us = await this.db.read('Users', [{ column: 'id', value: id }]);
        if (us.length > 0) return us[0];
        else {
            return undefined;
        }
    }

    async findContactByContactId(id) {
        const us = await this.db.read('Contacts', [{ column: 'id', value: id }]);

        if (us.length > 0) return us;
        else {
            return undefined;
        }
    }
    async deleteContactByContactId(id) {
        const us = await this.db.delete('Contacts', [{ column: 'id', value: id }]);

        if (us.length > 0) return us;
        else {
            return undefined;
        }
    }
    async findCompleteContacts()
    {

        const contacts = await this.db.read('Contacts', []);
        return contacts;
    }
    async updateContactByContactId(id , firstname,lastname,phonenumber,emailaddress,street,city,state,zip,country, contact_by_email,contact_by_phone,location ) {
		var lat,long;
		if (location.length>0)
		{
				lat= location[0].latitude;
				long = location[0].longitude;
				console.log(lat + ":" + long) ;
		}
        const status = await this.db.update('Contacts',[
            { column: 'firstname', value: firstname },
            { column: 'lastname', value: lastname },
            { column: 'phonenumber', value: phonenumber },
            { column: 'emailaddress', value: emailaddress },
            { column: 'street', value: street },
            { column: 'city', value: city },
            { column: 'state', value: state },
            { column: 'zip', value: zip },
            { column: 'country', value: country },
            { column: 'contact_by_email', value: contact_by_email },
            { column: 'contact_by_phone', value: contact_by_phone },
            { column: 'lat', value: lat},
            { column: 'long', value: long }],
            [{ column: 'id', value: id }]
        )
        return status;
    }
     async findPlaces() {
	        const contacts = await this.db.read('Contacts', []);
	        return contacts;
	    }

	    async createPlace(label, location) {
	        var lat,long;

	        if (location.length>0)
	        {
	            console.log(location[0].lat + ":" + location[0].long);
	            lat= location[0].latitude;
	            long = location[0].longitude;
	        }
	        const id = await this.db.create('Place', [
	            { column: 'label', value: label },
	            { column: 'lat', value: lat},
	            { column: 'long', value: long }
	        ]);
	        return id;
	    }

	    async deletePlace(id) {
	        await this.db.delete('Place', [{ column: 'id', value: id }]);
    }
}

module.exports = ContactsDB;