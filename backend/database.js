  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const User = require('../models/user');
  const Book = require('../models/book');
  const Feedback = require('../models/Feedback');
  const upload = require('./upload')
  require("dotenv").config({path: '../.env'});

  

  const app = express();
  app.use(cors());
  app.use(express.json());

  mongoose.connect(process.env.MONGODB_URI)

    .then(() => console.log('MongoDB connected'))

    .catch(err => console.log('Connection error:', err));

  app.post('/register', async (req, res) => {
    const { firstname,lastname,ic,username, email, password,imageUrl} = req.body;
    const access = "user"

    try {

      const newUser = new User({firstname,lastname,ic,username, email, password,imageUrl,access});
      console.log(newUser)
      await newUser.save(); // creates a new user
      
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

  app.post('/username', async (req, res) => {
    const {username} = req.body;
    
    try {
      
      //findone() = macam nak cari, kalau sql, SELECT * FROM ??? WHERE + ?, in this case nak "findone()" email yang sama, if so, display error sbb email must be unique
      const existing = await User.findOne({ username });
      if (existing) return res.status(400).json({ message: 'Username already used' }) 
        else {
      return res.status(289).json({})
    }
  
    
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' });
  }
  });

  app.post('/ic', async (req, res) => {
    const {ic} = req.body;
    
    try {
      
      //findone() = macam nak cari, kalau sql, SELECT * FROM ??? WHERE + ?, in this case nak "findone()" email yang sama, if so, display error sbb email must be unique
      const existing = await User.findOne({ ic });
      if (existing) return res.status(400).json({ message: 'IC already exist' }) 
        else {
      return res.status(289).json({})
    }
  
    
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' });
  }
  });


  app.post('/email', async (req, res) => {
    const {email} = req.body;
    
    try {
      
      
      //findone() = macam nak cari, kalau sql, SELECT * FROM ??? WHERE + ?, in this case nak "findone()" email yang sama, if so, display error sbb email must be unique
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already used' }) 
      else {
    return res.status(289).json({})
      }

    
      
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Something went wrong' });
    }
  });


  app.post('/login', async (req, res) => {
    
    const {username, password} = req.body;

    try{

      const verified = await User.findOne({username});

      if(!verified) 
        return res.status(400).json({error : "Redirecting to registration..."})
      
      if(verified.password !== password){
        return res.status(401).json({error: 'Wrong Password'})
      }

      return res.status(200).json({ message: 'Login successful', userid:verified._id, username:verified.username, access:verified.access });

      /**
       * Informational responses (100 – 199)
        Successful responses (200 – 299)
        Redirection messages (300 – 399)
        Client error responses (400 –cd  499)
        Server error responses (500 – 599)
      */

    } catch (err){
      return res.status(500).json({ error: 'Something went wrong' });
    }

  });

  app.post('/sell', async (req,res) => {
  const { userid, username, bookAuthor, bookTitle, faculty, condition, price, imageUrl } = req.body;

  const availability  = "Available"
  const buyerid = "none"
  console.log('File size before upload:', req.size);

    console.log('Received /sell request:', req.body);

    try{

      const newBook = new Book({userid, username,bookAuthor, bookTitle, faculty, condition, price,imageUrl,availability,buyerid});

      await newBook.save(); // add new book
      console.log("succesfull")
      console.log('Received imageUrl:', imageUrl);

      console.log(newBook)
      return res.status(200).json({message: 'Book Added Succesfully'})

    } catch (err) {
      return res.status(500).json({ error: 'Sini ke' })
    }
    
  });

  //get sebab nak fetch data dari server, bukan 'post' data to server
  app.get('/home', async (req,res) => {
    const {userid} = req.query
    console.log("received userid",userid)
    try{

      //Book.find takde parameter sebab nak select all
      // Book.find({author: "Umar Syakir"}) -> contoh ada paramater
      const books = await Book.find({availability: "Available", userid: { $nin:[userid]} }); // $nin = NOT IN
      return res.status(200).json(books)

    } catch (err){
      return res.status(500).json({ error: 'Something went wrong' })
    }

  });

  


  app.post('/profile', async (req,res) => {
    const { userid,username } = req.body;
    console.log("received userid",userid)

    try {

      const userdata = await User.findById(userid);
      console.log("userdata",userdata)
      const bookdata = await Book.find({userid : userid}); //({username: 'sykr'})
      console.log("bookdata",bookdata)
      const feedbackdata = await Feedback.find({sellerid : username}); 
      console.log("feedbackdata",feedbackdata)
      const purchasedata = await Book.find({buyerid : userid}); 
      console.log("purchasedata",purchasedata);

    let averageRating = 0; //init as 0
    let totalRating
    for(let i = 0; i < feedbackdata.length; i++){
      if (feedbackdata.length > 0) {
        totalRating = feedbackdata[i].rating //tambah semua rating
      }
      
      averageRating = totalRating / feedbackdata.length; //bahagi dengan total rating count
    }
    console.log("Average Rating",averageRating)
    return res.status(200).json({ userdata, bookdata, feedbackdata,averageRating, purchasedata});

    } catch (e){
      return res.status(500).json({ error: 'Something went wrong' })
    }
  })

  app.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUser,
      totalBook,
      FSG,
      FP,
      FSKM,
      aCount,
      rCount,
      sCount
    ] = await Promise.all([ //promise.all to run query in parallel
      User.countDocuments(),
      Book.countDocuments(),
      Book.countDocuments({ faculty: "FSG" }),
      Book.countDocuments({ faculty: "FP" }),
      Book.countDocuments({ faculty: "FSKM" }),
      Book.countDocuments({ availability: "Available" }),
      Book.countDocuments({ availability: "Reserved" }),
      Book.countDocuments({ availability: "Sold" })
    ]);

    const soldBooks = await Book.find({ availability: "Sold"});

    let totalSold = 0;
    for(let i = 0; i < soldBooks.length; i++) {
      totalSold += soldBooks[i].price;
    }

    return res.status(200).json({ totalUser, totalBook, FSG, FP, FSKM, aCount, rCount, sCount,totalSold});

  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});



  app.post('/getbook', async (req,res) => {
    const { bookid } = req.body;
    console.log("received bookid",bookid)

    try {

      const bookdata = await Book.findById(bookid);
      console.log("bookdata",bookdata)
      
      return res.status(200).json(bookdata)
    } catch (e){
      return res.status(500).json({ error: 'Something went wrong' })
    }
  })

  app.post('/getbookfromid', async (req,res) => {
    const { userid } = req.body;
    console.log("received userid",userid)

    try {

      const bookdata = await Book.findById(userid);
      console.log("bookdata",bookdata)
      return res.status(200).json(bookdata)
    } catch (e){
      return res.status(500).json({ error: 'Something went wrong' })
    }

  })

  

  //upload.single('file') -> multer middlewatre for handling file uploads, single('file') means, the system expects one file
