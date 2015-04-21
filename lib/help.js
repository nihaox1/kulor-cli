/**
 * Created by vip on 15/4/3.
 */
var grunt   = require( "grunt" ),
    cmds    = require( "../util/cmds" );
module.exports = function(){
    var _name       = cmds.cmd[ process.argv[ 2 ] ],
        _docFile    = this.options.baseFolder + "util/helper/" + _name + ".json",
        _json,
        _space      = "    ";
    if( grunt.file.isFile( _docFile ) ){
        _json   = grunt.file.read( _docFile );
    } else {
        _json   = grunt.file.read( this.options.baseFolder + "util/helper/help.json" );
    }
    _json   = JSON.parse( _json );
    if( _json.command ){
        this.log( "command  : " + _json.command );
    }

    if( _json.description ){
        this.log( "description : " );
        this.log( _space + _json.description );
        this.log( "" );
    }

    if( _json.usage ){
        this.log( "Usage : " );
        for( var i = 0, len = _json.usage.length; i < len; i++ ){
            this.log( _space + _json.usage[ i ] );
        }
        this.log( "" );
    }

    if( _json.commands ){
        this.log( "Commands :" );
        for( var a in _json.commands ){
            this.log( _space + a + _space + _json.commands[ a ] );
        }
        this.log( "" );
    }

    if( _json.options ){
        this.log( "Options : " );
        for( var i = 0, len = _json.options.length; i < len; i++ ){
            this.log( _space + _json.options[ i ].shorthand + " , " + _json.options[ i ].flag + _space + _json.options[ i ].description );
        }
    }
};