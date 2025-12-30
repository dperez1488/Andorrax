import { useEffect, useState } from 'react';
import '../App.css';

function ActividadCard({ actividad }) {
  const [imgIdx, setImgIdx] = useState(0);
  const imagenes = actividad.imagen ? actividad.imagen.split(',').map(img => img.trim()) : [];
  const nextImg = (e) => {
    e.stopPropagation();
    setImgIdx(i => (i + 1) % imagenes.length);
  };
  const prevImg = (e) => {
    e.stopPropagation();
    setImgIdx(i => (i - 1 + imagenes.length) % imagenes.length);
  };
  return (
    <div className="section-card" tabIndex={0} style={{cursor:'pointer'}}>
      <h3>{actividad.nombre}</h3>
      {imagenes.length > 0 && (
        <div className="carrusel-img">
          <button className="carrusel-btn" onClick={prevImg} disabled={imagenes.length < 2}>&lt;</button>
          <img src={imagenes[imgIdx]} alt={actividad.nombre} />
          <button className="carrusel-btn" onClick={nextImg} disabled={imagenes.length < 2}>&gt;</button>
        </div>
      )}
      {imagenes.length > 1 && (
        <div className="carrusel-dots">
          {imagenes.map((_, i) => (
            <span key={i} className={i === imgIdx ? 'dot active' : 'dot'}></span>
          ))}
        </div>
      )}
      <p><span role="img" aria-label="precio">💶</span> <b>Precio:</b> {actividad.precio}</p>
      <p><span role="img" aria-label="categoria">🏷️</span> <b>Categoría:</b> {actividad.categoria}</p>
      {actividad.ubicacion && <p><span role="img" aria-label="ubicacion">📍</span> <b>Ubicación:</b> {actividad.ubicacion}</p>}
      {actividad.fecha && <p><span role="img" aria-label="fecha">📅</span> <b>Fecha:</b> {actividad.fecha}</p>}
      {actividad.duracion && <p><span role="img" aria-label="duracion">⏱️</span> <b>Duración:</b> {actividad.duracion}</p>}
      {actividad.descripcion && <p style={{marginTop:8}}>{actividad.descripcion}</p>}
    </div>
  );
}

export default function Actividades({ visible }) {
  const [actividades, setActividades] = useState([]);
  const [filtros, setFiltros] = useState({ categoria: [], ubicacion: [] });

  useEffect(() => {
    if (visible) {
      fetch('/actividades.json')
        .then(res => res.json())
        .then(data => setActividades(data));
    }
  }, [visible]);
  if (!visible) return null;

  // Obtener categorías y ubicaciones únicas
  const categorias = Array.from(new Set(actividades.map(a => a.categoria).filter(Boolean)));
  const ubicaciones = Array.from(new Set(actividades.map(a => a.ubicacion).filter(Boolean)));

  // Filtrar actividades
  const actividadesFiltradas = actividades.filter(a => {
    const catOk = !filtros.categoria.length || filtros.categoria.includes(a.categoria);
    const ubiOk = !filtros.ubicacion.length || filtros.ubicacion.includes(a.ubicacion);
    return catOk && ubiOk;
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
            <b>Categoría:</b><br />
            {categorias.map(cat => (
              <label key={cat} style={{display:'block', margin:'8px 0'}}>
                <input
                  type="checkbox"
                  checked={filtros.categoria.includes(cat)}
                  onChange={e => handleCheckbox(e, 'categoria', cat)}
                /> {cat}
              </label>
            ))}
          </div>
          <div style={{marginTop:18}}>
            <b>Ubicación:</b><br />
            {ubicaciones.map(ubi => (
              <label key={ubi} style={{display:'block', margin:'8px 0'}}>
                <input
                  type="checkbox"
                  checked={filtros.ubicacion.includes(ubi)}
                  onChange={e => handleCheckbox(e, 'ubicacion', ubi)}
                /> {ubi}
              </label>
            ))}
          </div>
        </aside>
        <div className="hoteles-grid">
          {actividadesFiltradas.map(actividad => (
            <ActividadCard key={actividad.id_actividad} actividad={actividad} />
          ))}
        </div>
      </div>
    </div>
  );
}
