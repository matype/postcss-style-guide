var ObjProto = Object.prototype;
var toString = ObjProto.toString;

function isFunction(value) {
    return toString.call(value) === '[object Function]';
}
module.exports.isFunction = isFunction;

function result(obj) {
    if (isFunction(obj)) {
        return obj.apply(null, [].slice.call(arguments, 1));
    }
    return obj;
}
module.exports.result = result;
