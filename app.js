const express = require('express')

const bodyParser = require('body-parser')

const mongoose = require("mongoose")

const {config} = require('dotenv')

const _ = require('lodash');  //it's a utility library that makes it easier to work with Javascript inside your Node apps.



const ejs = require('ejs')
const { json } = require('body-parser')
const { stringify } = require('querystring')

const app= express()

config()

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')





// //create new database inside mongodb local on system :
//  mongoose.connect('mongodb://127.0.0.1:27017/blogDb');

const mongodbUri = process.env.MONGODB_URL
 //create database inside mongodb atlas :
 mongoose.connect(mongodbUri);



const blogSchema = {
            title:String,
            content:String
            }


const Blog = mongoose.model("blog",blogSchema)  // 'blog' which is turn out to be 'blogs' in mongoshell is a collection


const homeStartingContent="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime perspiciatis consequatur dolorem doloribus expedita fugit quaerat dolores blanditiis, nihil illo. Ut omnis recusandae quibusdam exercitationem ratione hic odit optio nesciuntQuo doloremque repellendus in, quod ea magni incidunt possimus inventore ratione voluptatem facere eos ducimus nihil similique voluptatibus, unde blanditiis, quidem perspiciatis nisi pariatur quia voluptates nesciunt! Voluptate, quos veritatis."

const aboutsContent="Welcome to my blog! I am so glad you stopped by to read my latest post. Whether you're a regular reader or new to my blog, I hope you'll find something interesting and useful here.In this blog, I will be sharing my thoughts, insights, and experiences on a wide range of topics. From technology and science to travel and lifestyle, I love exploring new subjects and sharing what I learn with others.My goal is to provide you with informative, thought-provoking content that inspires you to learn, grow, and achieve your goals. I believe that we all have the potential to do great things, and I hope my blog can be a source of inspiration and motivation for you.So, take a look around, read some of my posts, and don't hesitate to leave a comment or get in touch with me. I would love to hear from you and learn more about your interests and ideas.Thank you for visiting my blog, and I hope you enjoy your stay"

const contactsContent ="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime perspiciatis consequatur dolorem doloribus expedita fugit quaerat dolores blanditiis, nihil illo. Ut omnis recusandae quibusdam exercitationem ratione hic odit optio nesciunt.Quo doloremque repellendus in, quod ea magni incidunt possimus inventore ratione voluptatem facere eos ducimus nihil similique voluptatibus, unde blanditiis, quidem perspiciatis nisi pariatur quia voluptates nesciunt! Voluptate, quos veritatis."




app.get("/",(req,res)=>
{   
    // console.log(Blog)   using Blog here which is a empty collection

    Blog.find({},(err,posts)=>{
    console.log(posts)
    
    if(!err)
    {
        res.render('home',{startingContent:homeStartingContent,blogPost:posts})
    }
    else
    {
         console.log(err)
    }

   })
    
})

app.get("/contact",(req,res)=>
{
    res.render('contact',{contactContent:contactsContent})
})


app.get("/about",(req,res)=>
{
    res.render('about',{aboutContent:aboutsContent})
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

          id:post._id

         
     
        })
     
      })


        })
      
    
app.post("/blogpost/:id",(req,res)=>
{
    const checkId = req.body.delete
       
        // or   Item.
        Blog.deleteOne({_id:checkId},(err)=> 

            { 
                if(!err)
                    {
                    console.log("item deleted successfully")
                    res.redirect("/")
                    }
                else
                    {
                    console.log(err)  
                    } 
            }) 
})


//////////////////////////////////////////////////////////////////////////////
app.post("/compose",(req,res)=>
{
   const post = new Blog(

   {
      title: req.body.postText,
      content: req.body.postBody
   })

   post.save((err)=>{

    if(!err)
    {
        res.redirect('/')
    }
    else{
            console.log(err)
          
    }
   })

    // const post ={ title:req.body.postText,
    //                             context:req.body.postBody 
    //                         }
                            
    
    // posts.push(item)  
    // console.log(posts )                      
   

})


const port = process.env.PORT || 3000


app.listen(port,()=>
{console.log('server is running at port 3000')})



