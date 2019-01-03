const fs = require('fs-extra');       //File System - for file manipulation
const express = require('express');
var router = express.Router();


router.get('/', (req, res) => {
	res.sendFile("index.html");
})

router.get('/download', (req, res) => {
    fs.readdir('file_transfer/downloads/', (err, items) => {
        files =[];
        for (var i=0; i<items.length; i++) {
            name = items[i];
            dir = 'file_transfer/downloads/' + name;
            files.push({path: dir, name: name});
        }
        res.zip(files, "download.zip", (err) => {
            if (err) throw err;
        });
    });
})

router.get('/download/filenames', (req, res) =>{
    fs.readdir('file_transfer/downloads/', (err, items) => {
        filenames = [];
        for (var i=0; i<items.length; i++) {
            name = items[i];
            filenames.push(name);
        }
        res.send(filenames);
    });
})

router.get('/download/:filename', (req, res) => {
    filename = req.params.filename;
    res.download('file_transfer/downloads/'+filename);
});

router.route('/upload')
	.post(function (req, res, next) {
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            //Path where file will be uploaded
            fstream = fs.createWriteStream('file_transfer/uploads/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {        
                res.redirect('uploaded.html');	//where to go next
            });
        });
    });

module.exports = router;