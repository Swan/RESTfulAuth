// App Config
var express               =  require("express"), // Backend Framework
    app                   = express(),  // *
    methodOverride        = require("method-override"), // In order to use PUT requests
    bodyParser            = require("body-parser"), // To capture data from forms
    expressSanitizer      = require("express-sanitizer"), // Sanitize data written in forms to prevent code execution
    passport              = require("passport"), // Actual Passport Package
    LocalStrategy         = require("passport-local"), // For local Auth (Username and Password)
    passportLocalMongoose = require("passport-local-mongoose"), // To make passport easily work with mongoose
    // =============
    //    MODELS
    // =============
    User                  = require("./models/user"), // USER MODEL
    Blog                  = require("./models/blog"), // BLOG MODEL
    // Mongoose
    mongoose              = require("mongoose"); // For working with MongoDB
    
//Express Session
app.use(require("express-session")({
    // Set Secret to decode session information
    secret: "", 
    // Other required properties
    resave: false,
    saveUninitialized: false
}));
// Connect to MongoDB
mongoose.connect("mongodb://localhost/restfulblog"); // Connect to restfulblog DB
// EJS
app.set("view engine", "ejs"); // To use ejs files without specifying .ejs in routes
// Tell Express to use public directory
app.use(express.static(__dirname + "/public")); // For Styling in /public/ directory
// Body Parser
app.use(bodyParser.urlencoded({extended: true})); // Weird line that no one really knows or cares about, but is required for BP
// Method Override
app.use(methodOverride("_method"));  // Setting the actually override. _method can be anything, but it's most common.
// Express Sanitizer
app.use(expressSanitizer()); // Script tags will get ignored when using sanitize()
// Required Passport Methods
app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// --------------------------------------------------
// -----===------    BLOG ROUTES    -----===------ 
// --------------------------------------------------


// ROOT
app.get("/", function(req, res){
   res.render("home");
});


// INDEX
app.get("/blogs", isLoggedIn, function(req, res){
    
    // Grab all blogs from db
    Blog.find({}, function(err, blogs){
        
        if (err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
        
    });
    
});


// NEW - Display form
app.get("/blogs/new", isLoggedIn ,function(req, res){
    res.render("new");
})


// CREATE - Insert form data into db
app.post("/blogs", isLoggedIn ,function(req, res){
    
    // Sanitize data before it gets added into the database
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    // Create blog
    Blog.create(req.body.blog, function(err, newBlog){
        
        if (err) {
            console.log("There was a problem" + err);
            res.render("new");
            
        } else {
            res.redirect("/blogs");
        }
        
    });
    
});


// SHOW - Show all Blogs
app.get("/blogs/:id", isLoggedIn, function(req, res){
   
   Blog.findById(req.params.id, function(err, foundBlog){
       
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }// Secret
   });
    
});


// EDIT- Edit blog post
app.get("/blogs/:id/edit", isLoggedIn, function(req, res){
    
    Blog.findById(req.params.id, function(err, foundBlog){

        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
        
   });

});


// UPDATE - Update database with new post from edit
app.put("/blogs/:id", isLoggedIn ,function(req, res){
   
   // Sanitize data before it gets added into the database
    req.body.blog.body = req.sanitize(req.body.blog.body);
   
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
        
    });
    
});


// DELETE - Delete post from database
app.delete("/blogs/:id", isLoggedIn,function(req, res){
    // Destroy
    Blog.findByIdAndRemove(req.params.id, function(err){
        
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/");
        }
        
    });
    
});


// --------------------------------------------------
// -----===------   AUTH ROUTES     -----===------ 
// --------------------------------------------------
// Show Sign Up Form
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    // Creates a new user - Doesn't actually save to db. Send password as a separate parameter
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err) {
            console.log(err);
            return res.render('register');
        } else {
            // Actually Logs the user in - Runs User.SerializeUser with local strategy
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secret");
            });
        }
    })
});


// Login Route    
app.post("/login", passport.authenticate("local", {
    // Set where you want it to redirect to 
    successRedirect: "/blogs",
    failureRedirect: "/"
}) ,function(req, res){
});


// Logout Route
app.get("/logout", function(req, res){
    req.logout(); // This is literally all we need to do to log the user out... wow!
    res.redirect("/");
})

// --------------------------------------------------
// -----===------   MISC     -----===------ 
// --------------------------------------------------


// Secret Page
app.get("/secret", isLoggedIn,function(req, res){
   res.render("secret");
});


// 404 - Or if page does not exist
app.get("*", function(req, res){
   res.redirect("/blogs");
});


// MW - Check if logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } 
    res.redirect("/");
}


// Server Start
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started");
});