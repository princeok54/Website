import express from "express";
import mysql from "mysql";
import fetch from "node-fetch";

const app = express();

//Database Connection
const db = mysql.createConnection({
  host: "sql6.freesqldatabase.com",
  user: "sql6443045",
  password: "BCwSfi5zTf",
  database: "sql6443045",
});
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to Database");
});

// ADD DATA
app.get("/adddata", async (req, res) => {
  try {
    // Enter url here
    const url = "";
    const myData = await fetch(url);
    // console.log("myData", myData);
    const myDataJson = await myData.json();
    // console.log("myDataJson", myDataJson);
    // console.log("myData.size", myData.size);
    myDataJson.data.items.forEach(async (element) => {
      let column = {
        address: element.address,
        balance: parseInt(element.balance),
      };
      let sql = "INSERT INTO mydata SET ?";
      db.query(sql, column, (err) => {
        if (err) throw err;
      });
    });
    res.send("Working Properly");
  } catch (err) {
    console.log(err);
    res.send("Some error Occured");
  }
});

// GETDATA
app.get("/getdata", (req, res) => {
  try {
    let sql = "SELECT * FROM mydata";
    db.query(sql, (err, result) => {
      console.log(result);
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    res.send("Some error Occured");
  }
});

// Route to create table, to be used only once
// ALREADY USED ONCE
app.get("/createtable", (req, res) => {
  try {
    let sql =
      "CREATE TABLE mydata(id int AUTO_INCREMENT,address VARCHAR(255),balance bigint , PRIMARY KEY(id))";
    db.query(sql, (err, result) => {
      if (err) throw err;
      res.send("<h1>Table Created</h1>");
    });
  } catch (err) {
    console.log(err);
    res.send("Some error Occured");
  }
});

app.listen(3000, () => {
  console.log("server running on 3000");
});
