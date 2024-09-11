const { connect } = require('mongoose');
var app = require('./app.js');
var connectDB = require('./utils/database')
var PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    connectDB.connectDB();
    console.log(`connected to port ${PORT}`)
});

