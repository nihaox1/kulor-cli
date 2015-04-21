/**
 * Created by vip on 15/4/1.
 */
var cp      = require( "child_process"),
    tool    = require( "../util/tool" ) ,
    grunt   = require( "grunt" );

function initBootstrap(){
    var _self = this;
    _self.log( "start load bootstrap" );
    cp.exec( "bower install bootstrap" , {} , function( err , stdout , stderr ){
        if( !err && grunt.file.isDir( _self.bowerDir + "bootstrap" ) ){
            cp.exec( [
                "cp -rf" ,
                _self.bowerDir + "bootstrap/dist" ,
                _self.cwd + "src/css"
            ].join( " " ) , {} , function( err , stdout , stderr ){
                _self.log( err );
                if( !err ){
                    cp.exec( [
                        "mv" ,
                        _self.cwd + "src/css/js",
                        _self.cwd + "src/js/bootstrap"
                    ].join( " " ) , {} , function( err ){
                        _self.log( "bootstrap init success" );
                    } );
                }
            } );
        }
    } );
}

function init(){
    var _self   = this,
        _dir    = this.options.baseFolder,
        _cloneDone;
    _cloneDone = function(){
        _dir    += "kulor-git/";
        grunt.file.copy( _dir + "Gruntfile.js" , "Gruntfile.js"  );
        grunt.file.copy( _dir + "package.json" , "package.json"  );
        if( grunt.file.isDir( _self.cwd + "src/" ) ){
            _self.log( "folder src exsits..." );
        } else {
            cp.exec( "mkdir src" );
            cp.exec( "cp -rf " + _dir + "src/js src/js" );
            cp.exec( "cp -rf " + _dir + "grunt ." );
            _self.log( "kulor init success..." );
        }
        if( _self.options.inputOpts.add == "bootstrap" ){
            initBootstrap.call( _self );
        }
    };
    tool.checkGit( function(){
        if( grunt.file.isDir( _dir + "kulor-git/" ) ){
            _cloneDone();
        } else {
            _self.log("git clone...");
            cp.exec( "git clone git@github.com:kulor-developer/kulor.git" , {cwd: _dir} , function( err , stdout , stderr ) {
                if (!err) {
                    _cloneDone();
                    _self.log("git clone success!");
                }
            });
        }
    } );
}

module.exports = init;

