const fs = require('fs-extra');       //File System - for file manipulation
const express = require('express');
var router = express.Router();


router.get('/', (req, res) => {
	res.sendFile("index.html");
})

router.get('/download', (req, res) => {
    fs.readdir('file_transfer/downloads/', function(err, items) {
        console.log(items);

        files =[];
        for (var i=0; i<items.length; i++) {
            console.log(items[i]);
            name = items[i];
            dir = __dirname + 'file_transfer/downloads/' + name;
            files.push({path: dir, name: name});
        }
        res.zip(files, "download.zip");
    });
})

router.get('/download/filenames', (req, res) =>{
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

router.get('/download/:filename', function(req, res) {
    console.log(req.params.filename);
    filename = req.params.filename;
    res.download('file_transfer/downloads/'+filename);
});

router.route('/upload')
	.post(function (req, res, next) {
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log('Uploading: ' + filename);

            //Path where file will be uploaded
            fstream = fs.createWriteStream('file_transfer/uploads/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log('Upload Finished of ' + filename);              
                res.redirect('uploaded.html');	//where to go next
            });
        });
    });

module.exports = router;