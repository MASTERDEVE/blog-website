
const express= require("express");
const bodyParser= require("body-parser");
const _ = require("lodash")
const mongoose=require("mongoose");
const ejs = require("ejs");
const PORT = process.env.PORT || 3000;



const homeroutingcontent= "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque nec bibendum elit, nec auctor enim. Suspendisse potenti. Integer vulputate sodales sapien id consectetur. Nullam efficitur venenatis lacus, vel cursus risus dignissim sed. Etiam condimentum tempus justo ut fermentum. Vivamus sodales nisl semper, pellentesque ipsum at, fermentum lectus. Nullam tincidunt, sapien in porta dignissim, felis nunc bibendum velit, at tempor est risus et turpis. Cras interdum ex odio, vitae ullamcorper justo faucibus ac. Aliquam urna velit, euismod ac odio ut, vulputate sodales neque. Suspendisse maximus dignissim eros, id viverra dui. Sed eu est ut magna commodo gravida. Cras ipsum justo, cursus sit amet erat eleifend, laoreet dapibus nisl. Morbi non quam at leo dapibus fermentum sed nec est. Etiam quis neque eu elit suscipit tincidunt. Integer ullamcorper congue sem, ut lobortis magna viverra sed. Aliquam sit amet lacus vel tellus pellentesque lacinia."
const aboutcontent= "Pellentesque dapibus quam et ante malesuada sodales. Curabitur varius ut dui non imperdiet. Donec molestie consequat augue, vel vestibulum purus facilisis sed. Duis eros nisl, tincidunt et finibus vehicula, iaculis sit amet felis. Nunc ornare tempor lectus commodo faucibus. Praesent semper nulla a odio scelerisque, mattis viverra massa vestibulum. Sed dolor ante, ultricies nec consectetur sit amet, egestas a orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a est ac leo cursus condimentum id quis metus. Vivamus elementum justo sed est lacinia, nec porttitor urna vehicula. Sed vel interdum metus. Cras dictum tortor nulla, in tincidunt magna hendrerit id. Integer venenatis consectetur malesuada." 
const contactcontent= "Aliquam erat volutpat. Cras eu lectus ac arcu molestie blandit ac ut leo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis arcu ante, ornare non cursus aliquet, finibus vitae arcu. Aliquam pulvinar dolor est, congue eleifend velit hendrerit hendrerit. Pellentesque pretium tempor mollis. Sed lobortis turpis et nulla malesuada rutrum. Integer nec eros justo. Mauris auctor condimentum lectus, id posuere leo gravida vitae. Proin faucibus cursus velit, ut vehicula tellus mattis at. In hac habitasse platea dictumst. Maecenas sed aliquet velit, eu maximus"

const app= express();
let Posts=[];


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


let blogSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
       }

})
let Blog;
async function main(){
    try{
      await mongoose.connect("mongodb+srv://vanshika12:Mongodb12@cluster0.nlwif.mongodb.net/blogDB?retryWrites=true&w=majority");

      Blog = mongoose.model("Blog",blogSchema);
    
      
    }catch(err){
        console.log(err);
    }
}
main().then(() => {

app.get("/", async function(req,res){
try{
  const blogfind = await Blog.find();
  res.render("home",{home:homeroutingcontent,Posts:blogfind});
 
}catch(err){
    console.log(err);
}
})


app.get("/about",function(req,res){
    res.render("about",{about:aboutcontent});
})
app.get("/contact",function(req,res){
    res.render("contact",{contact:contactcontent});
})
app.get("/compose",function(req,res){
    res.render("compose");
})
app.post("/compose",async function(req,res){
    const newPost=new Blog({
   title : req.body.title,
   content: req.body.postbody,
    });
try{
    await newPost.save();
    res.redirect("/")
}catch(err){
    console.log(err);
}
 
});

app.get("/post/:title",async function(req,res){

 const composetitle=_.lowerCase(req.params.title);
try{
    const post = await Blog.findOne({ title: new RegExp("^" + composetitle + "$", "i") });
    
       
if(post){
res.render("post",{
    title:post.title,
    content:post.content

});
}else{
    res.status(404).send("Post not found");
}

}catch(err){
    console.log(err);
}
});


    


app.listen(PORT,function(req,res){
    console.log("Server is running on port 3000")
});
});
