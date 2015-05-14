/**
 * Created by vip on 15/4/1.
 */
module.exports.options   = {
    "init"        : Boolean ,
    "install"     : Boolean ,
    "plugin"      : Boolean ,
    "makeConfig"  : Boolean ,
    "mc"          : Boolean ,
    "help"        : Boolean ,
    "cache"       : Boolean ,
    "clean"       : Boolean ,
    "add"         : [ String , null ]
}

module.exports.shortOpts = {
    "add"       : [ "add" , "--a" ] ,
    "help"      : [ "help" , "--h" , "-help" , "--help" ] ,
    "clean"     : [ "clean" , "-clean" , "--clean" ] ,
    "makeConfig": [ "makeConfig" , "mc" , "mkconfig" ]
}

module.exports.cmd = {
    "init"      : "init" ,
    "install"   : "install" ,
    "help"      : "help" ,
    "-help"     : "help" ,
    "--help"    : "help" ,
    "-h"        : "help" ,
    "plugin"    : "plugin" ,
    "version"   : "version" ,
    "-v"        : "version" ,
    "-version"   : "version" ,
    "makeConfig" : "makeConfig" ,
    "mkconfig"   : "makeConfig" ,
    "mc"         : "makeConfig" ,
    "cache"      : "cache"
}