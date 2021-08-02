const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.aeoo8.mongodb.net/phonebook-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phone = mongoose.model('Phone', phoneSchema)


switch (process.argv.length) {
case 3:{
  //fetch
  Phone.find({}).then(result => {
    console.log( 'phonebook:')
    result.forEach(phone => {
      console.log(`${phone.name} ${phone.number}`)
    })
    mongoose.connection.close()
  })
  break
}
case 5:{
  // insert
  const name = process.argv[3]
  const number = process.argv[4]

  const phone = new Phone({
    name: name,
    number: number
  })

  phone.save().then(() => {
    console.log(`added ${phone.name} number ${phone.number} to phonebook`)
    mongoose.connection.close()
  })
  break
}
default:
  break
}
