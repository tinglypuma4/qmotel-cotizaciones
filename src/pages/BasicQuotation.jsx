import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './QuotationForm.css';

const BasicQuotation = () => {
  const [selectedColors, setSelectedColors] = useState([]);
  const [additionalFeatures, setAdditionalFeatures] = useState([]);
  const [price, setPrice] = useState(12000);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    pages: ['home'],
    design: 'modern',
    deadline: '4',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // Función para actualizar precio basado en selecciones
  const updatePrice = (feature, isAdding) => {
    const priceAdjustments = {
      'contact-form': 500,
      'optimized-images': 800,
      'social-links': 600,
      'urgentDelivery': 2500
    };
    
    const adjustment = priceAdjustments[feature] || 0;
    
    setPrice(prev => isAdding ? prev + adjustment : prev - adjustment);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (name === 'pages') {
      let updatedPages = [...formData.pages];
      
      if (checked) {
        updatedPages.push(value);
      } else {
        updatedPages = updatedPages.filter(page => page !== value);
      }
      
      setFormData({
        ...formData,
        pages: updatedPages
      });
    }
  };

  const handleColorSelect = (color) => {
    const currentColors = [...selectedColors];
    const maxColors = 3;
    
    if (currentColors.includes(color)) {
      // Si ya está seleccionado, lo quitamos
      setSelectedColors(currentColors.filter(c => c !== color));
    } else if (currentColors.length < maxColors) {
      // Si no está seleccionado y no hemos alcanzado el máximo, lo añadimos
      setSelectedColors([...currentColors, color]);
    }
  };
  
  // Manejar cambio en características adicionales
  const handleFeatureChange = (feature, isChecked) => {
    const currentFeatures = [...additionalFeatures];
    
    if (isChecked) {
      setAdditionalFeatures([...currentFeatures, feature]);
      updatePrice(feature, true);
    } else {
      setAdditionalFeatures(currentFeatures.filter(f => f !== feature));
      updatePrice(feature, false);
    }
  };
  
  // Manejar cambio en plazo de entrega
  const handleDeadlineChange = (e) => {
    const value = e.target.value;
    
    // Actualizar el formData con el nuevo plazo
    setFormData({
      ...formData,
      deadline: value
    });
    
    // Si selecciona entrega urgente (2 semanas)
    if (value === "2") {
      if (!additionalFeatures.includes('urgentDelivery')) {
        setAdditionalFeatures([...additionalFeatures, 'urgentDelivery']);
        updatePrice('urgentDelivery', true);
      }
    } else {
      // Si cambia de urgente a normal
      if (additionalFeatures.includes('urgentDelivery')) {
        setAdditionalFeatures(additionalFeatures.filter(f => f !== 'urgentDelivery'));
        updatePrice('urgentDelivery', false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Preparar los datos para enviar al backend
      const quotationData = {
        ...formData,
        planType: 'basic',
        selectedColors: selectedColors,
        additionalFeatures: additionalFeatures,
        estimatedPrice: price,
        submissionDate: new Date(),
        status: 'pending'
      };
      
      // Enviar los datos al backend
      const response = await axios.post('http://localhost:5000/api/quotations', quotationData);
      
      setSubmitStatus({
        success: true,
        message: 'Cotización enviada correctamente. Nos pondremos en contacto pronto para negociar los detalles.',
        quotationId: response.data._id
      });
      
      // Resetear el formulario
      setSelectedColors([]);
      setAdditionalFeatures([]);
      setPrice(12000);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        pages: ['home'],
        design: 'modern',
        deadline: '4',
        notes: ''
      });
      
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSubmitStatus({
        success: false,
        message: 'Error al enviar la cotización. Por favor, inténtelo de nuevo más tarde.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <header>
        <div className="header-content">
          <span className="logo">Cotización para Qmotel</span>
          <nav className="navigation">
            <Link to="/cotizacion-basica" className="nav-link active">Plan Básico</Link>
            <Link to="/cotizacion-intermedia" className="nav-link">Plan Intermedio</Link>
            <Link to="/cotizacion-avanzada" className="nav-link">Plan Avanzado</Link>
          </nav>
        </div>
      </header>

      <div className="form-container active">
        <h2>Plan Básico - Página Web Esencial</h2>
        
        <div className="included-features">
          <h3>Incluido en todos los planes:</h3>
          <ul>
            <li>Optimización SEO para Google</li>
            <li>Soporte técnico especializado (8 horas, L-V)</li>
            <li>Alojamiento web independiente y seguro</li>
            <li>Dominio personalizado por 1 año</li>
            <li>Certificado SSL (https://)</li>
          </ul>
        </div>
        
        {submitStatus && (
          <div className={`status-message ${submitStatus.success ? 'success' : 'error'}`}>
            <p>{submitStatus.message}</p>
            {submitStatus.success && (
              <p>ID de cotización: <strong>{submitStatus.quotationId}</strong> (Guarde este ID para referencia futura)</p>
            )}
          </div>
        )}

        <form id="basic-plan-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Información de Contacto</h3>
            <label htmlFor="name">Nombre completo:</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              required 
            />
            
            <label htmlFor="email">Correo electrónico:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              required 
            />
            <label htmlFor="phone">Teléfono:</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          <div className="form-section">
            <h3>Características del Sitio</h3>
            
            <div className="checkbox-group">
              <p>Páginas incluidas (hasta 5):</p>
              <div className="checkbox-item">
                <input type="checkbox" id="home" name="pages" value="home" checked disabled />
                <label htmlFor="home">Inicio (obligatoria)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="about" 
                  name="pages" 
                  value="about"
                  checked={formData.pages.includes('about')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="about">Sobre Nosotros</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="services" 
                  name="pages" 
                  value="services"
                  checked={formData.pages.includes('services')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="services">Servicios/Habitaciones</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="contact" 
                  name="pages" 
                  value="contact"
                  checked={formData.pages.includes('contact')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="contact">Contacto</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="gallery" 
                  name="pages" 
                  value="gallery"
                  checked={formData.pages.includes('gallery')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="gallery">Galería</label>
              </div>
            </div>
            
            <label htmlFor="design">Estilo de diseño:</label>
            <select 
              id="design" 
              name="design" 
              value={formData.design}
              onChange={handleInputChange}
            >
              <option value="modern">Moderno</option>
              <option value="elegant">Elegante</option>
              <option value="minimalist">Minimalista</option>
            </select>
            
            <p>Colores principales (seleccione hasta 3):</p>
            <div className="color-options">
              <div 
                className={`color-option ${selectedColors.includes('red') ? 'selected' : ''}`} 
                style={{backgroundColor: '#e74c3c'}} 
                onClick={() => handleColorSelect('red')}
                title="Rojo"
              ></div>
              <div 
                className={`color-option ${selectedColors.includes('blue') ? 'selected' : ''}`} 
                style={{backgroundColor: '#3498db'}} 
                onClick={() => handleColorSelect('blue')}
                title="Azul"
              ></div>
              <div 
                className={`color-option ${selectedColors.includes('green') ? 'selected' : ''}`} 
                style={{backgroundColor: '#2ecc71'}} 
                onClick={() => handleColorSelect('green')}
                title="Verde"
              ></div>
              <div 
                className={`color-option ${selectedColors.includes('orange') ? 'selected' : ''}`} 
                style={{backgroundColor: '#f39c12'}} 
                onClick={() => handleColorSelect('orange')}
                title="Naranja"
              ></div>
              <div 
                className={`color-option ${selectedColors.includes('purple') ? 'selected' : ''}`} 
                style={{backgroundColor: '#9b59b6'}} 
                onClick={() => handleColorSelect('purple')}
                title="Morado"
              ></div>
              <div 
                className={`color-option ${selectedColors.includes('turquoise') ? 'selected' : ''}`} 
                style={{backgroundColor: '#1abc9c'}} 
                onClick={() => handleColorSelect('turquoise')}
                title="Turquesa"
              ></div>
              <div 
                className={`color-option ${selectedColors.includes('darkblue') ? 'selected' : ''}`} 
                style={{backgroundColor: '#34495e'}} 
                onClick={() => handleColorSelect('darkblue')}
                title="Azul Oscuro"
              ></div>
              <div 
                className={`color-option ${selectedColors.includes('white') ? 'selected' : ''}`} 
                style={{backgroundColor: '#ffffff', border: '1px solid #ddd'}} 
                onClick={() => handleColorSelect('white')}
                title="Blanco"
              ></div>
              <div 
                className={`color-option ${selectedColors.includes('black') ? 'selected' : ''}`} 
                style={{backgroundColor: '#000000'}} 
                onClick={() => handleColorSelect('black')}
                title="Negro"
              ></div>
            </div>
            <p className="color-selected">
              Colores seleccionados: {selectedColors.length > 0 ? selectedColors.join(', ') : 'Ninguno'}
            </p>
            
            <div className="checkbox-group">
              <p>Funcionalidades básicas:</p>
              <div className="checkbox-item">
                <input type="checkbox" id="responsive" name="features" value="responsive" checked disabled />
                <label htmlFor="responsive">Diseño responsive (adaptable a móviles)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="contact-form" 
                  name="features" 
                  value="contact-form"
                  checked={additionalFeatures.includes('contact-form')}
                  onChange={(e) => handleFeatureChange('contact-form', e.target.checked)}
                />
                <label htmlFor="contact-form">Formulario de contacto (+$500 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="images" 
                  name="features" 
                  value="optimized-images"
                  checked={additionalFeatures.includes('optimized-images')}
                  onChange={(e) => handleFeatureChange('optimized-images', e.target.checked)}
                />
                <label htmlFor="images">Optimización de imágenes (+$800 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="social" 
                  name="features" 
                  value="social-links"
                  checked={additionalFeatures.includes('social-links')}
                  onChange={(e) => handleFeatureChange('social-links', e.target.checked)}
                  />
                  <label htmlFor="social">Enlaces a redes sociales (+$600 MXN)</label>
                </div>
              </div>
              
              <label htmlFor="deadline">Plazo de entrega deseado (en semanas):</label>
              <select 
                id="deadline" 
                name="deadline" 
                value={formData.deadline}
                onChange={handleDeadlineChange}
              >
                <option value="2">2 semanas (urgente, +$2,500 MXN)</option>
                <option value="3">3 semanas</option>
                <option value="4">4 semanas</option>
              </select>
            </div>
            
            <div className="form-section">
              <h3>Requisitos Adicionales</h3>
              <label htmlFor="notes">Notas adicionales o requisitos específicos:</label>
              <textarea 
                id="notes" 
                name="notes" 
                rows="4"
                value={formData.notes}
                onChange={handleInputChange}
              ></textarea>
            </div>
            
            <div className="price-section">
              <h3>Presupuesto Estimado</h3>
              <div className="price">${price.toLocaleString()} MXN</div>
              <div className="price-note">* Precio base con opciones seleccionadas. El costo final puede variar según requerimientos específicos.</div>
              <p className="negotiation-note">Los precios son negociables al momento de tener contacto con nuestro equipo. ¡Envía tu cotización y conversaremos sobre las opciones!</p>
              
              <div className="comparison">
                <p>Comparativa con otros proveedores:</p>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Proveedor</th>
                      <th>Precio Promedio</th>
                      <th>Tiempo de Entrega</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Agencias locales</td>
                      <td>$15,000 - $18,000 MXN</td>
                      <td>4-6 semanas</td>
                    </tr>
                    <tr>
                      <td>Freelancers</td>
                      <td>$10,000 - $14,000 MXN</td>
                      <td>3-5 semanas</td>
                    </tr>
                    <tr>
                      <td>Nuestro servicio</td>
                      <td><strong>${price.toLocaleString()} MXN</strong></td>
                      <td><strong>4 semanas</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="benefits-section">
              <h3>Beneficios del Plan Básico</h3>
              <ul>
                <li>Ideal para moteles que recién comienzan su presencia digital</li>
                <li>Perfecta presentación de servicios/habitaciones básicos</li>
                <li>Diseño profesional a un precio accesible</li>
                <li>Posicionamiento inicial en buscadores</li>
              </ul>
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Solicitar Cotización Formal'}
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default BasicQuotation;