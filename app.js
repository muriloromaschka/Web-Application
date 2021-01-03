let express     = require('express'),
app             = express(),
methodOverride  = require('method-override'),
expressSanitizer = require('express-sanitizer'),
bodyParser      = require('body-parser'), 
mongoose        = require('mongoose');
const port           = 3000;



//configure mongoose 
mongoose.connect('mongodb://localhost/blog_app'); //database was created for us when we first ran the file 
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method")) ;
//define schema
let blogSchema = new mongoose.Schema({
    title: String,
    image:String, 
    body: String,
    created: {type: Date, default:Date.now}
})
//next step is to compile it into this model 
var Blog = mongoose.model("Blog", blogSchema)




//routes
app.get('/',(req,res)=> {
    res.redirect('/blogs');
  });
  //INDEX ROUTE
  app.get('/blogs',(req,res)=> {
    Blog.find({},(err,blogs)=>          //passing data coming back from database 
  {
    if (err) {
      console.log(err);
    }else {
      res.render('index',{ blogs : blogs });    //what comes back we're sending it under the name of blogs 
    }
  }
  )
  });
  //NEW ROUTE
  app.get('/blogs/new',(req,res) => res.render('new'));
  
  //CREATE ROUTE
  app.post('/blogs',(req,res) =>
  {
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog ,(err,newBlog) => {
    if (err) {
    res.render('new');
    } else {
      res.redirect('/blogs'); //then, redirect to the index
    }
  })
  });
  
    //SHOW ROUTE
    app.get('/blogs/:id',(req,res) => {
      Blog.findById(req.params.id, function(err,foundBlog){
      if(err) {
        res.redirect('/blogs');
      } else {
        res.render('show', {blog : foundBlog});
      }
  
    });
  });
   //EDIT ROUTE
   app.get('/blogs/:id/edit', (req,res) => {
     Blog.findByIdAndUpdate(req.params.id,(err,foundBlog) => {
       if (err) {
         res.redirect('/blogs');
       } else{
         res.render('edit',{blog:foundBlog});
       }
     });
   });
  app.post('updateBlog/:id')
  
  
  // UPDATE ROUTE
  
  app.put('/blogs/:id',(req,res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, ( err , updatedBlog ) => {
      if (err) {
        res.redirect('/blogs');
      } else {
        res.redirect('/blogs/' + req.params.id );
      }
    });
  });
  
  // DELETE ROUTE
  app.delete('/blogs/:id',(req,res) => {
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        res.redirect('\blogs');
      } else {
        res.redirect('\blogs');
      }
    })
  });



  app.listen(port,()=>
  console.log(`Server is running on ${port} port.`));
