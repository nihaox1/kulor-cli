/**
 * Created by vip on 15/4/7.
 */
var cp          = require( "child_process" ),
    grunt       = require( "grunt" ),
    inquirer    = require( "inquirer" ),
    Plugin      = require( "./core/plugin" );

function stringToArray( str ){
    var _al     = str.split( ";" ),
        _rtn    = [];
    for( var i = 0, len = _al.length; i < len; i++ ){
        _rtn.push( _al[ i ] );
    }
    return _rtn;
}

function initBowerJson( name , callback ){
    var _self   = this,
        _Q      = [
            {
                message     : "plugin name(" + name + ") :" ,
                name        : "name" ,
                default     : name ,
                type        : "input"
            } ,
            {
                message     : "plugin version(0.0.1) :" ,
                name        : "version" ,
                default     : "0.0.1" ,
                type        : "input"
            } ,
            {
                message     : "plugin description :" ,
                name        : "description" ,
                default     : null ,
                type        : "input"
            } ,
            {
                message     : "plugin main file :" ,
                name        : "main" ,
                default     : "index.jade" ,
                type        : "input"
            } ,
            {
                message     : "plugin keywords , split by ';' :" ,
                name        : "keywords" ,
                default     : null ,
                type        : "input"
            } ,
            {
                message     : "bower component dir : " ,
                name        : "bowerDir" ,
                default     : "bower_component" ,
                type        : "input"
            } ,
            {
                message     : "plugin author :" ,
                name        : "authors" ,
                default     : null ,
                type        : "input"
            } ,
            {
                message     : "plugin email :" ,
                name        : "email" ,
                default     : null ,
                type        : "input"
            } ,
            {
                message     : "plugin license :" ,
                name        : "license" ,
                default     : "MIT",
                type        : "input"
            } ,
            {
                message     : "plugin homepage :" ,
                name        : "homepage" ,
                default     : null ,
                type        : "input"
            } ,
            {
                message     : "plugin dependencies , split by ';' :" ,
                name        : "dependencies" ,
                default     : null ,
                type        : "input"
            }
        ];
    inquirer.prompt( _Q , function( answers ){
        answers.dependencies    = stringToArray( answers.dependencies );
        answers.keywords        = stringToArray( answers.keywords );
        console.log( answers );
        inquirer.prompt( [ {
            message     : "Is the kulor.json look good ?" ,
            default     : true ,
            name        : "good" ,
            type        : "confirm"
        } ] , function( answer ){
            if( answer.good ){
                callback( answers );
            } else {
                process.exit();
            }
        } );
    } );
}

function initPluginJson( pluginName , plugin ){
    var _self = this;
    cp.exec( "bower --version" , {} , function( err , stdout , stderr ){
        if( !stderr ){
            initBowerJson.call( _self , pluginName , function( json ){
                plugin.init( json );
            } );
        } else {
            _self.log( "bower should be installed." );
        }
    } );
}

function makeNewPlugin( plugin ){
    var _self = this;
    inquirer.prompt( [
        {
            message     : "input the plugin name :" ,
            default     : null ,
            name        : "name" ,
            type        : "input" ,
            validate    : function( cmd ){
                if( /^[\d|\w|\_\-]+$/.test( cmd ) ){
                    return true;
                } else {
                    return "plugin name error!";
                }
            }
        }
    ] , function( answers ){
        if( plugin.hasPlugin( answers.name ) ){
            _self.log( "plugin exsist..." );
        } else {
            initPluginJson.call( _self , answers.name , plugin );
        }
    } );
}

function addPluginDependencies( plugin ){
    var _self = this,
        _json,
        _kulorFile;
    plugin.addDependencies( _self.options.cwd , stringToArray( _self.options.inputOpts.add ) , function( json ){
        _kulorFile = process.cwd() + "/kulor.json";
        _self.log( "add plugin dependencies success..." );
        _json = JSON.parse( grunt.file.read( _kulorFile ) );
        for( var a in json ){
            _json.dependencies[ a ] = json[ a ];
        }
        grunt.file.write( _kulorFile , JSON.stringify( _json , null , "    " ) );
    } );
}

function init(){
    var _self       = this,
        _plugin     = new Plugin();
    if( _self.options.inputOpts.add ) {
        addPluginDependencies.call( _self , _plugin );
    } else {
        makeNewPlugin.call( _self , _plugin );
    }
}

module.exports = init;