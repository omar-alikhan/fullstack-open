const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
  .connect(url, { family: 4 })

  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch(error => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    minlength: [3, "Name must be at least 3 letters or longer."],
  },
  number: {
    type: String,
    required: [true, "Number is required."],
    minlength: [8, "Number must be at least 8 digits or longer."],
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: `Phone must be numbers only and in the format XX-XXXXXX or XXX-XXXXX`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