app.post('/upload', upload.single('file'), async (req, res) => {


  try {
    res.status(200).json({ fileUrl: req.file.location }); //successful, returns the file url, eg: https://...
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

 app.post('/addFeedback', async (req,res) => {
  const { userid,review,rating,username,bookid,sellerid} = req.body;
  console.log("received username" , username)
  console.log("receive seller id", sellerid);
  const sold = "Sold"
  
 
    try{

      const newFeedBack = new Feedback({userid,review,rating,username,sellerid});
      
      const soldBook = await Book.findByIdAndUpdate(bookid, { $set: {availability:sold, buyerid: userid }}, {new:true});
      console.log(soldBook);

      await newFeedBack.save(); 
      console.log(newFeedBack)
     
      return res.status(200).json({message: 'Feedback Added Succesfully'})

    } catch (err) {
      return res.status(500).json({ error: 'Sini ke' })
    }
    
  });

  
  app.post('/updateBook', async (req,res) => {
    const {bookid,newBookAuthor,newBookTitle,newFaculty,newCondition,newPrice,newAvailability} = req.body;
 
  try{

    const updatedBook = await Book.findByIdAndUpdate(bookid, { $set: {bookAuthor: newBookAuthor, bookTitle: newBookTitle, faculty: newFaculty, condition: newCondition, price:newPrice, availability:newAvailability }}, {new:true});
    
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }


     return res.status(200).json({message: 'Update Succesfully'});


  }catch (e){
       return res.status(500).json({ error: 'Sini ke' })
  }
    
  });

  app.post('/updateProfile', async (req,res) => {
    const {userid,newUsername,imageUrl} = req.body;
    console.log("Received",newUsername,userid,imageUrl)

  try{

    const existingUsername = await User.findOne({ username: newUsername });
    
   
    
    const updateUser = await User.findByIdAndUpdate(userid, { $set: {username: newUsername, imageUrl: imageUrl }}, {new:true});

    if (!updateUser) {
      return res.status(404).json({ message: 'User not found' });
    }

     return res.status(200).json({message: 'Update Succesfully'});


  }catch (e){
       return res.status(500).json({ error: 'Sini ke' })
  }
    
  });

  app.post('/deleteBook', async (req,res) => {
    const { bookid } = req.body;
    console.log("received userid",bookid)

    try {

      const bookdata = await Book.deleteOne({_id : bookid});
      console.log("deleted bookdata",bookdata)
      return res.status(200).json({message: "Book Deleted"}) 
    } catch (e){
      return res.status(500).json({ error: 'Something went wrong' })
    }

  })

   app.post('/deleteProfile', async (req,res) => {
    const { userid } = req.body;
    console.log("received userid",userid)

    try {

      const userdata = await User.deleteOne({_id : userid});
      console.log("deleted bookdata",userdata)
      return res.status(200).json({message: "User Deleted"}) 
    } catch (e){
      return res.status(500).json({ error: 'Something went wrong' })
    }

  })






  /* nak tengok semua colletion
  Book.find({})
    .then(books => console.log(books))
    .catch(err => console.error(err));
  */

 
 
 app.get('/adminUser', async (req,res) => {
   
    try{
      
      
      //const users = await User.find({access: "user"});
      const users = await User.find({});
      console.log("users",users)
      return res.status(200).json(users)
      
    } catch (err){
      return res.status(500).json({ error: 'Something went wrong' })
    }
    
  });
  
  app.get('/adminBook', async (req,res) => {
    
    try{      
      const books = await Book.find({});
      console.log("books",books)
      return res.status(200).json(books)
      
    } catch (err){
      return res.status(500).json({ error: 'Something went wrong' })
    }
    
  });
  
  app.get('/adminFeedback', async (req,res) => {
    
    try{

      
      
      const feedbacks = await Feedback.find({});
      
      console.log("feedbacks",feedbacks)  
      return res.status(200).json(feedbacks)
      
    } catch (err){
      return res.status(500).json({ error: 'Something went wrong' })
    }
    
  });

app.post('/forgotPassword', async (req, res) => {
const { email, ic, newPassword } = req.body;

  try {
    const user = await User.findOne({ email, ic });

    if (!user) {
      return res.status(404).json({ error: 'User not found with provided email and IC' });
    }

    await User.updateOne({ email, ic }, { $set: { password: newPassword }},  { new: true });
    const newuser = await user.save();
    console.log(newuser)

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

  
    
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));