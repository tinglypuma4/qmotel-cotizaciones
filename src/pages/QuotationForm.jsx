import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './QuotationForm.css';

const QuotationForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedColors, setSelectedColors] = useState({
    basic: [],
    intermediate: [],
    advanced: []
  });
  
  // Estado para rastrear animaciones seleccionadas
  const [selectedAnimations, setSelectedAnimations] = useState({
    intermediate: [],
    advanced: []
  });
  
  // Estado para rastrear funcionalidades adicionales
  const [additionalFeatures, setAdditionalFeatures] = useState({
    basic: [],
    intermediate: [],
    advanced: []
  });
  
  // Estados para precios dinámicos
  const [prices, setPrices] = useState({
    basic: 12000,
    intermediate: 19000,
    advanced: 32000
  });

  // Estado para el formulario específico de cada plan
  const [formData, setFormData] = useState({
    basic: {
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      pages: ['home'],
      design: 'modern',
      deadline: '4',
      notes: ''
    },
    intermediate: {
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      pages: ['home', 'about', 'services', 'contact', 'gallery'],
      design: 'modern',
      deadline: '5',
      notes: ''
    },
    advanced: {
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
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // Función para actualizar precios basado en selecciones
  const updatePrice = (plan, feature, isAdding) => {
    const priceAdjustments = {
      basic: {
        'contact-form': 500,
        'optimized-images': 800,
        'social-links': 600,
        'urgentDelivery': 2500
      },
      intermediate: {
        'booking-system': 2500,
        'multi-language': 1800,
        'custom-forms': 1200,
        'analytics': 1000,
        'chat': 1500,
        'urgentDelivery': 3500,
        'animation-fade': 500,
        'animation-slide': 700,
        'animation-parallax': 1200
      },
      advanced: {
        'payment-gateway': 3500,
        'user-accounts': 2800,
        'reviews': 1500,
        'api-integration': 3000,
        'custom-dashboard': 4000,
        'urgentDelivery': 5000,
        'animation-advanced': 1500,
        'animation-3d': 2500,
        'animation-interactive': 3000
      }
    };
    
    const adjustment = priceAdjustments[plan][feature] || 0;
    
    setPrices(prev => ({
      ...prev,
      [plan]: isAdding ? prev[plan] + adjustment : prev[plan] - adjustment
    }));
  };

  const handleInputChange = (plan, e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [plan]: {
        ...formData[plan],
        [name]: value
      }
    });
  };
  
  const handleCheckboxChange = (plan, e) => {
    const { name, value, checked } = e.target;
    
    if (name === 'pages') {
      let updatedPages = [...formData[plan].pages];
      
      if (checked) {
        updatedPages.push(value);
      } else {
        updatedPages = updatedPages.filter(page => page !== value);
      }
      
      setFormData({
        ...formData,
        [plan]: {
          ...formData[plan],
          pages: updatedPages
        }
      });
    }
  };

  const handleColorSelect = (plan, color) => {
    const currentColors = [...selectedColors[plan]];
    const maxColors = plan === 'advanced' ? 5 : plan === 'intermediate' ? 4 : 3;
    
    if (currentColors.includes(color)) {
      // Si ya está seleccionado, lo quitamos
      setSelectedColors({
        ...selectedColors,
        [plan]: currentColors.filter(c => c !== color)
      });
    } else if (currentColors.length < maxColors) {
      // Si no está seleccionado y no hemos alcanzado el máximo, lo añadimos
      setSelectedColors({
        ...selectedColors,
        [plan]: [...currentColors, color]
      });
    }
  };
  
  // Manejar selección de animaciones
  const handleAnimationSelect = (plan, animation) => {
    const currentAnimations = [...selectedAnimations[plan]];
    const maxAnimations = plan === 'advanced' ? 5 : 3;
    
    if (currentAnimations.includes(animation)) {
      // Quitar animación y ajustar precio
      setSelectedAnimations({
        ...selectedAnimations,
        [plan]: currentAnimations.filter(a => a !== animation)
      });
      updatePrice(plan, `animation-${animation}`, false);
    } else if (currentAnimations.length < maxAnimations) {
      // Añadir animación y ajustar precio
      setSelectedAnimations({
        ...selectedAnimations,
        [plan]: [...currentAnimations, animation]
      });
      updatePrice(plan, `animation-${animation}`, true);
    }
  };
  
  // Manejar cambio en características adicionales
  const handleFeatureChange = (plan, feature, isChecked) => {
    const currentFeatures = [...additionalFeatures[plan]];
    
    if (isChecked) {
      setAdditionalFeatures({
        ...additionalFeatures,
        [plan]: [...currentFeatures, feature]
      });
      updatePrice(plan, feature, true);
    } else {
      setAdditionalFeatures({
        ...additionalFeatures,
        [plan]: currentFeatures.filter(f => f !== feature)
      });
      updatePrice(plan, feature, false);
    }
  };
  
  // Manejar cambio en plazo de entrega
  const handleDeadlineChange = (plan, e) => {
    const value = e.target.value;
    
    // Actualizar el formData con el nuevo plazo
    setFormData({
      ...formData,
      [plan]: {
        ...formData[plan],
        deadline: value
      }
    });
    
    // Si selecciona entrega urgente (2 semanas)
    if (value === "2") {
      if (!additionalFeatures[plan].includes('urgentDelivery')) {
        setAdditionalFeatures({
          ...additionalFeatures,
          [plan]: [...additionalFeatures[plan], 'urgentDelivery']
        });
        updatePrice(plan, 'urgentDelivery', true);
      }
    } else {
      // Si cambia de urgente a normal
      if (additionalFeatures[plan].includes('urgentDelivery')) {
        setAdditionalFeatures({
          ...additionalFeatures,
          [plan]: additionalFeatures[plan].filter(f => f !== 'urgentDelivery')
        });
        updatePrice(plan, 'urgentDelivery', false);
      }
    }
  };

  const handleSubmit = async (e, plan) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Preparar los datos para enviar al backend
      const quotationData = {
        ...formData[plan],
        planType: plan,
        selectedColors: selectedColors[plan],
        additionalFeatures: additionalFeatures[plan],
        estimatedPrice: prices[plan],
        submissionDate: new Date(),
        status: 'pending'
      };
      
      // Añadir animaciones si aplica
      if (plan !== 'basic') {
        quotationData.selectedAnimations = selectedAnimations[plan];
      }
      
      // Enviar los datos al backend
      const response = await axios.post('http://localhost:5000/api/quotations', quotationData);
      
      setSubmitStatus({
        success: true,
        message: 'Cotización enviada correctamente. Nos pondremos en contacto pronto para negociar los detalles.',
        quotationId: response.data._id
      });
      
      // Resetear el formulario específico después del envío exitoso
      const resetColors = { ...selectedColors };
      resetColors[plan] = [];
      
      const resetAnimations = { ...selectedAnimations };
      if (plan !== 'basic') {
        resetAnimations[plan] = [];
      }
      
      const resetFeatures = { ...additionalFeatures };
      resetFeatures[plan] = [];
      
      // Resetear los estados
      setSelectedColors(resetColors);
      setSelectedAnimations(resetAnimations);
      setAdditionalFeatures(resetFeatures);
      
      // Resetear los precios a su valor base
      const basePrices = {
        basic: 12000,
        intermediate: 19000,
        advanced: 32000
      };
      
      setPrices({
        ...prices,
        [plan]: basePrices[plan]
      });
      
      // Resetear el formulario
      const initialFormData = {
        basic: {
          name: '',
          email: '',
          phone: '',
          company: '',
          position: '',
          pages: ['home'],
          design: 'modern',
          deadline: '4',
          notes: ''
        },
        intermediate: {
          name: '',
          email: '',
          phone: '',
          company: '',
          position: '',
          pages: ['home', 'about', 'services', 'contact', 'gallery'],
          design: 'modern',
          deadline: '5',
          notes: ''
        },
        advanced: {
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
        }
      };
      
      setFormData({
        ...formData,
        [plan]: initialFormData[plan]
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
          <Link to="/" className="logo">Qmotel</Link>
          <nav className="navigation">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/cotizacion-basica" className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>Plan Básico</Link>
            <Link to="/cotizacion-intermedia" className={`nav-link ${activeTab === 'intermediate' ? 'active' : ''}`} onClick={() => setActiveTab('intermediate')}>Plan Intermedio</Link>
            <Link to="/cotizacion-avanzada" className={`nav-link ${activeTab === 'advanced' ? 'active' : ''}`} onClick={() => setActiveTab('advanced')}>Plan Avanzado</Link>
          </nav>
        </div>
      </header>

      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'basic' ? 'active' : ''}`} 
          onClick={() => setActiveTab('basic')}
        >
          Plan Básico
        </div>
        <div 
          className={`tab ${activeTab === 'intermediate' ? 'active' : ''}`} 
          onClick={() => setActiveTab('intermediate')}
        >
          Plan Intermedio
        </div>
        <div 
          className={`tab ${activeTab === 'advanced' ? 'active' : ''}`} 
          onClick={() => setActiveTab('advanced')}
        >
          Plan Avanzado
        </div>
      </div>

      {/* FORMULARIO PLAN BÁSICO */}
      <div className={`form-container ${activeTab === 'basic' ? 'active' : ''}`}>
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

        <form id="basic-plan-form" onSubmit={(e) => handleSubmit(e, 'basic')}>
          <div className="form-section">
            <h3>Información de Contacto</h3>
            <label htmlFor="basic-name">Nombre completo:</label>
            <input 
              type="text" 
              id="basic-name" 
              name="name" 
              value={formData.basic.name} 
              onChange={(e) => handleInputChange('basic', e)} 
              required 
            />
            
            <label htmlFor="basic-email">Correo electrónico:</label>
            <input 
              type="email" 
              id="basic-email" 
              name="email" 
              value={formData.basic.email} 
              onChange={(e) => handleInputChange('basic', e)} 
              required 
            />
            <label htmlFor="basic-phone">Teléfono:</label>
            <input 
              type="tel" 
              id="basic-phone" 
              name="phone" 
              value={formData.basic.phone} 
              onChange={(e) => handleInputChange('basic', e)} 
              required 
            />
          </div>

          <div className="form-section">
            <h3>Características del Sitio</h3>
            
            <div className="checkbox-group">
              <p>Páginas incluidas (hasta 5):</p>
              <div className="checkbox-item">
                <input type="checkbox" id="basic-home" name="pages" value="home" checked disabled />
                <label htmlFor="basic-home">Inicio (obligatoria)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="basic-about" 
                  name="pages" 
                  value="about"
                  checked={formData.basic.pages.includes('about')}
                  onChange={(e) => handleCheckboxChange('basic', e)}
                />
                <label htmlFor="basic-about">Sobre Nosotros</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="basic-services" 
                  name="pages" 
                  value="services"
                  checked={formData.basic.pages.includes('services')}
                  onChange={(e) => handleCheckboxChange('basic', e)}
                />
                <label htmlFor="basic-services">Servicios/Habitaciones</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="basic-contact" 
                  name="pages" 
                  value="contact"
                  checked={formData.basic.pages.includes('contact')}
                  onChange={(e) => handleCheckboxChange('basic', e)}
                />
                <label htmlFor="basic-contact">Contacto</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="basic-gallery" 
                  name="pages" 
                  value="gallery"
                  checked={formData.basic.pages.includes('gallery')}
                  onChange={(e) => handleCheckboxChange('basic', e)}
                />
                <label htmlFor="basic-gallery">Galería</label>
              </div>
            </div>
            
            <label htmlFor="basic-design">Estilo de diseño:</label>
            <select 
              id="basic-design" 
              name="design" 
              value={formData.basic.design}
              onChange={(e) => handleInputChange('basic', e)}
            >
              <option value="modern">Moderno</option>
              <option value="elegant">Elegante</option>
              <option value="minimalist">Minimalista</option>
            </select>
            
            <p>Colores principales (seleccione hasta 3):</p>
            <div className="color-options">
              <div 
                className={`color-option ${selectedColors.basic.includes('red') ? 'selected' : ''}`} 
                style={{backgroundColor: '#e74c3c'}} 
                onClick={() => handleColorSelect('basic', 'red')}
                title="Rojo"
              ></div>
              <div 
                className={`color-option ${selectedColors.basic.includes('blue') ? 'selected' : ''}`} 
                style={{backgroundColor: '#3498db'}} 
                onClick={() => handleColorSelect('basic', 'blue')}
                title="Azul"
              ></div>
              <div 
                className={`color-option ${selectedColors.basic.includes('green') ? 'selected' : ''}`} 
                style={{backgroundColor: '#2ecc71'}} 
                onClick={() => handleColorSelect('basic', 'green')}
                title="Verde"
              ></div>
              <div 
                className={`color-option ${selectedColors.basic.includes('orange') ? 'selected' : ''}`} 
                style={{backgroundColor: '#f39c12'}} 
                onClick={() => handleColorSelect('basic', 'orange')}
                title="Naranja"
              ></div>
              <div 
                className={`color-option ${selectedColors.basic.includes('purple') ? 'selected' : ''}`} 
                style={{backgroundColor: '#9b59b6'}} 
                onClick={() => handleColorSelect('basic', 'purple')}
                title="Morado"
              ></div>
              <div 
                className={`color-option ${selectedColors.basic.includes('turquoise') ? 'selected' : ''}`} 
                style={{backgroundColor: '#1abc9c'}} 
                onClick={() => handleColorSelect('basic', 'turquoise')}
                title="Turquesa"
              ></div>
              <div 
                className={`color-option ${selectedColors.basic.includes('darkblue') ? 'selected' : ''}`} 
                style={{backgroundColor: '#34495e'}} 
                onClick={() => handleColorSelect('basic', 'darkblue')}
                title="Azul Oscuro"
              ></div>
              <div 
                className={`color-option ${selectedColors.basic.includes('white') ? 'selected' : ''}`} 
                style={{backgroundColor: '#ffffff', border: '1px solid #ddd'}} 
                onClick={() => handleColorSelect('basic', 'white')}
                title="Blanco"
              ></div>
              <div 
                className={`color-option ${selectedColors.basic.includes('black') ? 'selected' : ''}`} 
                style={{backgroundColor: '#000000'}} 
                onClick={() => handleColorSelect('basic', 'black')}
                title="Negro"
              ></div>
            </div>
            <p className="color-selected">
              Colores seleccionados: {selectedColors.basic.length > 0 ? selectedColors.basic.join(', ') : 'Ninguno'}
            </p>
            
            <div className="checkbox-group">
              <p>Funcionalidades básicas:</p>
              <div className="checkbox-item">
                <input type="checkbox" id="basic-responsive" name="features" value="responsive" checked disabled />
                <label htmlFor="basic-responsive">Diseño responsive (adaptable a móviles)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="basic-contact-form" 
                  name="features" 
                  value="contact-form"
                  checked={additionalFeatures.basic.includes('contact-form')}
                  onChange={(e) => handleFeatureChange('basic', 'contact-form', e.target.checked)}
                />
                <label htmlFor="basic-contact-form">Formulario de contacto (+$500 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="basic-images" 
                  name="features" 
                  value="optimized-images"
                  checked={additionalFeatures.basic.includes('optimized-images')}
                  onChange={(e) => handleFeatureChange('basic', 'optimized-images', e.target.checked)}
                />
                <label htmlFor="basic-images">Optimización de imágenes (+$800 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="basic-social" 
                  name="features" 
                  value="social-links"
                  checked={additionalFeatures.basic.includes('social-links')}
                  onChange={(e) => handleFeatureChange('basic', 'social-links', e.target.checked)}
                />
                <label htmlFor="basic-social">Enlaces a redes sociales (+$600 MXN)</label>
              </div>
            </div>
            
            <label htmlFor="basic-deadline">Plazo de entrega deseado (en semanas):</label>
            <select 
              id="basic-deadline" 
              name="deadline" 
              value={formData.basic.deadline}
              onChange={(e) => handleDeadlineChange('basic', e)}
            >
              <option value="2">2 semanas (urgente, +$2,500 MXN)</option>
              <option value="3">3 semanas</option>
              <option value="4">4 semanas</option>
            </select>
          </div>
          
          <div className="form-section">
            <h3>Requisitos Adicionales</h3>
            <label htmlFor="basic-notes">Notas adicionales o requisitos específicos:</label>
            <textarea 
              id="basic-notes" 
              name="notes" 
              rows="4"
              value={formData.basic.notes}
              onChange={(e) => handleInputChange('basic', e)}
            ></textarea>
          </div>
          
          <div className="price-section">
            <h3>Presupuesto Estimado</h3>
            <div className="price">${prices.basic.toLocaleString()} MXN</div>
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
                    <td><strong>${prices.basic.toLocaleString()} MXN</strong></td>
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

      {/* FORMULARIO PLAN INTERMEDIO */}
      <div className={`form-container ${activeTab === 'intermediate' ? 'active' : ''}`}>
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

        <form id="intermediate-plan-form" onSubmit={(e) => handleSubmit(e, 'intermediate')}>
          <div className="form-section">
            <h3>Información de Contacto</h3>
            <label htmlFor="intermediate-name">Nombre completo:</label>
            <input 
              type="text" 
              id="intermediate-name" 
              name="name" 
              value={formData.intermediate.name} 
              onChange={(e) => handleInputChange('intermediate', e)} 
              required 
            />
            
            <label htmlFor="intermediate-email">Correo electrónico:</label>
            <input 
              type="email" 
              id="intermediate-email" 
              name="email" 
              value={formData.intermediate.email} 
              onChange={(e) => handleInputChange('intermediate', e)} 
              required 
            />
            
            <label htmlFor="intermediate-phone">Teléfono:</label>
            <input 
              type="tel" 
              id="intermediate-phone" 
              name="phone" 
              value={formData.intermediate.phone} 
              onChange={(e) => handleInputChange('intermediate', e)} 
              required 
            />
            
            <label htmlFor="intermediate-company">Empresa/Organización:</label>
            <input 
              type="text" 
              id="intermediate-company" 
              name="company" 
              value={formData.intermediate.company} 
              onChange={(e) => handleInputChange('intermediate', e)} 
            />
          </div>

          <div className="form-section">
            <h3>Características del Sitio</h3>
            
            <div className="checkbox-group">
              <p>Páginas incluidas (hasta 8):</p>
              <div className="checkbox-item">
                <input type="checkbox" id="intermediate-home" name="pages" value="home" checked disabled />
                <label htmlFor="intermediate-home">Inicio (obligatoria)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="intermediate-about" 
                  name="pages" 
                  value="about"
                  checked={formData.intermediate.pages.includes('about')}
                  onChange={(e) => handleCheckboxChange('intermediate', e)}
                />
                <label htmlFor="intermediate-about">Sobre Nosotros</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="intermediate-services" 
                  name="pages" 
                  value="services"
                  checked={formData.intermediate.pages.includes('services')}
                  onChange={(e) => handleCheckboxChange('intermediate', e)}
                />
                <label htmlFor="intermediate-services">Servicios/Habitaciones</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="intermediate-contact" 
                  name="pages" 
                  value="contact"
                  checked={formData.intermediate.pages.includes('contact')}
                  onChange={(e) => handleCheckboxChange('intermediate', e)}
                />
                <label htmlFor="intermediate-contact">Contacto</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="intermediate-gallery" 
                  name="pages" 
                  value="gallery"
                  checked={formData.intermediate.pages.includes('gallery')}
                  onChange={(e) => handleCheckboxChange('intermediate', e)}
                />
                <label htmlFor="intermediate-gallery">Galería</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="intermediate-faq" 
                  name="pages" 
                  value="faq"
                  checked={formData.intermediate.pages.includes('faq')}
                  onChange={(e) => handleCheckboxChange('intermediate', e)}
                />
                <label htmlFor="intermediate-faq">Preguntas Frecuentes</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="intermediate-blog" 
                  name="pages" 
                  value="blog"
                  checked={formData.intermediate.pages.includes('blog')}
                  onChange={(e) => handleCheckboxChange('intermediate', e)}
                />
                <label htmlFor="intermediate-blog">Blog/Noticias</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="intermediate-location" 
                  name="pages" 
                  value="location"
                  checked={formData.intermediate.pages.includes('location')}
                  onChange={(e) => handleCheckboxChange('intermediate', e)}
                />
                <label htmlFor="intermediate-location">Ubicación/Mapa</label>
              </div>
            </div>
            
            <label htmlFor="intermediate-design">Estilo de diseño:</label>
            <select 
              id="intermediate-design" 
              name="design" 
              value={formData.intermediate.design}
              onChange={(e) => handleInputChange('intermediate', e)}
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
                className={`color-option ${selectedColors.intermediate.includes('red') ? 'selected' : ''}`} 
                style={{backgroundColor: '#e74c3c'}} 
                onClick={() => handleColorSelect('intermediate', 'red')}
                title="Rojo"
              ></div>
              <div 
                className={`color-option ${selectedColors.intermediate.includes('blue') ? 'selected' : ''}`} 
                style={{backgroundColor: '#3498db'}} 
                onClick={() => handleColorSelect('intermediate', 'blue')}
                title="Azul"
              ></div>
              <div 
                className={`color-option ${selectedColors.intermediate.includes('green') ? 'selected' : ''}`} 
                style={{backgroundColor: '#2ecc71'}} 
                onClick={() => handleColorSelect('intermediate', 'green')}
                title="Verde"
              ></div>
              <div 
                className={`color-option ${selectedColors.intermediate.includes('orange') ? 'selected' : ''}`} 
                style={{backgroundColor: '#f39c12'}} 
                onClick={() => handleColorSelect('intermediate', 'orange')}
                title="Naranja"
              ></div>
              <div 
                className={`color-option ${selectedColors.intermediate.includes('purple') ? 'selected' : ''}`} 
                style={{backgroundColor: '#9b59b6'}} 
                onClick={() => handleColorSelect('intermediate', 'purple')}
                title="Morado"
              ></div>
              <div 
                className={`color-option ${selectedColors.intermediate.includes('turquoise') ? 'selected' : ''}`} 
                style={{backgroundColor: '#1abc9c'}} 
                onClick={() => handleColorSelect('intermediate', 'turquoise')}
                title="Turquesa"
              ></div>
              <div 
                className={`color-option ${selectedColors.intermediate.includes('darkblue') ? 'selected' : ''}`} 
                style={{backgroundColor: '#34495e'}} 
                onClick={() => handleColorSelect('intermediate', 'darkblue')}
                title="Azul Oscuro"
              ></div>
              <div 
                className={`color-option ${selectedColors.intermediate.includes('white') ? 'selected' : ''}`} 
                style={{backgroundColor: '#ffffff', border: '1px solid #ddd'}} 
                onClick={() => handleColorSelect('intermediate', 'white')}
                title="Blanco"
              ></div>
              <div 
                className={`color-option ${selectedColors.intermediate.includes('black') ? 'selected' : ''}`} 
                style={{backgroundColor: '#000000'}} 
                onClick={() => handleColorSelect('intermediate', 'black')}
                title="Negro"
              ></div>
              <div 
                className={`color-option ${selectedColors.intermediate.includes('gold') ? 'selected' : ''}`} 
                style={{backgroundColor: '#FFD700'}} 
                onClick={() => handleColorSelect('intermediate', 'gold')}
                title="Dorado"
              ></div>
              <div 
                className={`color-option ${selectedColors.intermediate.includes('pink') ? 'selected' : ''}`} 
                style={{backgroundColor: '#FF69B4'}} 
                onClick={() => handleColorSelect('intermediate', 'pink')}
                title="Rosa"
              ></div>
            </div>
            <p className="color-selected">
              Colores seleccionados: {selectedColors.intermediate.length > 0 ? selectedColors.intermediate.join(', ') : 'Ninguno'}
            </p>
            
            <p>Animaciones (seleccione hasta 3):</p>
            <div className="animation-options">
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="intermediate-animation-fade" 
                  name="animations" 
                  value="fade"
                  checked={selectedAnimations.intermediate.includes('fade')}
                  onChange={(e) => handleAnimationSelect('intermediate', 'fade')}
                />
                <label htmlFor="intermediate-animation-fade">Fade In/Out (+$500 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="intermediate-animation-slide" 
                  name="animations" 
                  value="slide"
                  checked={selectedAnimations.intermediate.includes('slide')}
                  onChange={(e) => handleAnimationSelect('intermediate', 'slide')}
                />
                <label htmlFor="intermediate-animation-slide">Slide Effects (+$700 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="intermediate-animation-parallax" 
                  name="animations" 
                  value="parallax"
                  checked={selectedAnimations.intermediate.includes('parallax')}
                  onChange={(e) => handleAnimationSelect('intermediate', 'parallax')}
                />
                <label htmlFor="intermediate-animation-parallax">Parallax Scrolling (+$1,200 MXN)</label>
              </div>
            </div>
            
            <div className="checkbox-group">
              <p>Funcionalidades incluidas del plan básico:</p>
              <div className="checkbox-item">
                <input type="checkbox" checked disabled />
                <label>Diseño responsive (adaptable a móviles)</label>
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
                  id="intermediate-booking" 
                  name="features" 
                  value="booking-system"
                  checked={additionalFeatures.intermediate.includes('booking-system')}
                  onChange={(e) => handleFeatureChange('intermediate', 'booking-system', e.target.checked)}
                />
                <label htmlFor="intermediate-booking">Sistema básico de reservas (+$2,500 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="intermediate-multilanguage" 
                  name="features" 
                  value="multi-language"
                  checked={additionalFeatures.intermediate.includes('multi-language')}
                  onChange={(e) => handleFeatureChange('intermediate', 'multi-language', e.target.checked)}
                />
                <label htmlFor="intermediate-multilanguage">Soporte multiidioma (Español/Inglés) (+$1,800 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="intermediate-custom-forms" 
                  name="features" 
                  value="custom-forms"
                  checked={additionalFeatures.intermediate.includes('custom-forms')}
                  onChange={(e) => handleFeatureChange('intermediate', 'custom-forms', e.target.checked)}
                />
                <label htmlFor="intermediate-custom-forms">Formularios personalizados (+$1,200 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="intermediate-analytics" 
                  name="features" 
                  value="analytics"
                  checked={additionalFeatures.intermediate.includes('analytics')}
                  onChange={(e) => handleFeatureChange('intermediate', 'analytics', e.target.checked)}
                />
                <label htmlFor="intermediate-analytics">Google Analytics avanzado (+$1,000 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="intermediate-chat" 
                  name="features" 
                  value="chat"
                  checked={additionalFeatures.intermediate.includes('chat')}
                  onChange={(e) => handleFeatureChange('intermediate', 'chat', e.target.checked)}
                />
                <label htmlFor="intermediate-chat">Chat integrado para atención al cliente (+$1,500 MXN)</label>
              </div>
            </div>
            
            <label htmlFor="intermediate-deadline">Plazo de entrega deseado (en semanas):</label>
            <select 
              id="intermediate-deadline" 
              name="deadline" 
              value={formData.intermediate.deadline}
              onChange={(e) => handleDeadlineChange('intermediate', e)}
            >
              <option value="2">2 semanas (urgente, +$3,500 MXN)</option>
              <option value="3">3 semanas</option>
              <option value="5">5 semanas</option>
              <option value="6">6 semanas</option>
            </select>
          </div>
          
          <div className="form-section">
            <h3>Requisitos Adicionales</h3>
            <label htmlFor="intermediate-notes">Notas adicionales o requisitos específicos:</label>
            <textarea 
              id="intermediate-notes" 
              name="notes" 
              rows="4"
              value={formData.intermediate.notes}
              onChange={(e) => handleInputChange('intermediate', e)}
            ></textarea>
          </div>
          
          <div className="price-section">
            <h3>Presupuesto Estimado</h3>
            <div className="price">${prices.intermediate.toLocaleString()} MXN</div>
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
                    <td><strong>${prices.intermediate.toLocaleString()} MXN</strong></td>
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
              <li>Soporte mejorado y mayor visibilidad en buscadores
              </li>
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

      {/* FORMULARIO PLAN AVANZADO */}
      <div className={`form-container ${activeTab === 'advanced' ? 'active' : ''}`}>
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

        <form id="advanced-plan-form" onSubmit={(e) => handleSubmit(e, 'advanced')}>
          <div className="form-section">
            <h3>Información de Contacto</h3>
            <label htmlFor="advanced-name">Nombre completo:</label>
            <input 
              type="text" 
              id="advanced-name" 
              name="name" 
              value={formData.advanced.name} 
              onChange={(e) => handleInputChange('advanced', e)} 
              required 
            />
            
            <label htmlFor="advanced-email">Correo electrónico:</label>
            <input 
              type="email" 
              id="advanced-email" 
              name="email" 
              value={formData.advanced.email} 
              onChange={(e) => handleInputChange('advanced', e)} 
              required 
            />
            
            <label htmlFor="advanced-phone">Teléfono:</label>
            <input 
              type="tel" 
              id="advanced-phone" 
              name="phone" 
              value={formData.advanced.phone} 
              onChange={(e) => handleInputChange('advanced', e)} 
              required 
            />
            
            <label htmlFor="advanced-company">Empresa/Organización:</label>
            <input 
              type="text" 
              id="advanced-company" 
              name="company" 
              value={formData.advanced.company} 
              onChange={(e) => handleInputChange('advanced', e)} 
              required 
            />
            
            <label htmlFor="advanced-position">Cargo/Posición:</label>
            <input 
              type="text" 
              id="advanced-position" 
              name="position" 
              value={formData.advanced.position} 
              onChange={(e) => handleInputChange('advanced', e)} 
            />
          </div>

          <div className="form-section">
            <h3>Características del Sitio</h3>
            
            <div className="checkbox-group">
              <p>Páginas incluidas (ilimitadas, sugerimos):</p>
              <div className="checkbox-item">
                <input type="checkbox" id="advanced-home" name="pages" value="home" checked disabled />
                <label htmlFor="advanced-home">Inicio (obligatoria)</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="advanced-about" name="pages" value="about" checked disabled />
                <label htmlFor="advanced-about">Sobre Nosotros</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="advanced-services" name="pages" value="services" checked disabled />
                <label htmlFor="advanced-services">Servicios/Habitaciones</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="advanced-contact" name="pages" value="contact" checked disabled />
                <label htmlFor="advanced-contact">Contacto</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="advanced-gallery" name="pages" value="gallery" checked disabled />
                <label htmlFor="advanced-gallery">Galería</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="advanced-faq" name="pages" value="faq" checked disabled />
                <label htmlFor="advanced-faq">Preguntas Frecuentes</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="advanced-blog" 
                  name="pages" 
                  value="blog"
                  checked={formData.advanced.pages.includes('blog')}
                  onChange={(e) => handleCheckboxChange('advanced', e)}
                />
                <label htmlFor="advanced-blog">Blog/Noticias</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="advanced-location" 
                  name="pages" 
                  value="location"
                  checked={formData.advanced.pages.includes('location')}
                  onChange={(e) => handleCheckboxChange('advanced', e)}
                />
                <label htmlFor="advanced-location">Ubicación/Mapa</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="advanced-booking" 
                  name="pages" 
                  value="booking"
                  checked={formData.advanced.pages.includes('booking')}
                  onChange={(e) => handleCheckboxChange('advanced', e)}
                />
                <label htmlFor="advanced-booking">Reservas</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="advanced-testimonials" 
                  name="pages" 
                  value="testimonials"
                  checked={formData.advanced.pages.includes('testimonials')}
                  onChange={(e) => handleCheckboxChange('advanced', e)}
                />
                <label htmlFor="advanced-testimonials">Testimonios</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="advanced-partnerships" 
                  name="pages" 
                  value="partnerships"
                  checked={formData.advanced.pages.includes('partnerships')}
                  onChange={(e) => handleCheckboxChange('advanced', e)}
                />
                <label htmlFor="advanced-partnerships">Alianzas/Partners</label>
              </div>
            </div>
            
            <label htmlFor="advanced-design">Estilo de diseño:</label>
            <select 
              id="advanced-design" 
              name="design" 
              value={formData.advanced.design}
              onChange={(e) => handleInputChange('advanced', e)}
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
                className={`color-option ${selectedColors.advanced.includes('red') ? 'selected' : ''}`} 
                style={{backgroundColor: '#e74c3c'}} 
                onClick={() => handleColorSelect('advanced', 'red')}
                title="Rojo"
              ></div>
              <div 
                className={`color-option ${selectedColors.advanced.includes('blue') ? 'selected' : ''}`} 
                style={{backgroundColor: '#3498db'}} 
                onClick={() => handleColorSelect('advanced', 'blue')}
                title="Azul"
              ></div>
              <div 
                className={`color-option ${selectedColors.advanced.includes('green') ? 'selected' : ''}`} 
                style={{backgroundColor: '#2ecc71'}} 
                onClick={() => handleColorSelect('advanced', 'green')}
                title="Verde"
              ></div>
              <div 
                className={`color-option ${selectedColors.advanced.includes('orange') ? 'selected' : ''}`} 
                style={{backgroundColor: '#f39c12'}} 
                onClick={() => handleColorSelect('advanced', 'orange')}
                title="Naranja"
              ></div>
              <div 
                className={`color-option ${selectedColors.advanced.includes('purple') ? 'selected' : ''}`} 
                style={{backgroundColor: '#9b59b6'}} 
                onClick={() => handleColorSelect('advanced', 'purple')}
                title="Morado"
              ></div>
              <div 
                className={`color-option ${selectedColors.advanced.includes('turquoise') ? 'selected' : ''}`} 
                style={{backgroundColor: '#1abc9c'}} 
                onClick={() => handleColorSelect('advanced', 'turquoise')}
                title="Turquesa"
              ></div>
              <div 
                className={`color-option ${selectedColors.advanced.includes('darkblue') ? 'selected' : ''}`} 
                style={{backgroundColor: '#34495e'}} 
                onClick={() => handleColorSelect('advanced', 'darkblue')}
                title="Azul Oscuro"
              ></div>
              <div 
                className={`color-option ${selectedColors.advanced.includes('white') ? 'selected' : ''}`} 
                style={{backgroundColor: '#ffffff', border: '1px solid #ddd'}} 
                onClick={() => handleColorSelect('advanced', 'white')}
                title="Blanco"
              ></div>
              <div 
                className={`color-option ${selectedColors.advanced.includes('black') ? 'selected' : ''}`} 
                style={{backgroundColor: '#000000'}} 
                onClick={() => handleColorSelect('advanced', 'black')}
                title="Negro"
              ></div>
              <div 
                className={`color-option ${selectedColors.advanced.includes('gold') ? 'selected' : ''}`} 
                style={{backgroundColor: '#FFD700'}} 
                onClick={() => handleColorSelect('advanced', 'gold')}
                title="Dorado"
              ></div>
              <div 
                className={`color-option ${selectedColors.advanced.includes('pink') ? 'selected' : ''}`} 
                style={{backgroundColor: '#FF69B4'}} 
                onClick={() => handleColorSelect('advanced', 'pink')}
                title="Rosa"
              ></div>
              <div 
                className={`color-option ${selectedColors.advanced.includes('silver') ? 'selected' : ''}`} 
                style={{backgroundColor: '#C0C0C0'}} 
                onClick={() => handleColorSelect('advanced', 'silver')}
                title="Plata"
              ></div>
            </div>
            <p className="color-selected">
              Colores seleccionados: {selectedColors.advanced.length > 0 ? selectedColors.advanced.join(', ') : 'Ninguno'}
            </p>
            
            <p>Animaciones (seleccione hasta 5):</p>
            <div className="animation-options">
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="advanced-animation-fade" 
                  name="animations" 
                  value="fade"
                  checked={selectedAnimations.advanced.includes('fade')}
                  onChange={(e) => handleAnimationSelect('advanced', 'fade')}
                />
                <label htmlFor="advanced-animation-fade">Fade In/Out</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="advanced-animation-slide" 
                  name="animations" 
                  value="slide"
                  checked={selectedAnimations.advanced.includes('slide')}
                  onChange={(e) => handleAnimationSelect('advanced', 'slide')}
                />
                <label htmlFor="advanced-animation-slide">Slide Effects</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="advanced-animation-parallax" 
                  name="animations" 
                  value="parallax"
                  checked={selectedAnimations.advanced.includes('parallax')}
                  onChange={(e) => handleAnimationSelect('advanced', 'parallax')}
                />
                <label htmlFor="advanced-animation-parallax">Parallax Scrolling</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="advanced-animation-advanced" 
                  name="animations" 
                  value="advanced"
                  checked={selectedAnimations.advanced.includes('advanced')}
                  onChange={(e) => handleAnimationSelect('advanced', 'advanced')}
                />
                <label htmlFor="advanced-animation-advanced">Animaciones avanzadas CSS3 (+$1,500 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="advanced-animation-3d" 
                  name="animations" 
                  value="3d"
                  checked={selectedAnimations.advanced.includes('3d')}
                  onChange={(e) => handleAnimationSelect('advanced', '3d')}
                />
                <label htmlFor="advanced-animation-3d">Efectos 3D (+$2,500 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="advanced-animation-interactive" 
                  name="animations" 
                  value="interactive"
                  checked={selectedAnimations.advanced.includes('interactive')}
                  onChange={(e) => handleAnimationSelect('advanced', 'interactive')}
                />
                <label htmlFor="advanced-animation-interactive">Interacciones personalizadas (+$3
                  ,000 MXN)</label>
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
                  id="advanced-payment" 
                  name="features" 
                  value="payment-gateway"
                  checked={additionalFeatures.advanced.includes('payment-gateway')}
                  onChange={(e) => handleFeatureChange('advanced', 'payment-gateway', e.target.checked)}
                />
                <label htmlFor="advanced-payment">Pasarela de pago integrada (+$3,500 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="advanced-accounts" 
                  name="features" 
                  value="user-accounts"
                  checked={additionalFeatures.advanced.includes('user-accounts')}
                  onChange={(e) => handleFeatureChange('advanced', 'user-accounts', e.target.checked)}
                />
                <label htmlFor="advanced-accounts">Sistema de cuentas de usuario (+$2,800 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="advanced-reviews" 
                  name="features" 
                  value="reviews"
                  checked={additionalFeatures.advanced.includes('reviews')}
                  onChange={(e) => handleFeatureChange('advanced', 'reviews', e.target.checked)}
                />
                <label htmlFor="advanced-reviews">Sistema de reseñas y calificaciones (+$1,500 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="advanced-api" 
                  name="features" 
                  value="api-integration"
                  checked={additionalFeatures.advanced.includes('api-integration')}
                  onChange={(e) => handleFeatureChange('advanced', 'api-integration', e.target.checked)}
                />
                <label htmlFor="advanced-api">Integración con APIs externas (OTAs, etc.) (+$3,000 MXN)</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="advanced-dashboard" 
                  name="features" 
                  value="custom-dashboard"
                  checked={additionalFeatures.advanced.includes('custom-dashboard')}
                  onChange={(e) => handleFeatureChange('advanced', 'custom-dashboard', e.target.checked)}
                />
                <label htmlFor="advanced-dashboard">Panel de administración personalizado (+$4,000 MXN)</label>
              </div>
            </div>
            
            <label htmlFor="advanced-deadline">Plazo de entrega deseado (en semanas):</label>
            <select 
              id="advanced-deadline" 
              name="deadline" 
              value={formData.advanced.deadline}
              onChange={(e) => handleDeadlineChange('advanced', e)}
            >
              <option value="2">2 semanas (urgente, +$5,000 MXN)</option>
              <option value="4">4 semanas</option>
              <option value="6">6 semanas</option>
              <option value="8">8 semanas</option>
            </select>
          </div>
          
          <div className="form-section">
            <h3>Requisitos Adicionales</h3>
            <label htmlFor="advanced-notes">Notas adicionales o requisitos específicos:</label>
            <textarea 
              id="advanced-notes" 
              name="notes" 
              rows="4"
              value={formData.advanced.notes}
              onChange={(e) => handleInputChange('advanced', e)}
            ></textarea>
            
            <label htmlFor="advanced-competitors">URLs de sitios web competidores que le gusten:</label>
            <textarea 
              id="advanced-competitors" 
              name="competitors" 
              rows="3" 
              placeholder="Ingrese URLs separadas por comas"
              value={formData.advanced.competitors}
              onChange={(e) => handleInputChange('advanced', e)}
            ></textarea>
            
            <label htmlFor="advanced-branding">¿Dispone de manual de marca, logotipos y otros elementos gráficos?</label>
            <select 
              id="advanced-branding" 
              name="has_branding"
              value={formData.advanced.has_branding}
              onChange={(e) => handleInputChange('advanced', e)}
            >
              <option value="yes">Sí, tenemos material de marca completo</option>
              <option value="partial">Parcialmente, tenemos algunos elementos</option>
              <option value="no">No, necesitaremos ayuda con estos elementos</option>
            </select>
          </div>
          
          <div className="price-section">
            <h3>Presupuesto Estimado</h3>
            <div className="price">${prices.advanced.toLocaleString()} MXN</div>
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
                    <td><strong>${prices.advanced.toLocaleString()} MXN</strong></td>
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
      
      <footer>
        <div className="container footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Qmotel</h3>
            <p>Soluciones digitales para su negocio.</p>
            <p>Querétaro, México</p>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">Enlaces Rápidos</h3>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/cotizacion-basica">Plan Básico</Link></li>
              <li><Link to="/cotizacion-intermedia">Plan Intermedio</Link></li>
              <li><Link to="/cotizacion-avanzada">Plan Avanzado</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">Contacto</h3>
            <p>Email: info@qmotel.com</p>
            <p>Teléfono: (442) 123-4567</p>
          </div>
        </div>
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} Qmotel. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default QuotationForm;