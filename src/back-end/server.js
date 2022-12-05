const express = require('express')
const app = express()
const port = 4000
const bodyParser = require('body-parser')

// allow server to access to different port
const cors = require('cors');
app.use(cors());
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
res.header("Access-Control-Allow-Headers",
"Origin, X-Requested-With, Content-Type, Accept");
next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// Connect to Mongo DB
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://admin:admin@cluster1.pmzdfz6.mongodb.net/?retryWrites=true&w=majority');
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

// schema holds strings
const BookSchema = new mongoose.Schema({
  title: String,
  cover: String,
  author: String
});

const bookModel = mongoose.model('books', BookSchema);

app.put('/api/book/:id', (req, res)=>{
  console.log("Updated"+req.params.id);

  bookModel.findByIdAndUpdate(req.params.id, req.body,{new: true},(error, data)=>{
    res.send(data);
  })
})



app.get('/', (req, res) => {
  res.send('Hello World!')
})


// server listen the post request from localhost.
app.post('/api/books',(req, res) => {
  console.log(req.body);
  bookModel.create({
    title:req.body.title,
    cover:req.body.cover,
    author:req.body.author
  })
  res.send('Book added');
})

// listen to the request json
app.get('/api/books', (req, res) => {
  // const books = [
  //   {
  //   "title": "Learn Git in a Month of Lunches",
  //   "isbn": "1617292419",
  //   "pageCount": 0,
  //   "thumbnailUrl":
  //   "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/umali.jpg", "authors": ["Rick Umali"],
  //   "categories": []
  //   },
  //   {
  //   "title": "MongoDB in Action, Second Edition",
  //   "isbn": "1617291609",
  //   "pageCount": 0,
  //   "thumbnailUrl":
  //   "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/banker2.jpg",
  //   "status": "MEAP",
  //   "authors": [
  //   "Kyle Banker",
  //   "Peter Bakkum",
  //   "Tim Hawkins",
  //   "Shaun Verch",
  //   "Douglas Garrett"
  //   ],
  //   "categories": []
  // },
  // {
  // "title": "Getting MEAN with Mongo, Express, Angular, and Node",
  // "isbn": "1617292036",
  // "pageCount": 0,
  // "thumbnailUrl":
  // "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/sholmes.jpg",
  // "status": "MEAP",
  // "authors": ["Simon Holmes"],
  // "categories": []
  // }
  // ]
    

  bookModel.find((err,data)=>{
    console.log(data);
    res.json(data);
  })
    // // response to the request and send back json
    // res.status(200).json({
    //   myBooks:books
    // })
})

app.get('/api/books/:id', (req,res)=>{
    console.log(req.params.id);
    bookModel.findById(req.params.id,(err, data)=>{
        console.log(data);
        res.json(data);
    })
})

// listen the connections on the port specified above
app.listen(port,() => {
  console.log(`Example app listening on port ${port}`)
})

app.delete('/api/book/:id', (req,res)=>{
  console.log("Deleted:"+req.params.id);

  bookModel.deleteOne({_id:req.params.id},(error,data)=>{
    req.send(data);
  })
})