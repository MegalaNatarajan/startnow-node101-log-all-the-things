const express = require('express');
const fs = require('fs');
const app = express();
var port = process.env.PORT || 3000;
useragent = require('express-useragent');
var path = require('path');
var isodate = require("isodate");
var csv = require('express-csv');
var csv1 = require("csvtojson");
var version = require('http-version');
var date = new Date();
var logger = require('morgan');
/*var f = fs.readFileSync('log.csv', {encoding: 'utf-8'}, 
    function(err){console.log(err);});

// Split on row
f = f.split("\n");

// Get first row for column headers
headers = f.shift().split(",");
console.log(headers.length);

var json = [];    
f.forEach(function(d){
    // Loop through each row
    tmp = {}
    row = d.split(",");
    console.log(row.length);
    if (row.length == 6) {
    //console.log(row.length);
    for(var i = 0; i < headers.length; i++){
        tmp[headers[i]] = row[i].toString();
        json.push(tmp);
    }
    // Add object to list
    //json.push(tmp);
    }
return;
    //console.log(tmp);
}); 

// Convert object to string, write json to file
fs.writeFileSync('log.json', JSON.stringify(json), 'utf8', 
function(err){console.log(err);});   */ 



app.use((req, res, next) => {
// write your logging code here
var source = req.headers['user-agent'];
source = source.replace( /,/g, "" );

//var result = JSON.stringify(source)+',' + JSON.stringify(date.toISOString())+',' + JSON.stringify(req.method) +',' + JSON.stringify(req.url) +',' + JSON.stringify('HTTP/'+req.httpVersion) +',"' + res.statusCode+'"';
var result = source+',' + date.toISOString()+',' + req.method+',' + req.url +',' + 'HTTP/'+req.httpVersion +',' + res.statusCode;

console.log(result);

 
next();
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
res.send('ok');
var source = req.headers['user-agent'];
source = source.replace( /,/g, "" );
var csvtitle = "Agent,Time,Method,Resource,Version,Status\n";

var csv = source + "," + date.toISOString() + "," + req.method + "," + req.url + ",HTTP/" + req.httpVersion.toString() + "," + res.statusCode + "\n";

if (fs.existsSync('log.csv')) {
    fs.appendFile('log.csv', csv, function(err) {
          if (err) throw err;
               // console.log("ok");
        });
} else {
    fs.writeFile('log.csv', csvtitle, function(err) {
          if (err) throw err;
                //console.log("ok");
        });
    fs.appendFile('log.csv', csv, function(err) {
          if (err) throw err;
                //console.log("ok");
        });
}
});



app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
var f = fs.readFileSync('log.csv', {encoding: 'utf-8'}, 
    function(err){console.log(err);});

// Split on row
f = f.split("\n");

// Get first row for column headers
headers = f.shift().split(",");

var json = [];    
f.forEach(function(d){
    // Loop through each row
    tmp = {}
    row = d.split(",");
    if (row.length == 6) {
    for(var i = 0; i < headers.length; i++){
        tmp[headers[i]] = row[i].toString();
        json.push(tmp);
    }
    // Add object to list
    
    }
    
});
   res.send(json);
  //res.sendFile("/Users/Viswanathan/oca/startnow-node101-log-all-the-things/log.json");
  

  
});
if(!module.parent){ 
    app.listen(port);
}
//console.log('server listening',port);
module.exports = app;
