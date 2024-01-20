require("dotenv").config();
const mongoose = require("mongoose");

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Schema = mongoose.Schema;

//Define schema for "person"
const personSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number },
  favoriteFoods: [String],
});

// Create the model for "Person" based on the schema
const Person = mongoose.model("Person", personSchema);

const createAndSavePerson = (done) => {
  const person = new Person({
    name: "John Doee",
    age: 30,
    favoriteFoods: "Pizza",
  });

  person.save(function (err, data) {
    done(null, data);
  });
};

const createManyPeople = (arrayOfPeople, done) => {
  // Insert multiple documents based on the provided arrayOfPeople
  Person.create(arrayOfPeople, (err, createdPeople) => {
    if (err) {
      console.error("Error creating people:", err);
      done(err); // Pass the error to the callback
    } else {
      console.log("People created:", createdPeople);
      done(null, createdPeople); // Pass the createdPeople to the callback
    }
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, personFound) => {
    if (err) return console.log(err);
    done(null, personFound);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, foundPerson) => {
    if (err) console.log(err);
    done(null, foundPerson);
  });
};

const findPersonById = (personId, done) => {
  Person.findById({ _id: personId }, (err, foundPerson) => {
    if (err) console.log(err);
    done(null, foundPerson);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, (err, personFound) => {
    if (err) {
      console.error("Error finding person:", err);
    } else if (personFound) {
      // Check if the person document was found
      personFound.favoriteFoods.push(foodToAdd); // Push the new favorite food

      personFound.save((err, updatedPerson) => {
        if (err) {
          console.error("Error saving updated person:", err);
        } else {
          console.log("Updated person:", updatedPerson);
        }
        done(null, updatedPerson);
      });
    } else {
      console.log("Person not found"); // Handle the case where the person was not found
    }
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  const update = { age: ageToSet };
  const options = {
    returnDocument: "before",
    new: true,
  };

  Person.findOneAndUpdate(
    { name: personName },
    update,
    options,
    (err, recordUpdated) => {
      if (err) console.log(err);
      done(null, recordUpdated);
    }
  );
};

const removeById = (personId, done) => {
  Person.findOneAndDelete({ _id: personId }, (err, result) => {
    if (err) console.log(err);
    done(null, result);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.deleteMany({ name: nameToRemove }, (err, result) => {
    if (err) console.log(err);
    done(null, result);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  const query = Person.find({ favoriteFoods: foodToSearch })
    .limit(2)
    .sort({ name: 1 })
    .select({ age: 0 });

  query.exec((err, result) => {
    if (err) console.log(err);
    done(null, result);
  });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
