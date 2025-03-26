import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import BasicQuotation from './pages/BasicQuotation';
import IntermediateQuotation from './pages/IntermediateQuotation';
import AdvancedQuotation from './pages/AdvancedQuotation';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redireccionar la ruta principal al formulario básico */}
          <Route path="/" element={<Navigate to="/cotizacion-basica" />} />
          <Route path="/cotizacion-basica" element={<BasicQuotation />} />
          <Route path="/cotizacion-intermedia" element={<IntermediateQuotation />} />
          <Route path="/cotizacion-avanzada" element={<AdvancedQuotation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;