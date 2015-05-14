/**
 * Created by vip on 15/4/7.
 */
var grunt       = require( "grunt" ),
    inquirer    = require( "inquirer" ),
    log         = require( "../util/log" ) ,
    Plugin      = require( "./core/plugin" ),
    self;

function stringToArray( str ){
    var _al     = str.split( ";" ),
        _rtn    = [];
    for( var i = 0, len = _al.length; i < len; i++ ){
        _rtn.push( _al[ i ] );
    }
    return _rtn;
}

function initBowerJson( name , callback ){
    var _Q      = [
            {
                message     : "plugin name(" + name + ") :" ,
                name        : "name" ,
                default     : name ,
                type        : "input"
            } ,
            {
                message     : "name(" + name + ") use in requireJs :" ,
                name        : "requireName" ,
                default     : name ,
                type        : "input"
            } ,
            {
                message     : "require js file name( " + name + " ) :" ,
                name        : "jsFileName" ,
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
    initBowerJson( pluginName , function( json ){
        plugin.init( json );
    } );
}

function makeNewPlugin( plugin ){
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
            log( "plugin exsist..." );
        } else {
            initPluginJson( answers.name , plugin );
        }
    } );
}

function addPluginDependencies( plugin ){
    var _json,
        _kulorFile;
    plugin.addDependencies( self.cwd , stringToArray( self.inputOpts.add ) , function( json ){
        _kulorFile = self.cwd + "/kulor.json";
        log( "add plugin dependencies success..." );
        _json = JSON.parse( grunt.file.read( _kulorFile ) );
        for( var a in json ){
            _json.dependencies[ a ] = json[ a ];
        }
        grunt.file.write( _kulorFile , JSON.stringify( _json , null , "    " ) );
    } );
}

function init(){
    var _plugin     = new Plugin();
    self    = this
    if( self.inputOpts.add ) {
        addPluginDependencies( _plugin );
    } else {
        makeNewPlugin( _plugin );
    }
}

module.exports = init;