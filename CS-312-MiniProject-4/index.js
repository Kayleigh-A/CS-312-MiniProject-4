import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import session from 'express-session';
import env from "dotenv"

const app = express();
const port = 3000;
env.config();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax"
    }
}));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Session authentication
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({
            message: "You must be logged in"
        })
    }

    next();
}

let posts = [];
app.get("/api/posts", requireAuth, (req, res) => {
    res.json(posts);
})

let users = [];
const saltRounds = 12;

app.get("/", (req, res) => {
    res.render("index.ejs", { posts: posts });
})

// ---------------------- REACT ROUTES ----------------------------------

app.post("/api/posts", requireAuth, (req, res) => {
    const newPost = {

        id: Date.now(),                       
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        date: new Date().toLocaleDateString()  
      
    };

    
    posts.push(newPost);

    res.status(201).json(newPost);
});

app.post("/api/signup", async (req, res) => {
    const {userName, password} = req.body;

    // USER MUST ENTER SOMETHING IN BOTH FIELDS
    if (
        typeof userName != "string" || typeof password != "string" ||
        !userName.trim() || !password
    ) {
        return res.status(400).json( {
            message: "Username AND passoword are required!"
        });
    }

    // DOES USER EXIST?
    const existingUser = users.find(
        (user) => user.userName === userName.trim()
    );

    if (existingUser){
        return res.status(409).json({               // 409 means the request conflicts with an existing resource, i.e, the userName
            message: "Username already exists."
        });
    }

    try {
        const hashedPass = await bcrypt.hash(password, saltRounds);

        const newUser = {
            id: Date.now(),
            userName: userName.trim(),
            hashedPass
        };

        users.push(newUser);

        res.status(201).json({
            message: "Account created successfully!"
        });
    } catch (error) {
        console.error("Signup error:", error);

        res.status(500).json({
            message: "Something went wrong! Try again."
        });
    }
})

app.post("/api/login", async (req, res) => {
    const { userName, password } = req.body;

    if (
        typeof userName != "string" || typeof password != "string" ||
        !userName.trim() || !password
    ) {
        return res.status(400).json( {
            message: "Username AND passoword are required!"
        });
    }

    const user = users.find(
        (user) => user.userName === userName.trim()
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    try {
        const isMatch = await bcrypt.compare(password, user.hashedPass);

        if(!isMatch) {
            return res.status(401).json({
            message: "Invalid username or password"
        });
        }

        req.session.userId = user.id;
        res.status(200).json({
            message: "Login Successful!",
            user: {
                id: user.id,
                username: user.userName
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Something went wrong during login!"
        });
    }

});

app.post("/api/logout", async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Logout error:", error);

            return res.status(500).json({
                message: "Unable to log out!"
            });
        }

        res.clearCookie("connect.sid");

        res.json({
            message: "Logged out successfully!"
        });
    });
})

app.put("/api/posts/:id", requireAuth, (req, res) => {
    const postId = Number(req.params.id);

    const post = posts.find((post) => post.id === postId);
    if (!post) {
        return res.status(404).json({message: "Post not found!"});
    }

    post.author = req.body.author;
    post.title = req.body.title;
    post.content = req.body.content;

    res.json(post);

});


app.delete("/api/posts/:id", requireAuth, (req, res) => {
    const postId = Number(req.params.id);

    const post = posts.find((post) => post.id === postId);
    if (!post) {
        return res.status(404).json({message: "Post not found!"});
    }

    posts = posts.filter(post => post.id !== postId);

    res.json({message: "Post deleted successfully!"});
});


app.get("/api/me", (req, res) => {
    const user = users.find((user) => user.id === req.session.userId);

    if (!user) {
        return res.status(401).json({
            message: "Not Logged In!"
        });
    }

    res.status(200).json({
        user: {
            id: user.id,
            username: user.userName
        }
    });

})

// ---------------------- EXPRESS ROUTES --------------------------------

// Grabbing post information from user 
app.post("/posts", (req, res) =>{

    const newPost = {

        id: Date.now(),                         // mostly unqiue ID for each post
        author: req.body.author,
        title: req.body.title,
        content: req.body.postContent,
        date: new Date().toLocaleDateString()   // timestamp of when post was created
      
    };

    // VERY IMPORTANT AS THE "Publish Post" button would not do anything
    posts.push(newPost);
    
    console.log("Posts after create:", posts);

    res.redirect("/");  // returning to homepage

})

// Find your original post to edit
app.get("/posts/:id/edit", (req, res) => {     

    const post = posts.find(post => post.id === Number(req.params.id));  // finds post with matching id (turns id string into number)
    
    res.render("edit.ejs", { post: post });

});

// Submit edited changes to post and return to homepage
app.post("/posts/:id/edit", (req, res) => {

    const post = posts.find(post => post.id === Number(req.params.id));

    console.log("Found ID:", req.params.id);
    console.log("Post found:", post);


    post.author = req.body.author;
    post.title = req.body.title;
    post.content = req.body.postContent;

    res.redirect("/");
});

// Delete post
app.post("/posts/:id/delete", (req, res) =>{
    const postId = Number(req.params.id);
    posts = posts.filter(post => post.id !== postId);    // filter() gives me an array containing all elements matching a condition, i.e. what to keep in the array
    
    res.redirect("/");
});



app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
