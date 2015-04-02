/**
 * Created by vip on 15/4/1.
 */
var cp = require( "child_process" );

function init(){
    var _self   = this,
        _dir    = "./kulor",
        _cloneDone;
    _cloneDone = function(){
        _self.grunt.file.copy( _dir + "/Gruntfile.js" , "../Gruntfile.js"  );
        _self.grunt.file.copy( _dir + "/package.json" , "../package.json"  );
        if( _self.grunt.file.isDir( "../src" ) ){
            _self.log( "folder src exsits..." );
        } else {
            cp.exec( "mkdir ../src" );
            cp.exec( "cp -rf " + _dir + "/src/js ../src/js" );
            cp.exec( "cp -rf " + _dir + "/grunt ../" );
            _self.log( "kulor init success..." );
        }
    };
    if( this.grunt.file.isDir( _dir ) ){
        _cloneDone();
    } else {
        this.log("git clone...");
        cp.exec( "sh/cli.sh" , {cwd: this.cwd} , function( err , stdout , stderr ) {
            if (!err) {
                _cloneDone();
                _self.log("git clone success!");
            }
        });
    }
}

module.exports = init;

