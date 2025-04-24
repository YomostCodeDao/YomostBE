import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://user:password@127.0.0.1:27019/S-Mongo?authSource=admin', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Kết nối MongoDB thành công');
    } catch (err) {
        console.error('Không thể kết nối đến MongoDB', err);
        // Thoát process nếu kết nối thất bại
        process.exit(1);
    }
};

export default connectDB;