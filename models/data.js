/**
 * Created by asoadmin on 2017-06-13.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dataSchema = new Schema({
    clientId:String,
    modelId:String,
    timestamp:{ type : Date, default: Date.now },
    data:Object, //{original data
    vector:Object, //vector representation
    isExample:Boolean //is it base vectors for MVSM
});

module.exports = mongoose.model('Data', dataSchema);