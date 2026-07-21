const mongoose = require("mongoose");

const [, , password, name, number] = process.argv;

if (!password) {
  console.log("Please provide password");
  process.exit(1);
}

// if (!password || !name || !number) {
//   console.log("Usage: node mongo.js <password> <name> <phonenumber>");
//   process.exit(1);
// }

const url = `mongodb+srv://omsalikhan_db_user:${password}@cluster0.owhi6xr.mongodb.net/phonebookApp?appName=Cluster0`;
mongoose.set("strictQuery", false);
mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (!name || !number) {
  Person.find({}).then(result => {
    console.log("phonebook:");
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
