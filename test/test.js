const request = require('supertest');
const app = require('../app'); //reference to your app.js file
const fs = require('fs-extra'); //File System - for file manipulation

describe('GET /', function() {
    it('should open index.html', function (done){
        request(app)
            .get('/')
            .expect('Content-Type', 'text/html; charset=UTF-8')
            .expect(200, done)
    })
})

describe('GET /download', function () {
    it('should download a file in the download directory', function (done) {
    	// create a dummy file
        dir = 'file_transfer/downloads/dummy.txt';
        createFile(dir);
        request(app)
            .get('/download')
            .expect('Content-Type', 'application/zip')
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                deleteFile(dir);
                done();
            })
    })
})

describe('GET /download/filenames', function(){
    it('should respond with a list of file names whose files are in the download folder', function (done) {
        dir = 'file_transfer/downloads/dummy.txt';
        createFile(dir);
        request(app)
            .get('/download/filenames')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect('["dummy.txt"]')
            .end((err) => {
                if (err) return done(err);
                deleteFile(dir);
                done(); 
            })
    })
})

describe('GET /download/:filename', function(){
    it ('should download a file with filename given', function (done){
        dir = 'file_transfer/downloads/dummy.txt';
        createFile(dir);
        request(app)
            .get('/download/dummy.txt')
            .expect('Content-Type', 'text/plain; charset=UTF-8')
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                deleteFile(dir);
                done();
            })
    })
})

describe('POST /upload', function(){
    it ('should upload a file', function (done){
        dir = 'dummy.txt';
        createFile(dir);
        request(app)
            .post('/upload')
            .attach('fileUploaded', dir)
            .expect(302)
            .end((err) => {
                if (err) return done(err);
                deleteFile(dir);
                deleteFile('file_transfer/uploads/'+dir);
                done(); 
            })
    })
})

function createFile(dir){
    fs.closeSync(fs.openSync(dir, 'w'));  
}

function deleteFile(dir){
    fs.unlinkSync(dir);
}
