import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './QuotationForm.css';

const IntermediateQuotation = () => {
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedAnimations, setSelectedAnimations] = useState([]);
  const [additionalFeatures, setAdditionalFeatures] = useState([]);
  const [price, setPrice] = useState(19000);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    pages: ['home', 'about', 'services', 'contact', 'gallery'],
    design: 'modern',
    deadline: '5',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // Función para actualizar precio basado en selecciones
  const updatePrice = (feature, isAdding) => {
    const priceAdjustments = {
      'booking-system': 2500,
      'multi-language': 1800,
      'custom-forms': 1200,
      'analytics': 1000,
      'chat': 1500,
      'urgentDelivery': 3500,
      'animation-fade': 500,
      'animation-slide': 700,
      'animation-parallax': 1200
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
    const maxColors = 4;
    
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
    const maxAnimations = 3;
    
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
        planType: 'intermediate',
        selectedColors: selectedColors,
        selectedAnimations: selectedAnimations,
        additionalFeatures: additionalFeatures,
        estimatedPrice: price,
        finalPrice: price, // Añadimos el precio final igual al estimado inicialmente
        submissionDate: new Date(),
        status: 'pending'
      };
      
      // Enviar los datos al backend usando fetch en lugar de axios
      const response = await fetch('http://localhost:5000/api/quotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quotationData),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      setSubmitStatus({
        success: true,
        message: 'Cotización enviada correctamente. Nos pondremos en contacto pronto para negociar los detalles.',
        quotationId: data._id
      });
      
      // Resetear el formulario
      setSelectedColors([]);
      setSelectedAnimations([]);
      setAdditionalFeatures([]);
      setPrice(19000);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        pages: ['home', 'about', 'services', 'contact', 'gallery'],
        design: 'modern',
        deadline: '5',
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
            <Link to="/cotizacion-basica" className="nav-link">Plan Básico</Link>
            <Link to="/cotizacion-intermedia" className="nav-link active">Plan Intermedio</Link>
            <Link to="/cotizacion-avanzada" className="nav-link">Plan Avanzado</Link>
          </nav>
        </div>
      </header>

      <div className="form-container active">
        <h2>Plan Intermedio - Página Web Profesional</h2>
        
        <div className="included-features">
          <h3>Incluido en todos los planes:</h3>
          <ul>
            <li>Optimización SEO para Google</li>
            <li>Soporte técnico especializado (12 horas, L-V)</li>
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

        <form id="intermediate-plan-form" onSubmit={handleSubmit}>
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
            />
          </div>

          <div className="form-section">
            <h3>Características del Sitio</h3>
            
            <div className="checkbox-group">
              <p>Páginas incluidas (hasta 8):</p>
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
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="faq" 
                  name="pages" 
                  value="faq"
                  checked={formData.pages.includes('faq')}
                  onChange={handleCheckboxChange}
                />
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
            </select>
            
            <p>Colores principales (seleccione hasta 4):</p>
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
                style={{backgroundColor: '#9b59b6'}}onClick={() => handleColorSelect('purple')}
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
            </div>
            <p className="color-selected">
              Colores seleccionados: {selectedColors.length > 0 ? selectedColors.join(', ') : 'Ninguno'}
            </p>
            
            <p>Efectos visuales (seleccione hasta 3):</p>
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
                <label htmlFor="animation-fade">Elementos que aparecen suavemente al navegar (+$500 MXN)</label>
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
                <label htmlFor="animation-slide">Elementos que se deslizan al hacer scroll (+$700 MXN)</label>
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
                <label htmlFor="animation-parallax">Efecto de profundidad en imágenes al desplazarse (+$1,200 MXN)</label>
              </div>
            </div>
            
            <div className="checkbox-group">
              <p>Funcionalidades incluidas del plan básico:</p>
              <div className="checkbox-item">
                <input type="checkbox" checked disabled />
                <label>Diseño adaptable a todos los dispositivos (móviles, tablets, computadoras)</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" checked disabled />
                <label>Formulario de contacto</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" checked disabled />
                <label>Optimización de imágenes</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" checked disabled />
                <label>Enlaces a redes sociales</label>
              </div>
            </div>
            
            <div className="checkbox-group">
              <p>Funcionalidades adicionales para nivel intermedio:</p>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="booking" 
                  name="features" 
                  value="booking-system"
                  checked={additionalFeatures.includes('booking-system')}
                  onChange={(e) => handleFeatureChange('booking-system', e.target.checked)}
                />
                <label htmlFor="booking">Sistema sencillo para reservar habitaciones online (+$2,500 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="multilanguage" 
                  name="features" 
                  value="multi-language"
                  checked={additionalFeatures.includes('multi-language')}
                  onChange={(e) => handleFeatureChange('multi-language', e.target.checked)}
                />
                <label htmlFor="multilanguage">Sitio web en dos idiomas (Español/Inglés) (+$1,800 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="custom-forms" 
                  name="features" 
                  value="custom-forms"
                  checked={additionalFeatures.includes('custom-forms')}
                  onChange={(e) => handleFeatureChange('custom-forms', e.target.checked)}
                />
                <label htmlFor="custom-forms">Formularios personalizados para solicitudes especiales (+$1,200 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="analytics" 
                  name="features" 
                  value="analytics"
                  checked={additionalFeatures.includes('analytics')}
                  onChange={(e) => handleFeatureChange('analytics', e.target.checked)}
                />
                <label htmlFor="analytics">Estadísticas de visitantes y su comportamiento (+$1,000 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="chat" 
                  name="features" 
                  value="chat"
                  checked={additionalFeatures.includes('chat')}
                  onChange={(e) => handleFeatureChange('chat', e.target.checked)}
                />
                <label htmlFor="chat">Chat en vivo para atender a clientes inmediatamente (+$1,500 MXN)</label>
              </div>
            </div>
            
            <label htmlFor="deadline">Plazo de entrega deseado (en semanas):</label>
            <select 
              id="deadline" 
              name="deadline" 
              value={formData.deadline}
              onChange={handleDeadlineChange}
            >
              <option value="2">2 semanas (urgente, +$3,500 MXN)</option>
              <option value="3">3 semanas</option>
              <option value="5">5 semanas</option>
              <option value="6">6 semanas</option>
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
                    <td>$22,000 - $28,000 MXN</td>
                    <td>6-8 semanas</td>
                  </tr>
                  <tr>
                    <td>Freelancers especializados</td>
                    <td>$18,000 - $24,000 MXN</td>
                    <td>5-7 semanas</td>
                  </tr>
                  <tr>
                    <td>Nuestro servicio</td>
                    <td><strong>${price.toLocaleString()} MXN</strong></td>
                    <td><strong>5 semanas</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="benefits-section">
            <h3>Beneficios del Plan Intermedio</h3>
            <ul>
              <li>Perfecto para moteles con necesidades profesionales de presencia online</li>
              <li>Mayor interactividad con los usuarios</li>
              <li>Capacidad para gestionar reservas y consultas</li>
              <li>Diseño más personalizado y atractivo</li>
              <li>Soporte mejorado y mayor visibilidad en buscadores</li>
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

export default IntermediateQuotation;