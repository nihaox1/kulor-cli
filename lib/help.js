/**
 * Created by vip on 15/4/3.
 */
module.exports = function(){
    this.log( this.grunt.file.read( this.options.baseFolder + "doc.helper" ) );
};