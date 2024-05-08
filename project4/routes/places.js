const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const places = await req.db.findPlaces();
    res.json({ contacts: places });
});

router.put('/', async (req, res) => {
    const location = await req.geocoder.geocode(req.body.address);
    const id = await req.db.createPlace(req.body.label, req.body.address,location);
    res.json({ id: id });
});

router.delete('/:id', async (req, res) => {
    await req.db.deletePlace(req.params.id);
    res.status(200).send();
})

module.exports = router;