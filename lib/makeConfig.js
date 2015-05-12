/**
 * Created by vip on 15/4/21.
 */
var grunt   = require( "grunt"),
    log     = require( "../util/log" ),
    tool    = require( "../util/tool" ),
    _       = require( "underscore" ) ,
    bowerDir,
    self;

/*!
 *  put kulor.json paths into requireConfig
 *  @json   {json}  requireConfig.js
 */
function userPushRequireConfig( json ){
    var _json,
        _paths = json.paths;
    if( grunt.file.isFile( "kulor.json" ) ){
        _json = JSON.parse( grunt.file.read( "kulor.json" ) );
        if( _json.requireConfig ){
            _.extend( _paths , _json.requireConfig.paths );
            _.extend( json , _json.requireConfig );
            json.paths = _paths;
        }
    }
}

/*!
 *  makeup plugin path into requrieConfig.js
 *  read plugin's kulor.json    & makeup plugin name
 *  plugin developer should makeup kulor config into bower.json
 *  @json   {json}      requireConfig
 *  @dir    {string}    pluginDir
 */
function getPluginConfig( json , dir ){
    var _kulorJson;
    grunt.file.recurse( dir , function( abspath, rootdir, subdir, filename ){
        if( filename == "bower.json" ){
            _kulorJson  = grunt.file.readJSON( abspath).kulor;
            json.paths[ tool.getKeyName( _kulorJson.requireName ) ]    = "js/plugin/" + _kulorJson.jsFileName;
        }
    } );
}

function getRequireConfig(){
    var _json = {
            baseUrl     : "/" ,
            paths       : {}
        } ,
        _pluginDir = "src/plugin";
    if( grunt.file.isDir( "src/js/util/" ) ){
        grunt.file.recurse( "src/js/util/" , function( abspath, rootdir, subdir, filename ){
            var _name = tool.getKeyName( filename ),
                _path = "js/util/" + filename.replace( ".js" , "" );
            if( grunt.file.isFile( abspath ) ){
                _json.paths[ _name ] = _path;
            }
        } );
        if( grunt.file.isDir( _pluginDir ) ){
            getPluginConfig( _json , _pluginDir );
        }
        userPushRequireConfig( _json );
        grunt.file.write( "src/js/requireConfig.js" , "require.config(" + JSON.stringify( _json , null , "    " ) + ")" );
        log( "make requireFile.json success." );
    } else {
        log( "kulor util not found." );
    }
}

function init(){
    bowerDir    = this.bowerDir;
    self        = this;
    getRequireConfig();
}

module.exports = init;