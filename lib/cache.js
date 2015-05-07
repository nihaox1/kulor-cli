/**
 * Created by vip on 15/4/1.
 */
var cp      = require( "child_process"),
    tool    = require( "../util/tool" ) ,
    grunt   = require( "grunt" ) ,
    log     = require( "../util/log" );

function clean(){
    var _dirs   = [
        this.options.baseFolder + "kulor-git"
    ];
    for( var i = _dirs.length; i--; ){
        if( grunt.file.isDir( _dirs[ i ] ) ){
            log( _dirs[ i ] );
            grunt.file.delete( _dirs[ i ] , { force : true } );
        }
    }
}

function init(){
    if( this.options.inputOpts.clean ){
        clean.call( this );
        log( "cache clean success." );
    } else {
        log( "error cmd input..." );
        log( "maybe `kulor cache -h` could help." );
    }
}

module.exports = init;

