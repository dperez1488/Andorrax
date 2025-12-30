import { useEffect, useState } from 'react';
import '../App.css';

function EventoCard({ evento }) {
  return (
    <div className="section-card" tabIndex={0} style={{cursor:'pointer'}}>
      <h3>{evento.nombre}</h3>
      <p><span role="img" aria-label="fecha">📅</span> <b>Fecha:</b> {evento.fecha}</p>
      <p><span role="img" aria-label="lugar">📍</span> <b>Lugar:</b> {evento.lugar}</p>
      {evento.descripcion && <p style={{marginTop:8}}>{evento.descripcion}</p>}
      {evento.enlace && <p style={{marginTop:8}}><a href={evento.enlace} target="_blank" rel="noopener noreferrer" style={{color:'#2563eb', fontWeight:600}}>Más info</a></p>}
    </div>
  );
}

export default function Eventos({ visible }) {
  const [eventos, setEventos] = useState([]);
  const [filtros, setFiltros] = useState({ ciudad: [], anio: [] });

  useEffect(() => {
    if (visible) {
      fetch('/eventos.json')
        .then(res => res.json())
        .then(data => {
          // Aplanar estructura: ciudad/anio/eventos[]
          const flat = [];
          data.forEach(ciudadObj => {
            ciudadObj.eventos.forEach(ev => {
              flat.push({ ...ev, ciudad: ciudadObj.ciudad, anio: ciudadObj.anio });
            });
          });
          setEventos(flat);
        });
    }
  }, [visible]);
  if (!visible) return null;

  // Obtener ciudades y años únicos
  const ciudades = Array.from(new Set(eventos.map(e => e.ciudad).filter(Boolean)));
  const anios = Array.from(new Set(eventos.map(e => e.anio).filter(Boolean)));

  // Filtrar eventos
  const eventosFiltrados = eventos.filter(e => {
    const ciudadOk = !filtros.ciudad.length || filtros.ciudad.includes(e.ciudad);
    const anioOk = !filtros.anio.length || filtros.anio.includes(e.anio);
    return ciudadOk && anioOk;
  });

  const handleCheckbox = (e, filtro, valor) => {
    setFiltros(prev => {
      const arr = prev[filtro] ? [...prev[filtro]] : [];
      if (e.target.checked) {
        if (!arr.includes(valor)) arr.push(valor);
      } else {
        return { ...prev, [filtro]: arr.filter(v => v !== valor) };
      }
      return { ...prev, [filtro]: arr };
    });
  };

  return (
    <div className="App">
      <div className="hoteles-panel" style={{display:'flex', gap:32}}>
        <aside className="hoteles-filtros" style={{minWidth:210, maxWidth:240}}>
          <div>
            <b>Ciudad:</b><br />
            {ciudades.map(ciudad => (
              <label key={ciudad} style={{display:'block', margin:'8px 0'}}>
                <input
                  type="checkbox"
                  checked={filtros.ciudad.includes(ciudad)}
                  onChange={e => handleCheckbox(e, 'ciudad', ciudad)}
                /> {ciudad}
              </label>
            ))}
          </div>
          <div style={{marginTop:18}}>
            <b>Año:</b><br />
            {anios.map(anio => (
              <label key={anio} style={{display:'block', margin:'8px 0'}}>
                <input
                  type="checkbox"
                  checked={filtros.anio.includes(anio)}
                  onChange={e => handleCheckbox(e, 'anio', anio)}
                /> {anio}
              </label>
            ))}
          </div>
        </aside>
        <div className="hoteles-grid">
          {eventosFiltrados.map(evento => (
            <EventoCard key={evento.id + evento.ciudad + evento.anio} evento={evento} />
          ))}
        </div>
      </div>
    </div>
  );
}
