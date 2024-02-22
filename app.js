require('dotenv').config()   // for .env file
const express = require('express')
const fs = require('fs');

const bodyParser = require('body-parser')

 const _ = require('lodash');  //it's a utility library that makes it easier to work with Javascript inside your Node apps.



const ejs = require('ejs')
const { json } = require('body-parser')
const { stringify } = require('querystring')

const app= express()


app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // Destination folder for storing uploads
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // File naming
  }
});

const upload = multer({ storage: storage });
//requiring mongoose 
const mongoose = require("mongoose")

mongoose.set('strictQuery', false)
//create new database inside mongodb local on system :
//  mongoose.connect('mongodb://127.0.0.1:27017/blogDb');

 //create database inside mongodb atlas :
 const url=`mongodb+srv://${process.env.CLIENT_ID}/blogDb`
 
 mongoose.connect(url);



const blogSchema = {
            title:String,
            content:String,
            imagePath:String,
            imageLink:String
            }


const Blog = mongoose.model("blog",blogSchema)  // 'blog' which is turn out to be 'blogs' in mongoshell is a collection


const aboutsContent="Welcome to my blog! I am so glad you stopped by to read my latest post. Whether you're a regular reader or new to my blog, I hope you'll find something interesting and useful here.In this blog, I will be sharing my thoughts, insights, and experiences on a wide range of topics. From technology and science to travel and lifestyle, I love exploring new subjects and sharing what I learn with others.My goal is to provide you with informative, thought-provoking content that inspires you to learn, grow, and achieve your goals. I believe that we all have the potential to do great things, and I hope my blog can be a source of inspiration and motivation for you.So, take a look around, read some of my posts, and don't hesitate to leave a comment or get in touch with me. I would love to hear from you and learn more about your interests and ideas.Thank you for visiting my blog, and I hope you enjoy your stay"

const contactsContent ="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime perspiciatis consequatur dolorem doloribus expedita fugit quaerat dolores blanditiis, nihil illo. Ut omnis recusandae quibusdam exercitationem ratione hic odit optio nesciunt.Quo doloremque repellendus in, quod ea magni incidunt possimus inventore ratione voluptatem facere eos ducimus nihil similique voluptatibus, unde blanditiis, quidem perspiciatis nisi pariatur quia voluptates nesciunt! Voluptate, quos veritatis."




app.get("/",(req,res)=>
{   
    // console.log(Blog)   using Blog here which is a empty collection

    Blog.find({},(err,posts)=>{
    console.log(posts)
    
    if(!err)
    {
    res.render('home',{blogPost:posts})
       
    }
    else
    {
         console.log(err)
    }

   })
    
})

app.get("/contact",(req,res)=>
{
    res.render('aboutAndContact',{description:contactsContent,content:'Contact US'})
})


app.get("/about",(req,res)=>
{
    res.render('aboutAndContact',{description:aboutsContent,content:'About' })
})


app.get("/compose",(req,res)=>{

    
    res.render('compose')
})



//express routing parameter  (dynamic route) :
app.get("/blogpost/:id",(req,res)=>{
    
    const requestedPostId=  req.params.id   //_.lowerCase() it's a method of lodash to lower case of object  element 
    
    Blog.findOne({_id: requestedPostId}, function(err, post){

        res.render("post", {
     
          title: post.title,
     
          content: post.content,
          imagePath:post.imagePath,
          imageLink:post.imageLink,

          id:post._id

         
     
        })
     
      })

        })
      
    


app.post("/blogpost/delete/:id", (req, res) => {
    const postId = req.params.id;

    // Find the blog post by ID
    Blog.findOne({ _id: postId }, (err, post) => {
        if (err) {
            console.log(err);
            return res.redirect("/");
        }

        // Check if the post exists
        if (!post) {
            console.log("Post not found");
            return res.redirect("/");
        }

        // Delete the associated image file if imagePath exists
        if (post.imagePath) {
            const imagePath = path.join(__dirname, 'public', 'uploads', post.imagePath);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.log("Error deleting image file:", err);
                } else {
                    console.log("Image file deleted successfully");
                }
            });
        }

        // Delete the blog post from the database
        Blog.deleteOne({ _id: postId }, (err) => {
            if (err) {
                console.log("Error deleting post from the database:", err);
            } else {
                console.log("Post deleted successfully");
            }
            res.redirect("/");
        });
    });
});


//////////////////////////////////////////////////////////////////////////////
app.post("/compose", upload.single('image'), (req, res) => {
   let imagePath = ''; // Initialize imagePath

   // Check if req.file exists and set imagePath accordingly
   if (req.file) {
      imagePath = req.file.filename;
   }


   const post = new Blog({
      title: req.body.postText,
      content: req.body.postBody,
      imagePath: imagePath ,// Save the filename as imagePath, even if it's an empty string
      imageLink:req.body.imageLink
   });

   post.save((err) => {
      if (!err) {
         res.redirect('/');
      } else {
         console.log(err);
         res.redirect('/compose'); // Handle error as per your requirement
      }
   });
});

    // const post ={ title:req.body.postText,
    //                             context:req.body.postBody 
    //                         }
                            
    
    // posts.push(item)  
    // console.log(posts )                      
   

// })


app.get("/blogpost/edit/:id", (req, res) => {
  const postId = req.params.id;

  Blog.findOne({ _id: postId }, (err, post) => {
    if (!err) {
      res.render("edit", { post: post });
    } else {
      console.log(err);
    }
  });
});

app.post("/blogpost/update/:id", (req, res) => {
  const postId = req.params.id;
  const updatedPost = {
    title: req.body.postText,
    content: req.body.postBody,
      imagePath: req.file.filename,// Save the filename as imagePath, even if it's an empty string
      imageLink:req.body.imageLink
  };

  Blog.updateOne({ _id: postId }, updatedPost, (err) => {
    if (!err) {
      res.redirect("/");
    } else {
      console.log(err);
    }
  });
});


app.listen('5000',()=>
{console.log('server is running at port 5000')})



