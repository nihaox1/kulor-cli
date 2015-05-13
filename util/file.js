var log     = require( "./log" ) ,
    grunt   = require( "grunt" );

var file    = module.exports    = {} ,
    pathSplitString             = /[\/|\\]/g;

function copySingleFile( filePath , rootDir , targetDir ){
    var _dir;
    if( !grunt.file.exists( targetDir ) ){
        grunt.file.mkdir( targetDir );
    }
    _dir            = filePath.replace( rootDir , targetDir );
    grunt.file.copy( filePath , _dir , { force : true } );
}


/*!
 *  允许递归文件夹式的copy
 */
file.copy   = function( src , target ){
    var _paths      = [],
        _regIsDir   = /[\\|\/]$/;
    src     = src.replace( /^(\.[\\|\/])/ , "" );
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
        if( !_regIsDir.test( src ) ){
            if( _regIsDir.test( target ) ){
                target     = target + src.replace( /^.*[\\|\/]/ , "" );
            }
        }
        for( var i = 0 , len = _paths.length; i < len; i++ ){
            copySingleFile( _paths[ i ] , src , target );
        }
    }
}