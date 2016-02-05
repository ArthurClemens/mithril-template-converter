var fs = require('fs');
var browserify = require('browserify');
var babelify = require('babelify');

function bundle(entries, outfile) {
    browserify({
        entries: entries,
        extensions: ['.es6.js'],
        paths: ['.']
    })
    .transform(babelify, {presets: ['es2015']})
    .transform({
        global: true
    }, 'uglifyify')
    .bundle()
    .on('error', function(err) {
        console.log('Error : ' + err.message);
    })
    .pipe(fs.createWriteStream(outfile));
};

bundle([
    'app/index/index.es6.js'
], 'app.js');
