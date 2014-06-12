module.exports = function(grunt) {
    "use strict";

    grunt.loadNpmTasks("grunt-simple-mocha");

    grunt.initConfig({
        simplemocha: {
            options: {
                ignoreLeaks: false,
                ui: "bdd",
                useColors: !grunt.option("no-color")
            },

            unit: {
                src: [
                    "tests/unit/**/*_spec.js"
                ]
            },

            acceptance: {
                src: [
                    "tests/acceptance/**/*_spec.js"
                ]
            }
        }
    });

    grunt.registerTask("default", [ "simplemocha:unit" ]);
    grunt.registerTask("acceptance", [ "simplemocha:acceptance" ]);
};
