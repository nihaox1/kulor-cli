/**
 * Created by vip on 15/4/21.
 */
var grunt   = require( "grunt"),
    log     = require( "../util/log" ),
    tool    = require( "../util/tool" ),
    _       = require( "underscore" ) ,
    bowerDir;

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

function getPluginConfig( json , dir ){
    var _kulorJson,
        _name,
        _jsFile;
    grunt.file.recurse( dir , function( abspath, rootdir, subdir, filename ){
        if( filename == "kulor.json" ){
            _kulorJson  = JSON.parse( grunt.file.read( abspath ));
            _name       = _kulorJson.requireName;
            _jsFile     = _kulorJson.jsFileName;
        } else if( filename != bowerDir && grunt.file.isDir( abspath ) ){
            getPluginConfig( json , abspath );
        }
    } );
    if( _name && _jsFile ){
        json.paths[ tool.getKeyName( _name ) ]    = "js/plugin/" + _jsFile;
    }
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
    bowerDir = this.bowerDir;
    getRequireConfig();
}

module.exports = init;