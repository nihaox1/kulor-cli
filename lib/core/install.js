/**
 * Created by vip on 15/4/14.
 */
var cp      = require( "child_process" ) ,
    log     = require( "../../util/log" ),
    grunt   = require( "grunt" ) ,
    bower   = require( "bower" ) ,
    file    = require( "../../util/file" ) ,
    tool;

tool = {
    analysis : function( str ){
        var _name,
            _ver;
        if( str.indexOf( "no cache" ) > -1 ){
            log( a + " package not found..." );
        } else {
            _name   = str.replace( /bower.([^\#]*).*/ , "$1").replace( /\n.*/ , "" );
            _ver    = str.replace( /.*\#([\d|\.]*).*/ , "$1").replace( /\n.*/ , "" );
            log( "package name : " + _name + "version : " + _ver );
        }
        return _name;
    }
}

function Install(){}

Install.fn = Install.prototype;

Install.fn.addPlugins = function( json , callback ){
    var _plugins    = [] ,
        _pluginName = [];
    for( var a in json ){
        _plugins.push( a + ( json[ a ] === true ? "" : ( "#" + json[ a ] ) ) );
        _pluginName.push( a );
    }
    bower.commands
        .install( _plugins , { save : true } )
        .on( "end" , function( installed ){
            callback( _pluginName );
        } );
}

Install.fn.resolveDependency = function( bowerDir , pluginDir , callback , plugins ){
    var _bower,
        _self   = this,
        _count  = 0;
    if( !plugins ){
        _bower  = pluginDir + "/.bower.json";
        if( grunt.file.isFile( _bower ) ){
            plugins = JSON.parse( grunt.file.read( _bower )).dependencies;
        }
    }
    for( var a in plugins ){
        _count++;
        ( function( bowerPluginDir , pluginDetailDir ){
            file.copy( bowerPluginDir , pluginDir );
            _self.resolveDependency( bowerPluginDir , pluginDetailDir );
            if( !--_count ){
                if( typeof callback == "function" ){ callback(); }
            }
        } )( bowerDir + a , pluginDir + a );
    }
}

Install.fn.removeBowerDir = function( bowerDir ){
    cp.exec( "rm -rf " + bowerDir );
}

module.exports = Install;