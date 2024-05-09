const express = require('express');
const router = express.Router();

const logged_in = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send("Not authorized");
    }
}

router.get('/',  async (req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;
    const contactsFromDB = await req.db.findCompleteContacts();
    res.render('contacts', { contacts: contactsFromDB });

});
router.get('/create', async (req, res) => {
    res.render('create', { hide_login: true });
});

router.get('/:contactId',  async (req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;
    const contactsFromDB = await req.db.findContactByContactId(req.params.contactId);
    if(contactsFromDB)
        res.render('view', { contacts: contactsFromDB });
});
router.get('/:contactId/edit', logged_in, async (req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;
    const contactsFromDB = await req.db.findContactByContactId(req.params.contactId);
    res.render('edit', { contacts: contactsFromDB });
});
router.get('/:contactId/delete', logged_in,  async (req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;
    const contactsFromDB = await req.db.findContactByContactId(req.params.contactId);
    res.render('delete', { contacts: contactsFromDB });
});
router.post('/create',  async (req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;
    var fullAddress = req.body.street +", " + req.body.city + ", " + req.body.state + " " +  req.body.zip;

    const location = await req.geocoder.geocode(fullAddress);
	if (location.length>0)
	{
    const create = await req.db.createContact(req.body.firstname, req.body.lastname, req.body.phonenumber, req.body.emailaddress, req.body.street, req.body.city, req.body.state, req.body.zip, req.body.country, req.body.contact_by_email, req.body.contact_by_phone,location);
    res.redirect('/');
	}
});
router.post('/:contactId/edit',  async (req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;
    var fullAddress = req.body.street +", " + req.body.city + ", " + req.body.state + " " +  req.body.zip;
    console.log(fullAddress +"sad");
    const location = await req.geocoder.geocode(fullAddress);
    if (location.length>0)
	{
    const create = await req.db.updateContactByContactId(req.params.contactId, req.body.firstname, req.body.lastname, req.body.phonenumber, req.body.emailaddress, req.body.street, req.body.city, req.body.state, req.body.zip, req.body.country, req.body.contact_by_email, req.body.contact_by_phone,location);
    res.redirect('/');
	}
});
router.post('/:contactId/delete',  async (req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;
    const create = await req.db.deleteContactByContactId(req.params.contactId);
    res.redirect('/');
});
module.exports = router;