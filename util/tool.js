/**
 * Created by vip on 15/4/14.
 */
var cp      = require( "child_process" ),
    grunt   = require( "grunt" ) ,
    log     = require( "./log" );

module.exports = {
    /*!
     *  get user kulor json config
     *  @return     {json}
     */
    getUserKulorJson    : function(){
        var _file   = process.cwd() + "/kulor.json";
        if( grunt.file.isFile( _file ) ){
            return grunt.file.readJSON( _file );
        } else {
            return  {};
        }
    } ,
    /*!
     *  switch array to object
     */
    arrayToObject : function( array ){
        var _rtn    = {},
            _val;
        for( var i = array.length; i--; ){
            _val = array[ i ][ 1 ];
            _rtn[ array[ i ][ 0 ] ] = _val instanceof Array ? this.arrayToObject( _val ) : _val;
        }
        return _rtn;
    } ,
    /*!
     *  @param  str        {string}    "a;b;c"
     *  @param  splitArray {array}     "[ ' ' , ';' ]"
     *  @return array
     */
    stringToArray : function( str , splitArray ){
        var _al,
            _rtn    = [],
            _newSplitArray;
        splitArray  = splitArray instanceof Array ? splitArray : [ ";" ];
        _al = str.split( splitArray[ splitArray.length - 1 ] );
        if( splitArray.length > 1 ){
            _newSplitArray = splitArray.slice( 0 , -1 );
        }
        for( var i = 0, len = _al.length; i < len; i++ ){
            _rtn.push( _newSplitArray ? this.stringToArray( _al[ i ] , _newSplitArray ) : _al[ i ] );
        }
        return _rtn;
    } ,
    /*!
     *  check if has bower env
     *  @param  callback    {fn}
     *  @param  rtnErr      {boolean}
     *  @return tool
     */
    checkBower  : function( callback , rtnErr ){
        cp.exec( "bower --version" , {} , function( err ){
            if( typeof callback == "function" && ( !rtnErr ) ){
                callback( !err );
            }
            if( err ){
                log( "bower should be install..." );
                log( "run npm install -g bower for resolve" );
            }
        } );
        return this;
    } ,
    /*!
     *  check if has git env
     *  @param  callback    {fn}
     *  @param  rtnErr      {boolean}
     *  @return tool
     */
    checkGit : function( callback , rtnErr ){
        cp.exec( "git --version" , {} , function( err ){
            if( typeof callback == "function" && ( !rtnErr ) ){
                callback( !err );
            }
            if( err ){
                log( "git should be install..." );
            }
        } );
        return this;
    } ,
    /*!
     *  upper first litter for filename
     *  @filename   {string}
     *  @return     {string} 
     */
    getKeyName : function( filename ){
        return filename.replace( /(.).*/ , "$1").toLocaleUpperCase() + filename.replace( /./ , "" ).replace( /\..*$/ , "" );
    }
}