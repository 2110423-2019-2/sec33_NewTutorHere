var methods = {};

methods.myTestFunction = function(req ,res ){
    res.send(req.cookies.auth);
    
}
methods.createCookie = function(req ,res ){
    res.cookie('nextpf', req.result.tutor_username);
}


exports.data = methods;