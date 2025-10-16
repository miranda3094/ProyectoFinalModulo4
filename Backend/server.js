const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",   
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

// Conexión a MongoDB
const mongoURI = 'mongodb+srv://jekamiranda30_db_user:Jeka.789012@cluster0.fgbjelf.mongodb.net/libreria';

mongoose.connect(mongoURI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Esquema y modelo de libro
const bookSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  editorial: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  año: { type: Number, required: true },
  descripcion: { type: String, required: true }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

// Crear un nuevo libro
app.post('/books', async (req, res) => {
  try {
    const { titulo, autor, editorial, isbn, año, descripcion } = req.body;

    if (!titulo || !autor|| !editorial || !isbn|| !año || !descripcion) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const newBook = new Book({ titulo, autor, editorial, isbn, año, descripcion });
    await newBook.save();

    res.status(201).json({ message: 'Libro registrado correctamente', book: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el libro', error: error.message });
  }
});

// Obtener todos los libros
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los libros', error: error.message });
  }
});

// Eliminar un libro por ISBN
app.delete('/books/:isbn', async (req, res) => {
  try {
    const deletedBook = await Book.findOneAndDelete({ isbn: req.params.isbn });
    if (!deletedBook) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    res.json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el libro', error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});