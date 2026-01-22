const mongoose = require('mongoose');

// MongoDB connection (✅ FIXED)
mongoose.connect('mongodb://localhost:27017/eventDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Schema
const eventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  location: String,
  participants: [String]
});

const Event = mongoose.model('Event', eventSchema);

// Sample data
const events = [
  {
    title: "Tech Conference 2023",
    date: new Date("2023-11-25T09:00:00Z"),
    location: "New York",
    participants: ["John Doe", "Jane Smith"]
  },
  {
    title: "AI/ML Workshop",
    date: new Date("2023-12-05T10:00:00Z"),
    location: "San Francisco",
    participants: ["Michael Clark", "Emma Wilson"]
  }
];

// Insert
Event.insertMany(events)
  .then(() => {
    console.log('Events inserted successfully');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error(err);
    mongoose.connection.close();
  });
