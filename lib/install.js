/**
 * Created by vip on 15/4/1.
 */
var cp      = require( "child_process"),
    grunt   = require( "grunt" ),
    tool    = require( "../util/tool" ) ,
    log     = require( "../util/log" ) ,
    Install = require( "./core/install" ),
    install = new Install(),
    self;

function installDone( plugins , kulorJson ){
    var _dir    = "./bower_components/",
        _cwd    = self.cwd + "src/plugin";

    if( !grunt.file.isDir( _cwd ) ){
        grunt.file.mkdir( _cwd );
    }
    install.resolveDependency( _dir , _cwd , function(){
        grunt.file.write( "./kulor.json", JSON.stringify(kulorJson, null, "    "));
        log("kulor install success.");
    } , plugins );
}

function installInit(){
    var _json   = {},
        _kulorJson,
        _plugins;
    self   = this;
    if( grunt.file.exists( "kulor.json" ) ){
        _kulorJson = grunt.file.readJSON( "kulor.json" );
    }
    tool.checkBower( function(){
        if( self.inputOpts.add ){
            _kulorJson = _kulorJson || {};
            _kulorJson.plugins  = typeof _kulorJson.plugins == "object" ? _kulorJson.plugins : {};
            _plugins = tool.arrayToObject( tool.stringToArray( self.inputOpts.add , [ "#" , ";" ] ) );
            for( var a in _plugins ){
                _json[ a ] = _plugins[ a ] || true;
                _kulorJson.plugins[ a ] = _json[ a ];
            }
        } else if( _kulorJson ){
            _json = typeof _kulorJson.plugins == "object" ? _kulorJson.plugins : {};
        } else {
            return log( "kulor.json not exsits.." );
        }
        install.addPlugins( _json , function(){
            installDone( _json , _kulorJson );
        } );
    } );
}

module.exports = installInit;