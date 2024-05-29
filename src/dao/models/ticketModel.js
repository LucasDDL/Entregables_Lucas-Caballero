import mongoose from "mongoose";

const schema = mongoose.Schema({
  code: String,
  pruchase_datetime: Date,
  amount: Number,
  purchaser: String
})

const Ticket = mongoose.model('Ticket', schema)

export default Ticket