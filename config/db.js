import mongoose from 'mongoose';

const conectarDB = async () => {
    try {
        console.log(process.env.MONGO_URI);
        // Conectar la base de datos
        const URL = 'mongodb+srv://jesusrojax:ivjZtWrWGgBaTP8C@cluster0.uajn0.mongodb.net/';
        // const db = await mongoose.connect(process.env.MONGO_URI, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // });

        const db = await mongoose.connect(URL);
		
        // URL
        const url = `${db.connection.host}:${db.connection.port}`;

        console.log(url);

        console.log(`\nMongo DB conectado en ${url}\n`);
    } catch (error) {
        console.log('Error');
        console.log(error);
        process.exit(1);
    }
};

export default conectarDB;
