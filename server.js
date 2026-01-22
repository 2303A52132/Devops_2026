// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MongoDB Connection (✅ FIXED)
mongoose.connect('mongodb://localhost:27017/eventDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  participants: { type: [String], default: [] }
});

// Event Model
const Event = mongoose.model('Event', eventSchema);

// CREATE Event
app.post('/events', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ Events
app.get('/events', async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;

  try {
    const events = await Event.find({
      title: { $regex: search, $options: 'i' }
    })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Event.countDocuments({
      title: { $regex: search, $options: 'i' }
    });

    res.json({ events, total, page: Number(page) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE Event
app.put('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!event) return res.status(404).send('Event not found');
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE Event
app.delete('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).send('Event not found');
    res.send('Event deleted');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start Server (✅ FIXED)
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
