# RESTfulAuth
This is mainly used for reference for myself later on down the road so I don't have to waste time googling things. Regardless, this is a demo blog application using Express.js to demonstrate authentication, while following REST conventions. This is purely for reference and should not be used at all.  

This repository covers some of the basics of: 
* REST
* Simple authentication in Express.js
* SemanticUI for simple styling
* MVC Workflow

# Dependencies
* MongoDB
* Express.js
* body-parser
* ejs
* express-sanitzer
* express-session
* method-override
* mongoose
* passport
* passport-local
* passport-local-mongoose

# Usage
* Install all dependencies

`npm install`

* Add your own express session secret in app.js
````javascript
app.use(require("express-session")({
    secret: "YOUR SECRET GOES HERE", 
    resave: false,
    saveUninitialized: false
}));
```

* Run MongoDB

`./monogod`

* Start the server

`node app.js`

# License
All code in this repository is licensed under the MIT license.

Which basically means you can do what ever your heart desires with this source.

See the "LICENSE" file for more information.
