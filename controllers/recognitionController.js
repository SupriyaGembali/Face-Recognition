module.exports = function(app){

    //index route
    app.get('/index',function(req,res){
        res.render('index');
    });
    
    //home route
    app.get('/home',function(req,res){
        res.render('home');
    });

    //contact route
    app.get('/contact',function(req,res){
        res.render('contact');
    });
};
