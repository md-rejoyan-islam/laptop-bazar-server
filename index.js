const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5002;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.37oivsc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const laptopBazar = client.db("laptopBazar").collection("products");
    const laptopSaler = client.db("laptopsaler").collection("saleList");
    const favoriteList = client.db("favoriteList").collection("favorite");
    const accountType = client.db("account").collection("user");

    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = laptopBazar.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.post("/products", async (req, res) => {
      const user = req.body;
      const result = await laptopBazar.insertOne(user);

      res.send(result);
    });

    //for favorite list
    app.post("/favoriteProduct", async (req, res) => {
      const user = req.body;
      const result = await favoriteList.insertOne(user);
      res.send(result);
    });
    app.get("/favoriteProduct", async (req, res) => {
      const query = {};
      const queryByEmail = { sellerEmail: req.query.email };
      const queryData = favoriteList.find(queryByEmail);
      const userData = await queryData.toArray();
      // const cursor = favoriteList.find(query);
      // const users = await cursor.toArray();
      res.send(userData);
    });
    //search by seller email
    app.get("/addedProductList", async (req, res) => {
      const query = {};
      const queryByEmail = { sellerEmail: req.query.email };
      const queryData = laptopBazar.find(queryByEmail);
      const userData = await queryData.toArray();
      // const cursor = favoriteList.find(query);
      // const users = await cursor.toArray();
      res.send(userData);
    });

    //user account
    app.post("/account", async (req, res) => {
      const user = req.body;
      const result = await accountType.insertOne(user);
      res.send(result);
    });
    app.get("/account", async (req, res) => {
      let query = {};
      const emailAddress = req.query.email;
      let type = req.query.type;
      if (type) {
        query = { account_type: type };
      }
      if (emailAddress) {
        query = { email: emailAddress };
      }
      const queryData = accountType.find(query);
      const userData = await queryData.toArray();
      res.send(userData);
    });
    //seller list
    app.get("/account", async (req, res) => {
      let query = {};
      let type = req.query.type;
      if (type) {
        query = { account_type: type };
      }
      const queryData = accountType.find(query);
      const userData = await queryData.toArray();
      res.send(userData);
    });

    //single favorite product delete
    app.delete("/favoriteProduct/:id", async (req, res) => {
      const productId = req.params.id;
      const query = { _id: ObjectId(productId) };
      const result = await favoriteList.deleteOne(query);
      res.send(result);
    });
    //all favorite product delete
    app.delete("/favoriteProduct", async (req, res) => {
      const query = {};
      const result = await favoriteList.deleteMany(query);
      res.send(result);
    });

    //for saler
    app.get("/productSaleDetails", async (req, res) => {
      const emailAddress = req.query.email;
      let query = {};
      if (emailAddress) {
        query = { email: emailAddress };
      }

      const queryData = laptopSaler.find(query);
      const result = await queryData.toArray();
      console.log(result);

      res.send(result);
    });
    app.post("/productSaleDetails", async (req, res) => {
      const user = req.body;
      const result = await laptopSaler.insertOne(user);
      console.log(result);
      res.send(result);
    });
    //single product delete
    app.delete("/productSaleDetails/:id", async (req, res) => {
      const productId = req.params.id;
      const query = { _id: ObjectId(productId) };
      const result = await laptopSaler.deleteOne(query);
      res.send(result);
    });
    //all product delete
    app.delete("/productSaleDetails", async (req, res) => {
      const query = {};
      const result = await laptopSaler.deleteMany(query);
      res.send(result);
    });

    //search by band
    app.post("/productsByBand", async (req, res) => {
      const user = req.body.band;
      let query = {};
      if (user) {
        query = { band: user };
      }
      const cursor = laptopBazar.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    //search by price
    app.post("/productsByPrice", async (req, res) => {
      const price = req.body.price;
      const query = { price: { $lte: price } };

      const cursor = laptopBazar.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.delete("/products/:id", async (req, res) => {
      const userId = req.params.id;
      const query = { _id: ObjectId(userId) };
      const result = await laptopBazar.deleteOne(query);
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const userId = req.params.id;
      const query = { _id: ObjectId(userId) };
      const user = await laptopBazar.findOne(query);
      res.send(user);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("show");
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
