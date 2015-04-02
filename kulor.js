/**
 * Created by vip on 15/3/31.
 */
var cmds    = require( "./util/cmds" );

function kulor(){
    this.options = {};
    this.log    = require( "./util/log" );
    this.grunt  = require( "./node_modules/grunt" );
    this.cwd    = process.cwd();
}

kulor.fn = kulor.prototype;

kulor.fn.require = function( moduleName , newModuleName ){
    this[ newModuleName || moduleName ] = require( "./lib/" + moduleName );
    return this;
};

kulor.fn.init = function(){
    var _cmd, _args;
    this.package    = JSON.parse( this.grunt.file.read( "./package.json" ) );
    this.log( "kulor version :" + this.package.version );
    if( process.argv.length >= 3 ){
        _cmd = cmds[ process.argv[ 2 ] ];
        _args = Array.prototype.slice.call( process.argv ).slice( 3 );
        if( _cmd ){
            this.require( _cmd );
            this[ _cmd].apply( this , _args );
        }
    }
};

new kulor().init();