const express = require('express');
const bodyParser = require('body-parser');
const app = express();
//const path = require('path');
const port = 3000;
const busboy = require('connect-busboy'); //middleware for form/file upload
const fs = require('fs-extra');       //File System - for file manipulation
const zip = require('express-zip');


// use files in /views directory as static files
app.use(express.static(__dirname + '/views'));

// use files in /public directory as static files
app.use(express.static(__dirname + '/public'));

app.use(busboy());

// use bodyParser to enable POST
app.use(bodyParser.urlencoded({
   extended: false
}));

app.get('/', (req, res) => {
	res.sendFile("index.html");
})

app.get('/download', (req, res) => {
    fs.readdir(__dirname + '/file_transfer/downloads/', function(err, items) {
        console.log(items);
        
        files = [];
        for (var i=0; i<items.length; i++) {
            console.log(items[i]);
            name = items[i];
            dir = __dirname + '/file_transfer/downloads/' + name;
            files.push({path: dir, name: name});
        }
        res.zip(files, "download.zip");
    });
})

app.get('/download/filenames', (req, res) =>{
    fs.readdir('file_transfer/downloads/', function(err, items) {
        console.log(items);
        
        filenames = [];
        for (var i=0; i<items.length; i++) {
            console.log(items[i]);
            name = items[i];
            filenames.push(name);
        }
        res.send(filenames);
    });
})

app.get('/download/:filename', function(req, res) {
    console.log(req.params.filename);
    filename = req.params.filename;
    res.download('file_transfer/downloads/'+filename);
});

app.route('/upload')
	.post(function (req, res, next) {
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log('Uploading: ' + filename);

            //Path where file will be uploaded
            fstream = fs.createWriteStream(__dirname + '/file_transfer/uploads/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log('Upload Finished of ' + filename);              
                res.redirect('uploaded.html');	//where to go next
            });
        });
    });



app.listen(port, () => console.log(`Listening on port ${port}`))