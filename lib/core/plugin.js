/**
 * Created by vip on 15/4/13.
 */
var grunt   = require( "grunt" ) ,
    log     = require( "../../util/log" ) ,
    cp      = require( "child_process" ),
    Install = require( "./install" ),
    install = new Install() ,
    tool    = {
    getPluginDir    : function(){
        var _cwd        = process.cwd(),
            _pluginDir  = false,
            _getDir     = function(){
                if( /src\/plugin$/.test( _cwd ) ){
                    _pluginDir = _cwd + "/";
                } else if( /\/src$/.test( _cwd ) ){
                    _pluginDir = _cwd + "/plugin";
                    grunt.file.mkdir( _pluginDir );
                } else if( grunt.file.isDir( "./src" ) ){
                    _cwd += "/src";
                    _getDir();
                }
            };
        _getDir();
        return _pluginDir;
    }
}

function Plugin(){
    this.config     = {
        dir     : tool.getPluginDir()
    }
}

Plugin.fn = Plugin.prototype;

/*!
 *  add plugin dependencies
 *  @param  pluginDir   {string}
 *  @param  dpArray     [ pluginName , pluginName... ]
 *  @param  callback    function
 *  @return plugin
 */
Plugin.fn.addDependencies     = function( pluginDir , dpArray , callback ){
    var _count          = dpArray.length,
        _dpInstallJson  = {},
        _bower          = "./bower_components";
    log( "install plugin dependencies." );
    for( var i = dpArray.length; i--; ){
        ( function( name ){
            cp.exec( "bower install " + name , { cwd : pluginDir } , function( err , stdout , stderr ){
                if( !err ){
                    stdout = stdout.replace( /\s+/gi , "" );
                    log( "install " + name + " success." );
                    if( /validate([\d|\.]+)againstgit/.test( stdout ) ){
                        _dpInstallJson[ name ] = "^" + stdout.replace( /.*validate([\d|\.]+)againstgit.*/ , "$1" );
                    } else if( /not-cachedgit/.test( stdout ) ){
                        _dpInstallJson[ name ] = stdout.replace( /.*archive\/([\d|\.]+)\.tar\.gz.*/ , "$1" );
                    } else {
                        _dpInstallJson[ name ] = true;
                    }
                }
                if( !--_count ){
                    install.resolveDependency( _bower , "./" , function(){
                        if( typeof callback == "function" ){
                            callback( _dpInstallJson );
                        }
                        install.removeBowerDir( _bower );
                    } , _dpInstallJson );
                }
            } );
        } )( dpArray[ i ] );
    }
    return this;
}

/*!
 *  initiliaze plugin develop env
 *  @param  kulorJson   {json}
 *  @param  callback    function
 *  @return plugin
 */
Plugin.fn.init  = function( kulorJson , callback ){
    var pluginDir   = this.config.dir + "/" + kulorJson.name;
    grunt.file.mkdir( pluginDir );
    this.addDependencies( pluginDir , kulorJson.dependencies , function( dpJson ){
        kulorJson.dependencies = dpJson;
        grunt.file.write( pluginDir + "/kulor.json" , JSON.stringify( kulorJson , null , '  ' ) + '\n' );
        grunt.file.write( pluginDir + "/" + kulorJson.main , "" );
        if( typeof callback === "function" ){
            callback( dpJson );
        }
    } );
    return this;
}

/*!
 *  check if has the plugin
 *  @param  pluginName  {string}
 */
Plugin.fn.hasPlugin = function( pluginName ){
    if( !this.config.dir ){
        return false;
    } else {
        return grunt.file.isDir( this.config.dir + pluginName );
    }
}

/*!
 *  @return boolean
 */
Plugin.fn.checkIsPluginDir = function(){
    return /src\/plugin\/[\d|\w|\-]+$/.test( process.cwd() );
}

module.exports = Plugin;