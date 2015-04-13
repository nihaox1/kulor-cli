/**
 * Created by vip on 15/4/13.
 */
var grunt   = require( "grunt" ) ,
    tool    = {
    getPluginDir    : function(){
        var _cwd        = process.cwd(),
            _pluginDir  = false;
        if( /src\/plugin\/$/.test( _cwd ) ){
            _pluginDir = _cwd + "/";
        } else if( grunt.file.isDir( "./src" ) ){
            if( !grunt.file.isDir( "src/plugin" ) ){
                grunt.file.mkdir( "src/plugin" );
            }
            _pluginDir = _cwd + "src/plugin/";
        }
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
 *  @param  dpArray     [ pluginName , pluginName... ]
 *  @param  callback    function
 *  @return plugin
 */
Plugin.fn.addDependencies     = function( dpArray , callback ){
    return this;
}

/*!
 *  initiliaze plugin develop env
 *  @param  kulorJson   {json}
 *  @param  callback    function
 *  @return plugin
 */
Plugin.fn.init  = function( kulorJson , callback ){
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

module.exports = Plugin;