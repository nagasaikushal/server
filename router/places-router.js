const express=require('express');
const router=express.Router();
const placeController=require('../controllers/place-controller');

router.post('/data', placeController.createPlaceController);
router.get('/getdata', placeController.getPlacesController);


module.exports=router;