var libs = {};

libs.distanceVector3 = function (v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
};
libs.distanceVector2 = function (v1, v2) {
    var dx = v1.x - v2.x;
    var dz = v1.z - v2.z;
    return Math.sqrt(dx * dx + dz * dz);
};

module.exports = libs;