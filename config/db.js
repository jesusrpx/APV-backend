import mongoose from 'mongoose';

const conectarDB = async () => {
	try {

		// Conectar la base de datos
		const db = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})

		// URL
		const url = `${db.connection.host}:${db.connection.port}`

		console.log(`\nMongo DB conectado en ${url}\n`)

	} catch (error) {
		console.log("Error");
		process.exit(1);
	}
}

export default conectarDB