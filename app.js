const express = require('express')

const bodyParser = require('body-parser')

 const _ = require('lodash');  //it's a utility library that makes it easier to work with Javascript inside your Node apps.


const ejs = require('ejs')
const { json } = require('body-parser')
const { stringify } = require('querystring')

const app= express()


app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')

const posts=[]


const homeStartingContent="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime perspiciatis consequatur dolorem doloribus expedita fugit quaerat dolores blanditiis, nihil illo. Ut omnis recusandae quibusdam exercitationem ratione hic odit optio nesciuntQuo doloremque repellendus in, quod ea magni incidunt possimus inventore ratione voluptatem facere eos ducimus nihil similique voluptatibus, unde blanditiis, quidem perspiciatis nisi pariatur quia voluptates nesciunt! Voluptate, quos veritatis."

const aboutsContent="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime perspiciatis consequatur dolorem doloribus expedita fugit quaerat dolores blanditiis, nihil illo. Ut omnis recusandae quibusdam exercitationem ratione hic odit optio nesciunt.Quo doloremque repellendus in, quod ea magni incidunt possimus inventore ratione voluptatem facere eos ducimus nihil similique voluptatibus, unde blanditiis, quidem perspiciatis nisi pariatur quia voluptates nesciunt! Voluptate, quos veritatis."

const contactsContent ="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime perspiciatis consequatur dolorem doloribus expedita fugit quaerat dolores blanditiis, nihil illo. Ut omnis recusandae quibusdam exercitationem ratione hic odit optio nesciunt.Quo doloremque repellendus in, quod ea magni incidunt possimus inventore ratione voluptatem facere eos ducimus nihil similique voluptatibus, unde blanditiis, quidem perspiciatis nisi pariatur quia voluptates nesciunt! Voluptate, quos veritatis."
// '/users/:userId/books/:bookId



app.get("/",(req,res)=>
{   
   
    res.render('home',{startingContent:homeStartingContent,blogPost:posts})
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



//express routing parameter :
app.get("/blogpost/:postname",(req,res)=>{
    
    const requesTitle=  _.lowerCase(req.params.postname)   //_.lowerCase() it's a method of lodash to lower case of object  element 
    
    posts.forEach((element)=>{
        // console.log(element.title)

                     // element.title.toLowerCase() or
         if (_.lowerCase(element.title) === requesTitle)
         {  
            res.render('post', {title:element.title, 
                                                content:element.context})
            //  console.log("found")
         }

    }
    )
        })
      

  
   


app.post("/compose",(req,res)=>
{
    

    const item ={ title:req.body.postText,
                                context:req.body.postBody 
                            }
                            
    
    posts.push(item)  
    // console.log(posts )                      
    res.redirect('/')

})



app.listen('3000',()=>
{console.log('server is running at port 3000')})