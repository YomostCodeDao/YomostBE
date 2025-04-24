import express from 'express';
import mongoose from 'mongoose';

// MongoDB connection
mongoose.connect('mongodb://user:password@127.0.0.1:27019/S-Mongo?authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// (Tạo một Schma& Model)
const movieSchema = new mongoose.Schema({
    title: String, //Tên phimdo 
    genre: String, //Thể loại phim
    rating: Number //Điểm đánh giá
});

// Create a model from the schema 
const Movie = mongoose.model('Movie', movieSchema);


// Khởi tạo app
const app = express();
app.use(express.json());

// Các API Routes --------------->>>>

// Thêm mới một phim
app.post('/movies', async (req, res) => {

    try {
        const { title, genre, rating } = req.body;
        console.log(req.body);
        const result = await Movie.create({ title, genre, rating });
        console.log(result);
        res.status(201).send(result);
    } catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
});

// Lấy danh sách tất cả các phim
app.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).send(movies);
    } catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
});

// Lấy một phim theo ID
app.get('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).send('Movie not found');
        res.status(200).send(movie);
    } catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
});

// Cập nhật thông tin một phim
app.put('/movies/:id', async (req, res) => {
    try {
        const { title, genre, rating } = req.body;
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            { title, genre, rating },
            { new: true }
        );
        if (!movie) return res.status(404).send('Movie not found');
        res.status(200).send(movie);
    } catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
});

// Xoá một phim theo ID
app.delete('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) return res.status(404).send('Movie not found');
        res.status(200).send('Movie deleted');
    } catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
});

// Đếm số lượng phim hiện có
app.get('/movies-count', async (req, res) => {
    try {
        const count = await Movie.countDocuments();
        res.status(200).send({ count });
    } catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
});

// Tìm kiếm phim theo thể loại
app.get('/movies/genre/:genre', async (req, res) => {
    try {
        const movies = await Movie.find({ genre: req.params.genre });
        res.status(200).send(movies);
    } catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
});

// Tìm phim có xếp hạng cao nhất
app.get('/movies/rating/top-rated', async (req, res) => {
    try {
        const movie = await Movie.findOne().sort({ rating: -1 }).limit(5);
        res.status(200).send(movie);
    } catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
});





// // Update a movie
// app.put('/movies/:id', async (req, res) => {
//     const { id } = req.params;
//     const { title, genre, rating } = req.body;

//     try {
//         const movie = await Movie.findByIdAndUpdate(id, { title, genre, rating }, { new: true });
//         res.status(200).send(movie);
//     } catch (err) {
//         res.status(400).send('Error: ' + err.message);
//     }
// });



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});