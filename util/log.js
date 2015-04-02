/**
 * Created by vip on 15/3/31.
 */
function log( obj , pre ){
    var i, len, pre = pre || [];
    if( obj instanceof Array ){
        for( i = 0 , len = obj.length; i < len; i++ ){
            log( obj[ i ] );
        }
    } else if( typeof obj === "object" ){
        len = pre.length;
        for( var a in obj ){
            if( len >= 3 && pre[ len - 1 ] == pre[ len - 2 ] == pre[ len - 3 ] ){
                return
            } else {
                log( a + " : " );
                pre.push( a );
                log( obj[ a ] , pre );
            }
        }
    } else {
        console.log( obj );
    }
}

module.exports = log;