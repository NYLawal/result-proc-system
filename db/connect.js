const mongoose = require('mongoose');
// const connectionString = 'mongodb+srv://nurahawwal:myclusterpassword@cluster0.ucfnmmv.mongodb.net/student-database'


// mongoose.connect(connectionString)
// .then(()=> console.log("database connection established"))
// .catch((err)=> console.log(err));

// main().catch((err) => console.log(err));
// async function main() {
//     await mongoose.connect(connectionString)
//     console.log("connection established");
// }

function connectDB(url){
    return mongoose.connect(url)
}

module.exports = connectDB;