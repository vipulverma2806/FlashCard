const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Card = require("./models");
const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://vipulverma:vipulverma@cluster0.ddiucwt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("MongoDB atlas connected successfully");
  })
  .catch((err) => console.log(err));

app.post("/addCard", async (req, res) => {
  const data = req.body;
  const { Question, Answer } = req.body;
  try {
    const result = await Card.create({ Question, Answer });
    console.log(result);
    res.status(201).json({response:result,message:"created successfully"});
  } catch (err) {
    console.log(err);
  }

  console.log(data);
});

app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { question, answer } = req.body;
  console.log(req.body);
  try {
    const result = await Card.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    console.log(result);
    res.status(201).json({updated:result,messsage:"updated successfully"});
  } catch (err) {
    console.log(err);
  }
});

app.delete("/delete", async (req, res) => {
  const data = req.body._id;
  try {
    const result = await Card.findByIdAndDelete(_id);
    console.log(result);
    res.status(201).json("Deleted successfully");
  } catch (err) {
    console.log(err);
  }

  console.log(data);
});

app.get("/getAllCards", async (req, res) => {
  try {
    const result = await Card.find();
    // console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});


//----Delete API endpoint-------------------------------------------------------
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Card.findByIdAndDelete(id);
    // console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

//--------Toggle known-unknown----------------------------------------------------
app.put("/updateKnown/:id",async(req,res)=>{
  const id = req.params.id;
  const known = req.body.known;

  try{
    const response = await Card.findByIdAndUpdate(id,{known:!known},{new:true});
    res.status(200).json({updated:response,message:"updated successfully"})
    console.log(res);
  }catch(err){
    console.log(err);
  }
})








app.listen(8000, () => console.log("server is running on port 8000"));
