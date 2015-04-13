/**
 * Created by vip on 15/4/7.
 */
var cp          = require( "child_process" ),
    inquirer    = require( "inquirer" ),
    Plugin      = require( "core/plugin" );

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

function initPlugin( pluginName , pluginDir ){
    var _self = this;
    cp.exec( "bower --version" , {} , function( err , stdout , stderr ){
        if( !stderr ){
            initBowerJson.call( _self , pluginName , function( json ){
                _self.grunt.file.mkdir( pluginDir );
                _self.grunt.file.write( pluginDir + "/kulor.json" , JSON.stringify( json , null , '  ' ) + '\n' );
                _self.grunt.file.write( pluginDir + "/" + json.main , "" );
                _self.log( "install plugin dependencies." );
                for( var i = json.dependencies.length; i--; ){
                    ( function( name ){
                        cp.exec( "bower install " + name , { cwd : pluginDir } , function( err ){
                            if( !err ){
                                _self.log( "install " + name + " success." );
                            }
                        } );
                    } )( json.dependencies[ i ] );
                }
            } );
        } else {
            _self.log( "bower should be installed." );
        }
    } );
}

function searchKulorPluginDir( pluginName ){
    var _pluginDir;
    if( /src\/plugin\/$/.test( this.cwd ) ){
        _pluginDir = "./" + pluginName;
    } else if( this.grunt.file.isDir( "./src" ) ){
        if( !this.grunt.file.isDir( "src/plugin" ) ){
            this.grunt.file.mkdir( "src/plugin" );
        }
        _pluginDir = "src/plugin/" + pluginName;
        this.grunt.file.delete( _pluginDir );
    } else {
        this.log( "kulor should be initilize..." );
        this.log( "run \"kulor init\" to resolve." );
    }
    if( _pluginDir ){
        if( this.grunt.file.isDir( _pluginDir ) ){
            this.log( "plugin exsist..." );
        } else {
            initPlugin.call( this , pluginName , _pluginDir );
        }
    }
}

function init(){
    var _self       = this,
        _plugin     = new Plugin();
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
        if( _plugin.hasPlugin( answers.name ) ){
            _self.log( "plugin exsist..." );
        } else {
            searchKulorPluginDir.call( _self , answers.name );
        }
    } );
}

module.exports = init;