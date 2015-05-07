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
    "add"         : [ String , null ]
}

module.exports.shortOpts = {
    "-a"        : [ "add" , "--a" ] ,
    "-h"        : [ "help" , "--h" , "-help" , "--help" ] ,
    "-clean"     : [ "clean" ]
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