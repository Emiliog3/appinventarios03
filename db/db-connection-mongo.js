const mongoose = require('mongoose');

const getConnection = async () => {

    try {

        const url = 'mongodb+srv://pgomezg3:270591@cluster0.zst3d85.mongodb.net/invent-10062024?retryWrites=true&w=majority&appName=Cluster0'

    await mongoose.connect(url);

        console.log('MongoDB connected');
        
    } catch (error) {
        console.log('Error connecting to MongoDB');
        console.log(error);
    }


}

module.exports = {
    getConnection
}