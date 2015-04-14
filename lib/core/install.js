/**
 * Created by vip on 15/4/14.
 */
var cp      = require( "child_process" ) ,
    log     = require( "../../util/log" ),
    tool;

tool = {
    analysis : function( str ){
        var _name,
            _ver;
        if( str.indexOf( "no cache" ) > -1 ){
            log( a + " package not found..." );
        } else {
            _name   = str.replace( /bower.([^\#]*).*/ , "$1").replace( /\n.*/ , "" );
            _ver    = str.replace( /.*\#([\d|\.]*).*/ , "$1").replace( /\n.*/ , "" );
            log( "package name : " + _name + "version : " + _ver );
        }
        return _name;
    }
}

function Install(){

}

Install.fn = Install.prototype;

Install.fn.addPlugins = function( json , callback ){
    var _shStr,
        _plugins    = [],
        _count      = 0;
    for( var a in json ){
        _shStr = "bower install " + a + ( json[ a ] === true ? "" : ( "#" + json[ a ] ) );
        _count++;
        cp.exec( _shStr , {} , function( err , stdout ){
            if( !err ){
                _plugins.push( tool.analysis( stdout ) );
            } else {
                log( stdout );
                log( "bower install " + a + " error..." );
            }
            if( !--_count ){
                callback( _plugins );
            }
        } );
    }
}

module.exports = Install;