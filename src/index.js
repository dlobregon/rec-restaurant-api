const express = require('express');
const dotenv = require('dotenv');
const reservationsRouter = require('./routes/reservationsRouter');
const app = express();
const port = process.env.PORT || 3000;
dotenv.config();
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/reservations', reservationsRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});