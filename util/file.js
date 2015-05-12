var fs      = require( "fs" ) ,
    log     = require( "./log" ) ,
    path    = require( "path" ) ,
    grunt   = require( "grunt" );

var file    = module.exports    = {} ,
    pathSplitString             = /[\/|\\]/g;

function copySingleFile( filePath , rootDir , targetDir ){
    var _dir = filePath.split( pathSplitString ).slice( 0 , -1 ).join( "/" );
    if( !grunt.file.exists( _dir ) ){
        grunt.file.mkdir( _dir );
    }
    _dir            = filePath.replace( rootDir , targetDir );
    grunt.file.copy( filePath , _dir );
}


/*!
 *  允许递归文件夹式的copy
 */
file.copy   = function( src , target ){
    var _paths  = [];
    src     = src.replace( /[\\|\/]$/ , "" );
    target  = target.replace( /[\\|\/]$/ , "" );
    if( grunt.file.isFile( src ) ){
        grunt.file.copy( src , target );
    } else if( grunt.file.isDir( src ) ){
        grunt.file.recurse( src , function( filepath ){
            if( grunt.file.isFile ){
                _paths.push( filepath );
            } else {
                log( filepath );
            }
        } );
        for( var i = 0 , len = _paths.length; i < len; i++ ){
            copySingleFile( _paths[ i ] , src , target );
        }
    }
}