const express = require('express');
const bodyParser = require('body-parser');
const app = express();
//const path = require('path');
const port = 3000;
const busboy = require('connect-busboy'); //middleware for form/file upload
const fs = require('fs-extra');       //File System - for file manipulation

// enable res.sendFile(filename) by providing access to the files in /views
app.use(express.static(__dirname + '/views'));

app.use(busboy());

// use bodyParser to enable POST
app.use(bodyParser.urlencoded({
   extended: false
}));

app.get('/', (req, res) => {
	res.sendFile("index.html");
})

app.route('/upload')
	.post(function (req, res, next) {
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);

            //Path where file will be uploaded
            fstream = fs.createWriteStream(__dirname + '/file_transfer/uploads/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
                res.redirect('uploaded.html');	//where to go next
            });
        });
    });

app.listen(port, () => console.log(`Listening on port ${port}`))