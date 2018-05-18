/**
 * Created by asoadmin on 2017-06-13.
 *
 *
 *
 *
 * Examples of data_description:
 *  {"field_name":"name","isArray":false,"isCategorical":false,"type":"string","isStatic":true,"categorical_values":null,"weight":0},
 *  {"field_name":"year","isArray":false,"isCategorical":false,"type":"number","isStatic":false,"categorical_values":null,"weight":1},
 *
 */


var request = require("request");
var moment = require('moment');
var dbConfig = require("../models/db_config.js");


/**
 * This function saves data in to database in following structure:
 *    - original data
 *    - vector representation of the original vector
 *    - isExample, true if the data are basis for model, and false if the data should be matched with basis data in the model
 * @param req - clientId,modelId,data,isExample
 * @param callback - returns saved data
 */
exports.saveData = function (req, callback){
    var modelId = req.body.modelId;
    var clientId = req.body.clientId;

    var data = req.body.data;
    var isExample = req.body.isExample;

    //load configuration of the model
    loadModelConfig(modelId,clientId,function(result){
        if(result.configuration!=null){
            var configuration =  result.configuration;

                request({
                    uri: "http://localhost:3003/transform",
                    method: "POST",
                    json: {
                        data:data,
                        configuration:configuration
                    }
                }, function(error, response, body) {

                    console.log(body);
                    //body: [{original:{},vector:[]}]
                    //save in mongo database
                    saveDataToDB(configuration,body,isExample,callback);

                });

        }
    })

};


/**
 * This function gets basis vectors by specific timeline
 * if start and end time not specified then it takes all basis vectors (isExample = true)
 * @param req
 * @param callback - basis vectors in the model
 */
exports.getDataExamples = function(req,callback){
    var modelId = req.body.modelId;
    var clientId = req.body.clientId;
    var db_name = req.body.db_name;
    var from = req.body.start;
    var to = req.body.end;


    dbConfig.createDbConnection(db_name,req.body.db_user,req.body.db_password,function(dataModel){
        if(from !=null && to!=null){
            //get examples in specific time
            dataModel.find({modelId:modelId,clientId:clientId,isExmaple:true,timestamp:{$gt:from,$lt:to}},function(err,data){
                if(!err){
                    callback(data);
                }
                else{
                    callback([]);
                }
            });
        }
        else{
            //get all examples
            dataModel.find({clientId:clientId.toString(),modelId:modelId.toString(),isExample:true},function(err,data){
                if(!err){
                    callback(data);
                }
                else{
                    callback([]);
                }
            });
        }
    });
};


/**
 * Requests model configuration file
 * @param modelId - model id
 * @param clientId - client id
 * @return json object - model configuration
 */
function loadModelConfig(modelId,clientId,callback){
    var data = {"modelId":modelId,"clientId":clientId};

    request({
        uri: "http://localhost:3001/configuration",
        method: "POST",
        json: {
            data:data
        }
    }, function(error, response, body) {
        console.log(body);
        callback(body);
    });
}


/**
 * Saves data to mongodb
 * it also checks if the recieved data is not basis data, then
 * compute similarity and find the closest vector in multidimensional vector space model
 * @param configuration
 * @param data
 * @param isExample
 * @param callback - [{originVector,closestVector,minDistanceVector}]
 */
function saveDataToDB(configuration,data,isExample,callback) {
    var res = [];
    dbConfig.createDbConnection(configuration.db_name,configuration.db_user,configuration.db_password,function (dataModel) {

        data.forEach(function (item) {
         //console.log(item);
         var newItem = new dataModel({clientId:configuration.clientId.toString(),modelId:configuration._id.toString(),data:item.original,vector:item.vector,isExample:isExample});

         newItem.save(function (err) {
             res.push(err);
             if (res.length === data.length)
                {
                     //if data is not example->compute similarity
                     if(!isExample){

                             request({
                                uri: "http://localhost:3003/similarity",
                                method: "POST",
                                json: {
                                    data:body,
                                    configuration:configuration
                                }

                             },function(error, response, body){
                                console.log(body);
                                callback(body);
                             });
                     }
                     else{
                             callback();
                     }

                }
         });
         });
    });
}

/**
 * This function gets total amount of data in database
 * @param req
 * @param callback - count
 */
exports.getAmountOfData = function (req,callback) {
   dbConfig.createDbConnection(req.body.db_name,req.body.db_user,req.body.password,function(dataModel){
       dataModel.count({}, function( err, count){
           console.log( "Number of data:", count );
           callback({count:count});
       })
   });
};