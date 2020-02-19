var methods = {};

methods.checkcookie = function(req ,res ){
    res.send(req.cookies.auth);
}

exports.data = methods;