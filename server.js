// server.js - Archivo principal del servidor
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Cargar variables de entorno desde .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conexión exitosa a MongoDB'))
.catch(err => console.error('Error al conectar con MongoDB:', err));

// Definir el esquema para las cotizaciones
const quotationSchema = new mongoose.Schema({
  // Información de contacto
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: String,
  position: String,
  
  // Detalles del sitio
  pages: [String],
  design: String,
  selectedColors: [String],
  selectedAnimations: [String],
  additionalFeatures: [String],
  deadline: String,
  
  // Requisitos adicionales
  notes: String,
  competitors: String,
  has_branding: String,
  
  // Información de la cotización
  planType: { 
    type: String, 
    required: true,
    enum: ['basic', 'intermediate', 'advanced'] 
  },
  estimatedPrice: Number,
  submissionDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'contacted', 'negotiating', 'approved', 'rejected'], 
    default: 'pending' 
  },
  
  // Campos para negociación
  negotiationNotes: String,
  finalPrice: Number,
  negotiable: { type: Boolean, default: true }
});

// Crear el modelo
const Quotation = mongoose.model('Quotation', quotationSchema);

// Rutas API
app.post('/api/quotations', async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body);
    const newQuotation = new Quotation(req.body);
    const savedQuotation = await newQuotation.save();
    
    // Aquí se podría agregar lógica para enviar un email de confirmación
    
    res.status(201).json(savedQuotation);
  } catch (error) {
    console.error('Error al guardar la cotización:', error);
    res.status(500).json({ message: 'Error al procesar la cotización', error: error.message });
  }
});

// Ruta para obtener todas las cotizaciones (para panel de administración)
app.get('/api/quotations', async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ submissionDate: -1 });
    res.status(200).json(quotations);
  } catch (error) {
    console.error('Error al obtener las cotizaciones:', error);
    res.status(500).json({ message: 'Error al obtener las cotizaciones', error: error.message });
  }
});

// Ruta para obtener cotizaciones filtradas por tipo de plan
app.get('/api/quotations/plan/:planType', async (req, res) => {
  try {
    const { planType } = req.params;
    const quotations = await Quotation.find({ planType }).sort({ submissionDate: -1 });
    res.status(200).json(quotations);
  } catch (error) {
    console.error('Error al obtener las cotizaciones por plan:', error);
    res.status(500).json({ message: 'Error al obtener las cotizaciones', error: error.message });
  }
});

// Ruta para obtener una cotización específica por ID
app.get('/api/quotations/:id', async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }
    res.status(200).json(quotation);
  } catch (error) {
    console.error('Error al obtener la cotización:', error);
    res.status(500).json({ message: 'Error al obtener la cotización', error: error.message });
  }
});

// Ruta para actualizar el estado de una cotización (para negociación)
app.put('/api/quotations/:id', async (req, res) => {
  try {
    const updatedQuotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedQuotation) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }
    
    res.status(200).json(updatedQuotation);
  } catch (error) {
    console.error('Error al actualizar la cotización:', error);
    res.status(500).json({ message: 'Error al actualizar la cotización', error: error.message });
  }
});

// Ruta para eliminar una cotización
app.delete('/api/quotations/:id', async (req, res) => {
  try {
    const deletedQuotation = await Quotation.findByIdAndDelete(req.params.id);
    
    if (!deletedQuotation) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }
    
    res.status(200).json({ message: 'Cotización eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la cotización:', error);
    res.status(500).json({ message: 'Error al eliminar la cotización', error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});