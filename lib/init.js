/**
 * Created by vip on 15/4/1.
 */
var cp      = require( "child_process"),
    tool    = require( "../util/tool" ) ,
    grunt   = require( "grunt" );

function init(){
    var _self   = this,
        _dir    = this.options.baseFolder,
        _cloneDone;
    _cloneDone = function(){
        _dir    += "kulor-git/";
        grunt.file.copy( _dir + "Gruntfile.js" , "Gruntfile.js"  );
        grunt.file.copy( _dir + "package.json" , "package.json"  );
        if( grunt.file.isDir( _self + "src/" ) ){
            _self.log( "folder src exsits..." );
        } else {
            cp.exec( "mkdir src" );
            cp.exec( "cp -rf " + _dir + "src/js src/js" );
            cp.exec( "cp -rf " + _dir + "grunt ." );
            _self.log( "kulor init success..." );
        }
    };
    tool.checkGit( function(){
        if( grunt.file.isDir( _dir + "kulor-git/" ) ){
            _cloneDone();
        } else {
            _self.log("git clone...");
            cp.exec( "git clone https://github.com/nihaox1/kulor kulor-git" , {cwd: _dir} , function( err , stdout , stderr ) {
                if (!err) {
                    _cloneDone();
                    _self.log("git clone success!");
                }
            });
        }
    } );
}

module.exports = init;

