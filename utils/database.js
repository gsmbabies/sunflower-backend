const mongoose = require('mongoose');
 
module.exports.connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('connected to mongodb'));
        mongoose.connection.on('open', () => console.log('open'));
        mongoose.connection.on('disconnected', () => console.log('disconnected'));
        mongoose.connection.on('reconnected', () => console.log('reconnected'));
        mongoose.connection.on('disconnecting', () => console.log('disconnecting'));
        mongoose.connection.on('close', () => console.log('close'));
        await mongoose.connect(process.env.MONGODB_SRV);
    } catch (error) {
        console.log(error);
    }
}