const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB Atlas connection...');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set (password hidden)' : 'Not set!');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(' MongoDB Atlas connected!');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(' Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
  } catch (error) {
    console.error(' MongoDB connection failed:', error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n Password issue! Check:');
      console.log('1. Password in .env is correct');
      console.log('2. In Atlas: Database Access → Edit user → Reset password');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n Network/cluster name issue');
      console.log('Check cluster name: note-app-cluster.ujf34b4.mongodb.net');
    } else if (error.message.includes('timed out')) {
      console.log('\n IP not whitelisted in Atlas');
      console.log('Go to: Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)');
    }
  }
}

test();
