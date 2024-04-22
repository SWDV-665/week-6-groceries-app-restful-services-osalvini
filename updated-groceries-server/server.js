// Set up
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cors = require('cors')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017/groceries'
const PORT = process.env.PORT || 8080

console.log('MONGODB_URI: ', MONGODB_URI)
console.log('PORT: ', PORT)

// Configuration
mongoose.connect(MONGODB_URI, {
  authSource: 'admin'
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err))

app.use(bodyParser.urlencoded({ extended: 'true' }))
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(methodOverride())
app.use(cors())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] - ${req.method} ${req.originalUrl}`)
  next()
})

// Model
const Grocery = mongoose.model('Grocery', {
  name: String,
  quantity: Number
})

function getGroceries(req, res) {
  console.log('\t - Retrieving all Groceries')

  // use mongoose to get all groceries in the database
  // eslint-disable-next-line array-callback-return
  Grocery.find(function (err, groceries) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) {
      res.send(err)
    }

    res.json(groceries) // return all groceries in JSON format
  })
}

// Get all grocery items
app.get('/', (req, res) => { getGroceries(req, res) })

app.get('/api/groceries', (req, res) => { getGroceries(req, res) })

// Create a grocery Item
app.post('/api/groceries', function (req, res) {
  console.log('\t - Create New Grocery')

  Grocery.create({
    name: req.body.name,
    quantity: req.body.quantity,
    done: false
  }, function (err, grocery) {
    if (err) {
      res.send(err)
    }

    // create and return all the groceries
    // eslint-disable-next-line array-callback-return
    Grocery.find(function (err, groceries) {
      if (err) {
        res.send(err)
      }
      res.json(groceries)
    })
  })
})

// Update a grocery Item
app.put('/api/groceries/:id', function (req, res) {
  const grocery = {
    name: req.body.name,
    quantity: req.body.quantity
  }
  console.log('\t - Updating Grocery Item: ', req.params.id)
  Grocery.update({ _id: req.params.id }, grocery, function (err, raw) {
    if (err) {
      res.send(err)
    }
    res.send(raw)
  })
})

// Delete a grocery Item
app.delete('/api/groceries/:id', function (req, res) {
  const id = req.params.id
  console.log('\t - Deleting Grocery Item ', id)

  Grocery.remove({
    _id: id
  }, function (err, grocery) {
    if (err) {
      console.error('Error deleting grocery ', err)
    } else {
      // eslint-disable-next-line array-callback-return
      Grocery.find(function (err, groceries) {
        if (err) {
          res.send(err)
        } else {
          res.json(groceries)
        }
      })
    }
  })
})

// Start app and listen on port 8080
app.listen(process.env.PORT || 8080)
console.log('Grocery server listening on port  - ', PORT)
