/**
 * Created by vip on 15/4/1.
 */
var cp      = require( "child_process"),
    tool    = require( "../util/tool" ) ,
    log     = require( "../util/log" ) ,
    grunt   = require( "grunt" ) ,
    bower   = require( "bower" ) ,
    file    = require( "../util/file" ) ,
    _       = require( "underscore" ) ,
    self;

function initBootstrap(){
    log( "start load bootstrap" );
    bower.commands
        .install( [ "bootstrap" ] , { save : true } )
        .on( "end" , function( installed ){
            file.copy( self.bowerDir + "bootstrap/dist/css" , self.cwd + "src/css/lib" );
            file.copy( self.bowerDir + "bootstrap/dist/font" , self.cwd + "src/css/lib" );
            file.copy( self.bowerDir + "bootstrap/dist/js" , self.cwd + "src/js/bootstrap" );
            log( "bootstrap init success" );
        } );
}

function initKulor(){
    var _dir    = self.cacheDir + "kulor-git",
        _gitDir;
    if( grunt.file.isDir( _dir  ) ){
        cloneDone();
    } else {
        log("git clone...");
        _gitDir = "git@github.com:kulor-developer/kulor.git " + _dir;
        cp.exec( "git clone " + _gitDir , {cwd: self.cacheDir} , function( err , stdout , stderr ) {
            if (!err) {
                cloneDone();
                log("git clone success!");
            }
        });
    }
}

function cloneDone(){
    var _dir    = self.cacheDir + "kulor-git/";
    grunt.file.copy( _dir + "Gruntfile.js" , "Gruntfile.js"  );
    grunt.file.copy( _dir + "package.json" , "package.json"  );
    if( grunt.file.isDir( self.cwd + "src/" ) ){
        log( "folder src exsits..." );
    } else {
        file.copy( _dir + "src/js" , "src/js" );
        file.copy( _dir + "grunt" , "./grunt" );
        log( "kulor init success..." );
    }
    if( self.inputOpts.add == "bootstrap" ){
        initBootstrap();
    }
}

function readInitList(){
    var _json           = _.extend( { kulor   : "git@github.com:kulor-developer/kulor.git" } , tool.getUserKulorJson().initType );
    return _json;
}

function init(){
    var _json   = readInitList();
    self   = this;
    tool.checkGit( function(){
        initKulor();
    } );
}

module.exports = init;