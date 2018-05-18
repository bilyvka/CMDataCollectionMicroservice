/**
 * Created by asoadmin on 2017-06-13.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://127.0.0.1:27017/cmDataDB');

var dataSchema = new Schema({
    clientId:String,
    modelId:String,
    timestamp:{ type : Date, default: Date.now },
    data:Object, //{original data
    vector:Object, //vector representation
    isExample:Boolean //is it base vectors for MVSM
});

exports.createDbConnection=function (db_name,db_user,db_password,callback) {
    var conn = mongoose.createConnection('mongodb://127.0.0.1:27017/' + db_name);
    var dataModel = conn.model('Data',dataSchema);
    callback(dataModel);
};