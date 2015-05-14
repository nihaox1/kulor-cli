/**
 * Created by vip on 15/4/1.
 */
var bower   = require( "bower" ) ,
    grunt   = require( "grunt" ) ,
    log     = require( "../util/log" ),
    self;

function clean(){
    var _dir = self.baseFolder + "userCache";
    if( grunt.file.isDir( _dir ) ){
        grunt.file.delete( _dir , { force : true } );
    }
    grunt.file.mkdir( _dir );
    bower.commands.cache.clean();
}

function init(){
    self    = this;
    if( this.inputOpts.clean ){
        clean();
        log( "cache clean success." );
    } else {
        log( "error cmd input..." );
        log( "maybe `kulor cache -h` could help." );
    }
}

module.exports = init;

