/**
 * Created by vip on 15/4/1.
 */
var cp      = require( "child_process"),
    grunt   = require( "grunt" ),
    tool    = require( "../util/tool" ) ,
    Install = require( "./core/install" );

function installDone( plugins , kulorJson ){
    var _dir    = "./bower_components/",
        _cwd    = this.cwd + "src/plugin",
        _self   = this,
        _count  = 0,
        _sh;
    if( !grunt.file.isDir( _cwd ) ){
        grunt.file.mkdir( _cwd );
    }
    for( var a  in plugins ){
        _count++;
        _sh = [
            "cp -rf" ,
            _dir + a,
            _cwd + "/"
        ].join( " " );
        cp.exec( _sh, {} , function( err , stdout , stderr ){
            if( !--_count ) {
                grunt.file.write("./kulor.json", JSON.stringify(kulorJson, null, "    "));
                _self.log("kulor install success.");
            }
        } );
    }
}

function install(){
    var _self   = this,
        _json   = {},
        _kulorJson,
        _plugins,
        _install= new Install();
    if( grunt.file.exists( "kulor.json" ) ){
        _kulorJson = grunt.file.readJSON( "kulor.json" );
    }
    tool.checkBower( function(){
        if( _self.options.inputOpts.add ){
            _kulorJson = _kulorJson || {};
            _kulorJson.plugins  = typeof _kulorJson.plugins == "object" ? _kulorJson.plugins : {};
            _plugins = tool.arrayToObject( tool.stringToArray( _self.options.inputOpts.add , [ "#" , ";" ] ) );
            for( var a in _plugins ){
                _json[ a ] = _plugins[ a ] || true;
                _kulorJson.plugins[ a ] = _json[ a ];
            }
        } else if( _kulorJson ){
            _json = typeof _kulorJson.plugins == "object" ? _kulorJson.plugins : {};
        } else {
            return _self.log( "kulor.json not exsits.." );
        }
        _install.addPlugins( _json , function(){
            installDone.call( _self , _json , _kulorJson );
        } );
    } );
}

module.exports = install;
