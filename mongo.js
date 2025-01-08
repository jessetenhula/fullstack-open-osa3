const mongoose = require('mongoose')

if (!(process.argv.length === 3 || process.argv.length === 5)) {
  console.log('give arguments in format <password name number> to add new entry or <password> to print existing entries')
  process.exit(1)
}

const password = process.argv[2]
const inputName = process.argv[3]
const inputNumber = process.argv[4]

const url = `mongodb+srv://morp:${password}@phonebook.kl7g2.mongodb.net/phone?retryWrites=true&w=majority&appName=phonebook`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log("phonebook:")
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const person = new Person({
    name: inputName,
    number: inputNumber
  })
  
  person.save().then(result => {
    console.log(`added person to phonebook:${result.name} ${result.number}`)
    mongoose.connection.close()
  })
}