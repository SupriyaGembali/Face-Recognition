module.exports = function(app){


    app.get('/index',function(req,res){
        res.render('index');
    });

    app.get('/home',function(req,res){
        res.render('home');
    });

    app.get('/contact',function(req,res){
        res.render('contact');
    });

    


    app.post('/index',function(req,res){

    });

    app.delete('/index',function(req,res){

    });


};
