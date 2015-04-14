/**
 * Created by vip on 15/4/1.
 */
module.exports.options   = {
    "init"        : Boolean ,
    "install"     : Boolean ,
    "plugin"      : Boolean ,
    "help"        : Boolean ,
    "add"         : [ String , null ]
}

module.exports.shortOpts = {
    "-a"        : [ "add" , "--a" ] ,
    "-h"        : [ "help" , "--h" , "-help" , "--help" ]
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
    "-version"   : "version"
}