import express from 'express';

const { PORT = 3000 } = process.env;

const app = express();

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mestodb');

const cardSchema = new mongoose.Schema({
  name: String,
  link: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const card = mongoose.model('card', cardSchema);

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
