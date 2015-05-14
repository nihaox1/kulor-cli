/**
 * Created by vip on 15/4/1.
 */
var cp      = require( "child_process"),
    tool    = require( "../util/tool" ) ,
    log     = require( "../util/log" ) ,
    grunt   = require( "grunt" ) ,
    bower   = require( "bower" ) ,
    file    = require( "../util/file" ) ,
    _       = require( "underscore" ) ,
    self;

function readInitList(){
    var _json           = _.extend( {
            kulor   : "git@github.com:kulor-developer/kulor.git"
    } , tool.getUserKulorJson().initType );
    return _json;
}

/*!
 *  init single type
 *  git clone & run kulorBuild.js
 */
function getSingleAddType( typeName , gitUrl , callback ){
    var _dir    = self.cacheDir + typeName,
        _cmds   = [
            "git clone"
        ],
        _done   = function( err ){
            if( !err ) {
                if( grunt.file.isFile( _dir + "/kulorBuild.js" ) ){
                    require( _dir + "/kulorBuild" ).call( self , bower , grunt , tool , log , callback );
                    log ("init " + typeName + " success!");
                }
            }
        };
    if( grunt.file.isDir( _dir  ) ){
        _done( false );
    } else {
        _cmds.push( gitUrl );
        _cmds.push( _dir );
        cp.exec( _cmds.join( " " ) , {cwd: self.cacheDir} , function( err ) {
            _done( err );
        });
    }
}

function init(){
    var _json       = readInitList(),
        _addList    = [ "kulor" ],
        _buildCount;
    self   = this;
    tool.file   = file;
    tool.checkGit( function(){
        if( self.inputOpts.add instanceof Array ){
            _addList    = _addList.concat( self.inputOpts.add );
        } else if( self.inputOpts.add ){
            _addList.push( self.inputOpts.add );
        }
        for( var i = 0, len = _addList.length; i < len; i++ ){
            if( _json[ _addList[ i ] ] ){
                _buildCount++;
                getSingleAddType( _addList[ i ] , _json[ _addList[ i ] ] , function(){
                    if( !--_buildCount ) {
                        log( "kulor init completed." );
                    }
                } );
            } else {
                log( _addList[ i ] + " not found." );
            }
        }
    } );
}

module.exports = init;