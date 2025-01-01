require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri=process.env.MONGO_URI

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

function handleError(action, error) {
  console.error(`Error during ${action}:`, error.message || error);
}



async function connectDB() {
  try {
      if (!db) {
          await client.connect();
          db = client.db("myproject"); // Replace with your database name
          console.log("Connected to MongoDB!");
      }
  } catch (error) {
      handleError("database connection", error);
      throw error; // Rethrow the error for caller to handle
  }
}


async function addUser(user) {
  try {
      const collection = db.collection("user");
      const result = await collection.insertOne(user);
      console.log(`User added with _id: ${result.insertedId}`);
  } catch (error) {
      console.error("Error adding user:", error);
  }
}

// Disconnect from MongoDB
async function disconnectDB() {
  try {
      await client.close();
      console.log("Disconnected from MongoDB.");
  } catch (error) {
      handleError("database disconnection", error);
  }
}

async function getUserByEmail(email) {
  try {
      const collection = db.collection("user"); // Connect to 'user' collection
      const user = await collection.findOne({ email }); // Find user by email
      return user;
  } catch (error) {
      console.error("Error fetching user:", error);
      return null;
  }
}




async function insertCartItem(item) {
  try {
     // Replace with your actual database name
    const collection = db.collection("cartItems");
    const result = await collection.insertOne(item);
    console.log(`Item inserted with _id: ${result.insertedId}`);
  } catch (error) {
    console.error("Error inserting item:", error);
  }
}



async function fetchCartItems() {
  try {
  
    const data = db.collection("cartItems");
    const items = await data.find({}).toArray();
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
}



async function removeCartItem(itemId) {
  try {
    const collection = db.collection("cartItems");

    if (itemId === 'all') {
      // Delete all items in the cart
      const result = await collection.deleteMany({});
      console.log(`Deleted ${result.deletedCount} items from cart`);
      return result.deletedCount > 0;
    } else {
      // Delete a single item by ID
      const result = await collection.deleteOne({ _id: new ObjectId(itemId) });
      
      if (result.deletedCount === 1) {
        console.log(`Successfully deleted item with _id: ${itemId}`);
        return true;
      } else {
        console.log(`No item found with _id: ${itemId}`);
        return false;
      }
    }
  } catch (error) {
    console.error("Error removing item:", error);
    throw error; // Rethrow the error for proper handling
  }
}




async function removeItem(itemId) {
  try {
    // const database = client.db("myproject"); // Replace with your actual database name
  console.log("Deleting item in list with ID:", itemId);
    const collection = db.collection('items');

    const result = await collection.deleteOne({ _id: new ObjectId(itemId) });
    if (result.deletedCount === 1) {

      console.log(`Successfully deleted item with _id: ${itemId}`)
        return true; // Return true if an item was deleted
    } else {
        return false; // Return false if no item was found
      console.log(`No item found with _id: ${itemId}`);
    }
  } catch (error) {
    console.error("Error removing item:", error);
  }
}



async function insertItem(item) {
  const collection = db.collection('items');
  return await collection.insertOne(item);
}

async function fetchItems() {
  const collection = db.collection('items');
  return await collection.find({}).toArray();
}

// Export the functions to be used in other parts of your app
module.exports = { connectDB, removeItem,insertCartItem, insertItem, fetchItems , disconnectDB, fetchCartItems, removeCartItem,addUser, getUserByEmail };



