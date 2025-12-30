import { useState } from 'react';
import './App.css';
import Actividades from './components/Actividades.jsx';
import { DateTime } from './components/DataTime.jsx';
import Eventos from './components/Eventos.jsx';
import Hoteles from './components/Hoteles.jsx';
import LoginModal from './components/login.jsx';


function App() {
  const [showHoteles, setShowHoteles] = useState(false);
  const [showActividades, setShowActividades] = useState(false);
  const [showEventos, setShowEventos] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null); // null si no está logueado

  // Función para volver al inicio
  const goHome = () => {
    setShowHoteles(false);
    setShowActividades(false);
    setShowEventos(false);
  };
  return (
    <>
      <header>
        <img src="/Andorrax.jpg" alt="AndorraX Logo" />
        <div className="header-right">
          <DateTime />
          {user ? (
            <>
              <span style={{fontWeight:600, color:'#2563eb', marginRight:16}}>👤 {user.name}</span>
              <button onClick={() => setUser(null)} style={{marginRight:12, background:'#e11d48', color:'#fff', border:'none', borderRadius:6, padding:'6px 14px', fontWeight:600, cursor:'pointer'}}>Salir</button>
            </>
          ) : null}
          <button onClick={() => setShowLogin(true)}>
            {user ? 'Cambiar usuario' : 'Iniciar Sesión'}
          </button>
        </div>
      </header>
      <nav className="main-nav">
        <button className='inicio' onClick={goHome}>Inicio</button>
        <button 
          className={showHoteles ? 'hoteles-btn active' : 'hoteles-btn'}
          onClick={() => {
            if (!showHoteles) goHome();
            setShowHoteles(v => !v);
          }}
        >
          {showHoteles ? 'Cerrar Hoteles' : 'Ver Hoteles'}
        </button>
        <button
          className={showActividades ? 'actividades active' : 'actividades'}
          onClick={() => {
            if (!showActividades) goHome();
            setShowActividades(v => !v);
          }}
        >Actividades</button>
        <button
          className={showEventos ? 'eventos active' : 'eventos'}
          onClick={() => {
            if (!showEventos) goHome();
            setShowEventos(v => !v);
          }}
        >Eventos</button>
        <button
          className='reserva'
          onClick={() => {
            if (!user) {
              setShowLogin(true);
            } else {
              // Aquí puedes poner la lógica de reserva real
              alert('Acceso a reservas solo para usuarios registrados.');
            }
          }}
          style={!user ? { opacity: 0.7, cursor: 'not-allowed', position:'relative', paddingLeft: '2em' } : {}}
          disabled={!user}
        >
          {!user && <span style={{position:'absolute', left:'0.7em', top:'50%', transform:'translateY(-50%)', fontSize:'1.1em'}}>🔒</span>}
          Reserva
        </button>
      </nav>
      {/* Sección de resumen en la página de inicio */}
      {!showHoteles && !showActividades && !showEventos && (
        <section className="home-summary">
          <div className="home-summary-content pro-home">
            <div className="home-hero">
              <h1 className="home-title">AndorraX</h1>
              <h2 className="home-subtitle">Explora. Reserva. Vive.</h2>
              <p className="home-desc">
                La plataforma más avanzada para descubrir hoteles, actividades y eventos en Andorra.<br/>
                <span className="home-highlight">Tecnología, comodidad y experiencias únicas en un solo lugar.</span>
              </p>
            </div>
            <div className="home-examples">
              {/* Tarjeta ejemplo Hotel */}
              <div className="card-example hotel" style={{cursor:'pointer'}} onClick={() => { setShowHoteles(true); setShowActividades(false); setShowEventos(false); }}>
                <img src="/Images/Pas_de_la_casa/apartamento_cims.jpg" alt="Hotel Cims" />
                <div className="card-example-body">
                  <h3>Hotel Cims</h3>
                  <p className="card-example-info">Desde <span>150$</span> · Valoración: <span>7.7</span></p>
                </div>
              </div>
              {/* Tarjeta ejemplo Actividad */}
              <div className="card-example actividad" style={{cursor:'pointer'}} onClick={() => { setShowHoteles(false); setShowActividades(true); setShowEventos(false); }}>
                <img src="/Images/Actividades/visita-guiada-andorra-vieja.jpg" alt="Visita guiada por Andorra la Vieja" />
                <div className="card-example-body">
                  <h3>Visita guiada por Andorra la Vieja</h3>
                  <p className="card-example-info">Cultural · <span>15$</span> · 3h</p>
                </div>
              </div>
              {/* Tarjeta ejemplo Evento */}
              <div className="card-example evento" style={{cursor:'pointer'}} onClick={() => { setShowHoteles(false); setShowActividades(false); setShowEventos(true); }}>
                <img src="/Images/evento-ejemplo.jpg" alt="Carnaval de Andorra la Vella" onError={e => {e.target.style.display='none';}} />
                <div className="card-example-body">
                  <h3>Carnaval de Andorra la Vella</h3>
                  <p className="card-example-info">15 Feb 2026 · Centro histórico</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <div className="App">
        {showHoteles && (
          <>
            <div className="page-title hoteles-title">🏨 Hoteles exclusivos en Andorra</div>
            <div className="hoteles-panel">
              <Hoteles visible={showHoteles} user={user} />
            </div>
          </>
        )}
        {showActividades && (
          <>
            <div className="page-title actividades-title">🎯 Vive las mejores actividades</div>
            <Actividades visible={showActividades} />
          </>
        )}
        {showEventos && (
          <>
            <div className="page-title eventos-title">🎉 Eventos únicos y experiencias</div>
            <Eventos visible={showEventos} />
          </>
        )}
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onSubmit={async ({ name, password }) => {
            // Leer user.json y comprobar usuario y contraseña
            function sha256(str) {
              // Codifica el string como SHA-256 y devuelve el hash en hex
              return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(buf =>
                Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
              );
            }
            try {
              const res = await fetch('/user.json');
              const users = await res.json();
              const userFound = users.find(u => u.name === name);
              if (userFound) {
                const hash = await sha256(password);
                if (userFound.hashedPassword === hash) {
                  setUser({ name: userFound.name });
                  setShowLogin(false);
                } else {
                  alert('Contraseña incorrecta');
                }
              } else {
                alert('Usuario no registrado');
              }
            } catch (e) {
              alert('Error comprobando usuario');
            }
          }}
        />
      </div>
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/Andorrax.jpg" alt="AndorraX Logo" style={{height:36, borderRadius:8, marginRight:12}} />
            <span style={{fontWeight:700, color:'#2563eb', fontSize:'1.15rem'}}>AndorraX</span>
          </div>
          <div className="footer-links">
            <a href="/aviso-legal.html" target="_blank" rel="noopener noreferrer" style={{color:'#2563eb'}}>Aviso legal</a>
            <a href="/privacidad.html" target="_blank" rel="noopener noreferrer" style={{color:'#2563eb'}}>Política de privacidad</a>
            <a href="mailto:info@andorrax.es" style={{color:'#2563eb'}}>Contacto</a>
          </div>
          <div className="footer-social">
            <a href="https://www.facebook.com/andorrax.es" target="_blank" rel="noopener noreferrer" aria-label="Facebook AndorraX">
              <img src="/icons/facebook.svg" alt="Facebook" className="footer-social-icon" />
            </a>
            <a href="https://www.instagram.com/andorrax.es" target="_blank" rel="noopener noreferrer" aria-label="Instagram AndorraX">
              <img src="/icons/instagram.svg" alt="Instagram" className="footer-social-icon" />
            </a>
            <a href="https://twitter.com/andorrax_es" target="_blank" rel="noopener noreferrer" aria-label="Twitter AndorraX">
              <img src="/icons/twitter.svg" alt="Twitter" className="footer-social-icon" />
            </a>
          </div>
          <div className="footer-copy">
            © {new Date().getFullYear()} AndorraX. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;