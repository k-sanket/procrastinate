module.exports = function(grunt){
    // Project configuration.
    var concat = grunt.initConfig({
      concat: {
        options: {
          separator: ';',
        },
        js: {
          src: ['app/**/*.js','server/**/*.js','app/*.js','server.js'],
          dest: 'build/js/built.js',
        },
        css: {
          src: ['app/**/*.css','server/**/*.css'],
          dest: 'build/css/built.css',
        },
      },
      watch: {
        js: {
          files: ['app/**/*.js','server/**/*.js','app/*.js','server.js'],
          tasks: ['concat'],
        },
        css: {
          files: ['app/**/*.css','server/**/*.css'],
          tasks: ['concat'],
        },
      }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compress');

}
