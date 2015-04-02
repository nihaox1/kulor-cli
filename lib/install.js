/**
 * Created by vip on 15/4/1.
 */
var cp = require( "child_process" );

function analysis( str ){
    var _name,
        _ver;
    if( str.indexOf( "no cache" ) > -1 ){
        this.log( a + " package not found..." );
    } else {
        _name   = str.replace( /bower.([^\#]*).*/ , "$1").replace( /\n.*/ , "" );
        _ver    = str.replace( /.*\#([\d|\.]*).*/ , "$1").replace( /\n.*/ , "" );
        this.log( "package name : " + _name + "version : " + _ver );
    }
    return _name;
}

function installDone( plugins ){
    this.log( plugins );
    var _dir    = "./bower_components/",
        _cwd    = this.cwd + "/../src/plugin",
        _self   = this;
    this.grunt.file.mkdir( _cwd );
    cp.exec( "cp -rf bower_components/ " + _cwd , {} , function( err , stdout , stderr ){
        _self.log( err );
    } );
}

function install(){
    var _self   = this,
        _json,
        _shStr,
        _count  = 0,
        _plugins= [];
    cp.exec( "bower --version" , {} , function( err , stdout , stderr ){
        if( !err ){
            if( !_self.grunt.file.exists( "../kulor.json" ) ){
                _self.log( "kulor.json not exsits.." );
            } else {
                _json = _self.grunt.file.readJSON( "../kulor.json" );
                if( typeof _json.plugins == "object" ){
                    for( var a in _json.plugins ){
                        _shStr = "bower install " + a + ( _json.plugins[ a ] === true ? "" : _json.plugins[ a ] );
                        _count++;
                        cp.exec( _shStr , {} , function( err , stdout , stderr ){
                            if( !err ){
                                _plugins.push( analysis.call( _self , stdout ) );
                            } else {
                                _self.log( "bower install " + a + " error..." );
                            }
                            if( !--_count ){
                                installDone.call( _self , _plugins );
                            }
                        } );
                    }
                } else {
                    _self.log( "install success..." );
                }
            }
        } else {
            _self.log( "bower should be install..." );
            _self.log( "run npm install -g bower for resolve" );
        }
    } );
}

module.exports = install;
