const express = require("express");
const app = express();

app.set("view engine", "pug");

const requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    next();
};

const myLogger = (req, res, next) => {
    console.log("LOGGED");
    next();
};

const cookieParser = require('cookie-parser');
///
app.use(cookieParser());

var options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now());
    },
};
app.use(express.static('public', options));

app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.static('files'));

app.use(requestTime);

app.use('/user/:id',  (req, res, next)=> {
    console.log('Request Type:', req.method);
    next();
});        

app.get('/user/:id', function (req, res, next) {
    res.send('USER');
});    

app.use(myLogger);

app.use('/static', express.static(__dirname + '/public'));

//app.use((req, res, next) => {
//    res.status(404).send("Sorry cant find that!");
//});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use( (req, res, next) =>{
    console.log('Time:', Date.now());
    next();
});

app.use('/user/:id', (req, res, next)=> {
    console.log('Request Type:', req.method);
    next();
});

app.get("/", (req, res) => {
    res.render("index", {
        title: "Hey",
        message: "Hello there!",
    });
}); 

app.use("/contact", function (request, response) {
    response.render("contact", {
        title: "Мои контакты",
        emailsVisible: true,
        emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
        phone: "+1234567890",
    });
});

app.use("/faq", function(request, response){
    response.render("faq", {
        title: "Обо мне",
        name: "Святослав",
        age: "21",
        occupation: "Студент",
        hobby: "TTRPG",
        kostyl: true,
        intrests: ["Фэнтези", "Геймдизайн", "TTRPG"]
    });
})

app.use(express.static(path.join(views, 'public')));

app.use("/blog", function (request, response) {
    response.render("blog", {
        title: "Блогус",
    });
})

app.post("/", (req, res) => {
    res.send("Got a POST request");
});

app.post("/user", (req, res) => {
    res.sendStatus(200);
});

app.put("/user", (req, res) => {
    res.send("Got a PUT request at /user");
});
    
app.delete("/user", (req, res) => {
    res.send("Got a DELETE request at /user");
});  

app.get('/user/:id', function (req, res, next) {
    res.send('USER');
});


app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});