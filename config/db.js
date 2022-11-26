const mongoose = require("mongoose");
const Mongo_URI = `mongodb+srv://mongo:mongopassword@cluster0.jnr6ncq.mongodb.net/?retryWrites=true&w=majority`;

const connectToMongo = () => {
  mongoose
    .connect(Mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => console.log("> Connected..."))
    .catch((err) =>
      console.log(`> Error while connecting to mongoDB : ${err.message}`)
    );
};

module.exports = connectToMongo;
