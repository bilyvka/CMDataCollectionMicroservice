var express = require('express');
var router = express.Router();
var dataCtrl = require('../controllers/dataCollectionCtrl.js');

/* GET home page. */
router.get('/', function(req, res, next) {

  //res.render('index', { title: 'Express' });
});
/**
 * Feature 1
 * Receives data from client and saves it in mongodb
 */
router.post('/data',function (req,res,next) {
    dataCtrl.saveData(req,function () {
        res.status(200).send({result:"OK"});
    });
});

/**
 * Feature 2
 * Gets amount of data in database
 */
router.post('/get-data-amount',function (req,res,next){
    console.log(req.body);
    dataCtrl.getAmountOfData(req,function (result) {
        res.status(200).send(result);
    })
});
/**
 * Feature 3
 * Gets example data that are basis for MVSM
 */
router.post('/examples',function(req,res,next){
   dataCtrl.getDataExamples(req,function(result){
       res.send(result);
   })
});

module.exports = router;
