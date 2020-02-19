var methods = {};

methods.myTestFunction = function(req ,res ){
    res.send('TestFunction');
}

exports.data = methods;