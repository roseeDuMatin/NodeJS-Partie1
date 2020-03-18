
// mongo "mongodb+srv://cluster0-i5dfl.azure.mongodb.net/test" --username dbUser
// IhoOCqeQ35YCAiDa

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const user = 'dbUser';
const pwd = 'IhoOCqeQ35YCAiDa';


(async function() {
  // Connection URL
  const url = 'mongodb+srv://' + user + ':' + pwd + '@cluster0-i5dfl.azure.mongodb.net/test';

  const dbName = 'nodejsChat';
  const client = new MongoClient(url, { useUnifiedTopology: true } ,{ useNewUrlParser: true });

  try {
    // Use connect method to connect to the Server
    await client.connect();

    const db = client.db(dbName);
    console.log("Connected correctly to server : " + dbName);

    // Get the collection
    const collection = db.collection('dates');

    // Insert multiple documents
    // const r = await col.insertMany([{a:1}, {a:1}, {a:1}]);
    // assert.equal(3, r.insertedCount);
    
    // Insert a single document
    let line = { date: new Date() };
    let r = await db.collection(collection.collectionName).insertOne(line);
    assert.equal(1, r.insertedCount);

    //Get the cursor
    const cursor = collection.find({});
    while(await cursor.hasNext()) {
        const doc = await cursor.next();
        console.dir(doc);
    }
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
})();


