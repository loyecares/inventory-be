// Step 1: Setting up the Project
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://aranloyejoshua:jayjay@cluster0.xsvayf9.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const PORT = process.env.PORT || 3000;

// Step 3: Creating the Models
const User = mongoose.model('User', {
  email: String,
  password: String,
});

// Step 4: Creating the Controllers
const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).send('User created successfully.');
  } catch (error) {
    res.status(500).send('Error creating user.');
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found.');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('Invalid credentials.');
    }
    // Generate a random secret key
    //const secretKey = crypto.randomBytes(32).toString('hex');
    const token = jwt.sign({ email: user.email }, 'secret_key');
    res.send({ token, "message": "Login successful" });
  } catch (error) {
    res.status(500).send('Error signing in.');
  }
};

// Step 6: Implementing Sign-Up Functionality
app.post('/signup', signUp);

// Step 7: Implementing Sign-In Functionality
app.post('/signin', signIn);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
