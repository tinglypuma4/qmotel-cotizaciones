import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './QuotationForm.css';

const AdvancedQuotation = () => {
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedAnimations, setSelectedAnimations] = useState([]);
  const [additionalFeatures, setAdditionalFeatures] = useState([]);
  const [price, setPrice] = useState(32000);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    pages: ['home', 'about', 'services', 'contact', 'gallery', 'faq', 'blog', 'location', 'booking'],
    design: 'modern',
    deadline: '8',
    notes: '',
    competitors: '',
    has_branding: 'partial'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // Función para actualizar precio basado en selecciones
  const updatePrice = (feature, isAdding) => {
    const priceAdjustments = {
      'payment-gateway': 3500,
      'user-accounts': 2800,
      'reviews': 1500,
      'api-integration': 3000,
      'custom-dashboard': 4000,
      'urgentDelivery': 5000,
      'animation-advanced': 1500,
      'animation-3d': 2500,
      'animation-interactive': 3000,
      'animation-fade': 0, // Ya incluido en precio base
      'animation-slide': 0, // Ya incluido en precio base
      'animation-parallax': 0 // Ya incluido en precio base
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
    const maxColors = 5;
    
    if (currentColors.includes(color)) {
      // Si ya está seleccionado, lo quitamos
      setSelectedColors(currentColors.filter(c => c !== color));
    } else if (currentColors.length < maxColors) {
      // Si no está seleccionado y no hemos alcanzado el máximo, lo añadimos
      setSelectedColors([...currentColors, color]);
    }
  };
  
  // Manejar selección de animaciones
  const handleAnimationSelect = (animation) => {
    const currentAnimations = [...selectedAnimations];
    const maxAnimations = 5;
    
    if (currentAnimations.includes(animation)) {
      // Quitar animación y ajustar precio
      setSelectedAnimations(currentAnimations.filter(a => a !== animation));
      updatePrice(`animation-${animation}`, false);
    } else if (currentAnimations.length < maxAnimations) {
      // Añadir animación y ajustar precio
      setSelectedAnimations([...currentAnimations, animation]);
      updatePrice(`animation-${animation}`, true);
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
        planType: 'advanced',
        selectedColors: selectedColors,
        selectedAnimations: selectedAnimations,
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
      setSelectedAnimations([]);
      setAdditionalFeatures([]);
      setPrice(32000);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        pages: ['home', 'about', 'services', 'contact', 'gallery', 'faq', 'blog', 'location', 'booking'],
        design: 'modern',
        deadline: '8',
        notes: '',
        competitors: '',
        has_branding: 'partial'
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
            <Link to="/cotizacion-basica" className="nav-link">Plan Básico</Link>
            <Link to="/cotizacion-intermedia" className="nav-link">Plan Intermedio</Link>
            <Link to="/cotizacion-avanzada" className="nav-link active">Plan Avanzado</Link>
          </nav>
        </div>
      </header>

      <div className="form-container active">
        <h2>Plan Avanzado - Solución Web Premium</h2>
        
        <div className="included-features">
          <h3>Incluido en todos los planes:</h3>
          <ul>
            <li>Optimización SEO para Google</li>
            <li>Soporte técnico especializado 24/7</li>
            <li>Alojamiento web independiente y seguro de alto rendimiento</li>
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

        <form id="advanced-plan-form" onSubmit={handleSubmit}>
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
            
            <label htmlFor="company">Empresa/Organización:</label>
            <input 
              type="text" 
              id="company" 
              name="company" 
              value={formData.company} 
              onChange={handleInputChange} 
              required 
            />
            
            <label htmlFor="position">Cargo/Posición:</label>
            <input 
              type="text" 
              id="position" 
              name="position" 
              value={formData.position} 
              onChange={handleInputChange} 
            />
          </div>

          <div className="form-section">
            <h3>Características del Sitio</h3>
            
            <div className="checkbox-group">
              <p>Páginas incluidas (ilimitadas, sugerimos):</p>
              <div className="checkbox-item">
                <input type="checkbox" id="home" name="pages" value="home" checked disabled />
                <label htmlFor="home">Inicio (obligatoria)</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="about" name="pages" value="about" checked disabled />
                <label htmlFor="about">Sobre Nosotros</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="services" name="pages" value="services" checked disabled />
                <label htmlFor="services">Servicios/Habitaciones</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="contact" name="pages" value="contact" checked disabled />
                <label htmlFor="contact">Contacto</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="gallery" name="pages" value="gallery" checked disabled />
                <label htmlFor="gallery">Galería</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="faq" name="pages" value="faq" checked disabled />
                <label htmlFor="faq">Preguntas Frecuentes</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="blog" 
                  name="pages" 
                  value="blog"
                  checked={formData.pages.includes('blog')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="blog">Blog/Noticias</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="location" 
                  name="pages" 
                  value="location"
                  checked={formData.pages.includes('location')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="location">Ubicación/Mapa</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="booking" 
                  name="pages" 
                  value="booking"
                  checked={formData.pages.includes('booking')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="booking">Reservas</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="testimonials" 
                  name="pages" 
                  value="testimonials"
                  checked={formData.pages.includes('testimonials')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="testimonials">Testimonios</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="partnerships" 
                  name="pages" 
                  value="partnerships"
                  checked={formData.pages.includes('partnerships')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="partnerships">Alianzas/Partners</label>
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
              <option value="luxury">Lujo</option>
              <option value="corporate">Corporativo</option>
              <option value="creative">Creativo</option>
              <option value="custom">Personalizado (diseño exclusivo)</option>
            </select>
            
            <p>Colores principales (seleccione hasta 5):</p>
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
              <div 
                className={`color-option ${selectedColors.includes('gold') ? 'selected' : ''}`} 
                style={{backgroundColor: '#FFD700'}} 
                onClick={() => handleColorSelect('gold')}
                title="Dorado"
              ></div>
              <div 
                className={`color-option ${selectedColors.includes('pink') ? 'selected' : ''}`} 
                style={{backgroundColor: '#FF69B4'}} 
                onClick={() => handleColorSelect('pink')}
                title="Rosa"
              ></div>
              <div 
                className={`color-option ${selectedColors.includes('silver') ? 'selected' : ''}`} 
                style={{backgroundColor: '#C0C0C0'}} 
                onClick={() => handleColorSelect('silver')}
                title="Plata"
              ></div>
            </div>
            <p className="color-selected">
              Colores seleccionados: {selectedColors.length > 0 ? selectedColors.join(', ') : 'Ninguno'}
            </p>
            
            <p>Animaciones (seleccione hasta 5):</p>
            <div className="animation-options">
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="animation-fade" 
                  name="animations" 
                  value="fade"
                  checked={selectedAnimations.includes('fade')}
                  onChange={(e) => handleAnimationSelect('fade')}
                />
                <label htmlFor="animation-fade">Fade In/Out</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="animation-slide" 
                  name="animations" 
                  value="slide"
                  checked={selectedAnimations.includes('slide')}
                  onChange={(e) => handleAnimationSelect('slide')}
                />
                <label htmlFor="animation-slide">Slide Effects</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="animation-parallax" 
                  name="animations" 
                  value="parallax"
                  checked={selectedAnimations.includes('parallax')}
                  onChange={(e) => handleAnimationSelect('parallax')}
                />
                <label htmlFor="animation-parallax">Parallax Scrolling</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="animation-advanced" 
                  name="animations" 
                  value="advanced"
                  checked={selectedAnimations.includes('advanced')}
                  onChange={(e) => handleAnimationSelect('advanced')}
                />
                <label htmlFor="animation-advanced">Animaciones avanzadas CSS3 (+$1,500 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="animation-3d" 
                  name="animations" 
                  value="3d"
                  checked={selectedAnimations.includes('3d')}
                  onChange={(e) => handleAnimationSelect('3d')}
                />
                <label htmlFor="animation-3d">Efectos 3D (+$2,500 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="animation-interactive" 
                  name="animations" 
                  value="interactive"
                  checked={selectedAnimations.includes('interactive')}
                  onChange={(e) => handleAnimationSelect('interactive')}
                />
                <label htmlFor="animation-interactive">Interacciones personalizadas (+$3,000 MXN)</label>
              </div>
            </div>
            
            <div className="checkbox-group">
              <p>Funcionalidades incluidas de planes anteriores:</p>
              <div className="checkbox-item">
                <input type="checkbox" checked disabled />
                <label>Todas las funcionalidades del plan básico</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" checked disabled />
                <label>Sistema básico de reservas</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" checked disabled />
                <label>Soporte multiidioma (Español/Inglés)</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" checked disabled />
                <label>Formularios personalizados</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" checked disabled />
                <label>Google Analytics avanzado</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" checked disabled />
                <label>Chat integrado para atención al cliente</label>
              </div>
            </div>
            
            <div className="checkbox-group">
              <p>Funcionalidades premium exclusivas:</p>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="payment" 
                  name="features" 
                  value="payment-gateway"
                  checked={additionalFeatures.includes('payment-gateway')}
                  onChange={(e) => handleFeatureChange('payment-gateway', e.target.checked)}
                />
                <label htmlFor="payment">Pasarela de pago integrada (+$3,500 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="accounts" 
                  name="features" 
                  value="user-accounts"
                  checked={additionalFeatures.includes('user-accounts')}
                  onChange={(e) => handleFeatureChange('user-accounts', e.target.checked)}
                />
                <label htmlFor="accounts">Sistema de cuentas de usuario (+$2,800 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="reviews" 
                  name="features" 
                  value="reviews"
                  checked={additionalFeatures.includes('reviews')}
                  onChange={(e) => handleFeatureChange('reviews', e.target.checked)}
                />
                <label htmlFor="reviews">Sistema de reseñas y calificaciones (+$1,500 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="api" 
                  name="features" 
                  value="api-integration"
                  checked={additionalFeatures.includes('api-integration')}
                  onChange={(e) => handleFeatureChange('api-integration', e.target.checked)}
                />
                <label htmlFor="api">Integración con APIs externas (OTAs, etc.) (+$3,000 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="dashboard" 
                  name="features" 
                  value="custom-dashboard"
                  checked={additionalFeatures.includes('custom-dashboard')}
                  onChange={(e) => handleFeatureChange('custom-dashboard', e.target.checked)}
                />
                <label htmlFor="dashboard">Panel de administración personalizado (+$4,000 MXN)</label>
              </div>
            </div>
            
            <label htmlFor="deadline">Plazo de entrega deseado (en semanas):</label>
            <select 
              id="deadline" 
              name="deadline" 
              value={formData.deadline}
              onChange={handleDeadlineChange}
            >
              <option value="2">2 semanas (urgente, +$5,000 MXN)</option>
              <option value="4">4 semanas</option>
              <option value="6">6 semanas</option>
              <option value="8">8 semanas</option>
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
            
            <label htmlFor="competitors">URLs de sitios web competidores que le gusten:</label>
            <textarea 
              id="competitors" 
              name="competitors" 
              rows="3" 
              placeholder="Ingrese URLs separadas por comas"
              value={formData.competitors}
              onChange={handleInputChange}
            ></textarea>
            
            <label htmlFor="has_branding">¿Dispone de manual de marca, logotipos y otros elementos gráficos?</label>
            <select 
              id="has_branding" 
              name="has_branding"
              value={formData.has_branding}
              onChange={handleInputChange}
            >
              <option value="yes">Sí, tenemos material de marca completo</option>
              <option value="partial">Parcialmente, tenemos algunos elementos</option>
              <option value="no">No, necesitaremos ayuda con estos elementos</option>
            </select>
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
                    <td>Agencias premium</td>
                    <td>$45,000 - $60,000 MXN</td>
                    <td>10-12 semanas</td>
                  </tr>
                  <tr>
                    <td>Consultoras digitales</td>
                    <td>$35,000 - $50,000 MXN</td>
                    <td>8-10 semanas</td>
                  </tr>
                  <tr>
                    <td>Nuestro servicio</td>
                    <td><strong>${price.toLocaleString()} MXN</strong></td>
                    <td><strong>8 semanas</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="benefits-section">
            <h3>Beneficios del Plan Avanzado</h3>
            <ul>
              <li>Solución completa para moteles que buscan destacar en el mercado digital</li>
              <li>Sistema completo de reservas y pagos en línea</li>
              <li>Experiencia de usuario premium y totalmente personalizada</li>
              <li>Integración con plataformas externas (OTAs, CRS, etc.)</li>
              <li>Posicionamiento SEO avanzado y estrategia digital completa</li>
              <li>Análisis detallado de comportamiento de usuarios</li>
              <li>Soporte prioritario 24/7</li>
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

export default AdvancedQuotation;