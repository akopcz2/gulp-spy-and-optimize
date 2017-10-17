const gulp = require('gulp');
const globby = require('globby');
const fs = require('fs');
const imagemin = require('gulp-imagemin');
const imageminJpegoptim = require('imagemin-jpegoptim');
const extend = require('./lib/extend');

// The following object is an exaple of a path that will be set inside you gulpfile.js
// Required to make spyAndOptimize Work
const paths = {
    watch: {
        src: './site-sections/**/src/images/'
    }
}

const pluginName = 'SPY_AND_OPTIMIZE';

class SpyAndOptimize {
    constructor(options) {

        this.defaults = {
            path: '/public/static/images'
        };

        this.settings = extend({}, this.defaults, options);
        this.init(path);
    }
    
    /**
     * Takes a single argument(string) and passes it to the gatherImages method
     * @param {string} path - string of path where images are located
     */
    init(path){
        let hasPath = (path) ? this.gatherImages(path) :  console.log(pluginName + ' Caused an error. Missing a path. Please pass a path to the plugin');
    }

    /**
     * Takes an file (string) and runs it through the image optimizer
     * @param {string} file - string of file to optimize
     */
    optimizeImage(file) {
        gulp.src(file)
        .pipe(imagemin([
            imagemin.gifsicle(),
            imageminJpegoptim({
                stripAll: false,
                stripIcc: false
            }),
            imagemin.optipng({ optimizationLevel: 7 }),
            imagemin.svgo()
        ], {
            verbose: true
        }));
    }

    /**
     * Takes an directory(string) and crawls the directory and 
     * watches for any changes such as a rename, addition, or deletiong
     * @param {string} path - string of path where images are located
     */
    gatherImages(path){
        globby(path).then(paths => {
            for(let i = 0; i < paths.length; i++) {
                let currentPath = paths[i];
                let fileThatChanged;
                fs.watch(paths[i], (eventType, filename) => {
                    console.log(`event type is: ${eventType}`);
                    if (filename) {
                        console.log(`filename provided: ${filename}`);
                    } else {
                        console.log('filename not provided');
                    }
                    fileThatChanged = currentPath + filename;
                    this.optimizeImage(fileThatChanged);
                });
            }
        });
    }
}
module.exports = new SpyAndOptimize();






