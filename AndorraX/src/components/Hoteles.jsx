


import { useEffect, useState } from 'react';
import '../App.css';




function HotelCard({ hotel, onClick, user }) {
  const [imgIdx, setImgIdx] = useState(0);
  const imagenes = hotel.imagen ? hotel.imagen.split(',').map(img => img.trim()) : [];
  const nextImg = (e) => {
    e.stopPropagation();
    setImgIdx(i => (i + 1) % imagenes.length);
  };
  const prevImg = (e) => {
    e.stopPropagation();
    setImgIdx(i => (i - 1 + imagenes.length) % imagenes.length);
  };
  return (
    <div className="section-card" tabIndex={0} onClick={onClick} style={{cursor:'pointer'}}>
      <h3>{hotel.nombre}</h3>
      {imagenes.length > 0 && (
        <div className="carrusel-img">
          <button className="carrusel-btn" onClick={prevImg} disabled={imagenes.length < 2}>&lt;</button>
          <img src={imagenes[imgIdx]} alt={hotel.nombre} />
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
      <p><span role="img" aria-label="precio">💶</span> <b>Precio:</b> {hotel.precio}</p>
      <p><span role="img" aria-label="distancia">🚗</span> <b>Distancia:</b> {hotel.distancia}</p>
      <p><span role="img" aria-label="valoracion">⭐</span> <b>Valoración:</b> {hotel.valoracion}</p>
      <p><span role="img" aria-label="tipo">🏨</span> <b>Tipo:</b> {hotel.tipo_alojamiento}</p>
      {hotel.direccion && <p><span role="img" aria-label="direccion">📍</span> <b>Dirección:</b> {hotel.direccion}</p>}
      {hotel.sector && <p><span role="img" aria-label="sector">🗺️</span> <b>Sector:</b> {hotel.sector}</p>}
      <button
        className="hoteles-btn"
        style={!user ? { opacity: 0.7, cursor: 'not-allowed', position:'relative', paddingLeft: '2em', marginTop: 12 } : { marginTop: 12 }}
        disabled={!user}
        onClick={e => {
          e.stopPropagation();
          if (!user) return;
          onClick();
        }}
      >
        {!user && <span style={{position:'absolute', left:'0.7em', top:'50%', transform:'translateY(-50%)', fontSize:'1.1em'}}>🔒</span>}
        Reservar
      </button>
    </div>
  );
}

function HotelModal({ hotel, onClose }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [showReserva, setShowReserva] = useState(false);
  const [fechaEntrada, setFechaEntrada] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [adultos, setAdultos] = useState(2);
  const [ninos, setNinos] = useState(0);
  const [habitaciones, setHabitaciones] = useState(1);
  const imagenes = hotel.imagen ? hotel.imagen.split(',').map(img => img.trim()) : [];
  const nextImg = () => setImgIdx(i => (i + 1) % imagenes.length);
  const prevImg = () => setImgIdx(i => (i - 1 + imagenes.length) % imagenes.length);

  // Cálculo de noches y presupuesto profesional
  let noches = 0;
  if (fechaEntrada && fechaSalida) {
    const d1 = new Date(fechaEntrada);
    const d2 = new Date(fechaSalida);
    noches = Math.max(0, Math.ceil((d2-d1)/(1000*60*60*24)));
  }
  const precioBase = parseFloat(hotel.precio) || 0;
  // Lógica: cada habitación tiene capacidad máxima de 2 adultos + 2 niños
  // Adultos pagan precio completo, niños pagan 50% del precio base
  // Si hay más comensales que capacidad, se requieren más habitaciones
  const capacidadPorHabitacion = 2 + 2; // 2 adultos + 2 niños
  const totalComensales = adultos + ninos;
  // El usuario puede elegir más habitaciones de las necesarias, pero nunca menos de las requeridas para todos los comensales
  const habitacionesMinimas = Math.ceil(totalComensales / capacidadPorHabitacion);
  const habitacionesFinal = Math.max(habitaciones, habitacionesMinimas);
  // Reparto: máximo 2 adultos y 2 niños por habitación
  let adultosRestantes = adultos;
  let ninosRestantes = ninos;
  let total = 0;
  for (let h = 0; h < habitacionesFinal; h++) {
    let adultosEnHab = Math.min(2, adultosRestantes);
    let ninosEnHab = Math.min(2, ninosRestantes);
    adultosRestantes -= adultosEnHab;
    ninosRestantes -= ninosEnHab;
    // Si la habitación está vacía (por habitaciones extra), se cobra igualmente el precio base por noche
    let precioHab = (adultosEnHab * precioBase) + (ninosEnHab * precioBase * 0.5);
    // Si la habitación está vacía, se cobra el precio base mínimo (1 adulto)
    if (adultosEnHab + ninosEnHab === 0) {
      precioHab = precioBase;
    }
    total += precioHab * noches;
  }
  const precioTotal = noches > 0 ? total : 0;

  return (
    <div className="hotel-modal-bg" onClick={onClose}>
      <div className="hotel-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{hotel.nombre}</h2>
        {imagenes.length > 0 && (
          <div className="carrusel-img modal-img">
            <button className="carrusel-btn" onClick={prevImg} disabled={imagenes.length < 2}>&lt;</button>
            <img src={imagenes[imgIdx]} alt={hotel.nombre} />
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
        <div className="modal-info">
          <p><span role="img" aria-label="precio">💶</span> <b>Precio:</b> {hotel.precio}</p>
          <p><span role="img" aria-label="distancia">🚗</span> <b>Distancia:</b> {hotel.distancia}</p>
          <p><span role="img" aria-label="valoracion">⭐</span> <b>Valoración:</b> {hotel.valoracion}</p>
          <p><span role="img" aria-label="tipo">🏨</span> <b>Tipo:</b> {hotel.tipo_alojamiento}</p>
          {hotel.direccion && <p><span role="img" aria-label="direccion">📍</span> <b>Dirección:</b> {hotel.direccion}</p>}
          {hotel.sector && <p><span role="img" aria-label="sector">🗺️</span> <b>Sector:</b> {hotel.sector}</p>}
          {!showReserva && (
            <button className="hoteles-btn" style={{marginTop:24, width:'100%'}} onClick={()=>setShowReserva(true)}>
              Reservar
            </button>
          )}
          {showReserva && (
            <div style={{marginTop:18, background:'#f8fafc', borderRadius:12, padding:16, boxShadow:'0 2px 8px #60a5fa22'}}>
              <div style={{display:'flex', gap:12, flexWrap:'wrap', marginBottom:10}}>
                <div>
                  <label>Entrada<br/>
                    <input type="date" value={fechaEntrada} onChange={e=>setFechaEntrada(e.target.value)} style={{padding:4, borderRadius:6, border:'1px solid #60a5fa'}} />
                  </label>
                </div>
                <div>
                  <label>Salida<br/>
                    <input type="date" value={fechaSalida} onChange={e=>setFechaSalida(e.target.value)} style={{padding:4, borderRadius:6, border:'1px solid #60a5fa'}} />
                  </label>
                </div>
                <div>
                  <label>Adultos<br/>
                    <input type="number" min={1} max={8} value={adultos} onChange={e=>setAdultos(Number(e.target.value))} style={{width:50, padding:4, borderRadius:6, border:'1px solid #60a5fa'}} />
                  </label>
                </div>
                <div>
                  <label>Niños<br/>
                    <input type="number" min={0} max={8} value={ninos} onChange={e=>setNinos(Number(e.target.value))} style={{width:50, padding:4, borderRadius:6, border:'1px solid #60a5fa'}} />
                  </label>
                </div>
                <div>
                  <label>Habitaciones<br/>
                    <input type="number" min={1} max={5} value={habitaciones} onChange={e=>setHabitaciones(Number(e.target.value))} style={{width:50, padding:4, borderRadius:6, border:'1px solid #60a5fa'}} />
                  </label>
                </div>
              </div>
              {/* Aviso si el usuario selecciona menos habitaciones de las necesarias */}
              {habitaciones < habitacionesMinimas && (
                <div style={{color:'#e11d48', fontWeight:600, marginBottom:8, fontSize:'1.02rem'}}>
                  ⚠️ Se necesitan al menos {habitacionesMinimas} habitación{habitacionesMinimas>1?'es':''} para {adultos+ninos} comensales. El presupuesto se ajusta automáticamente.
                </div>
              )}
              <div style={{marginTop:8, fontWeight:600, color:'#2563eb'}}>
                {noches > 0 ? (
                  <>
                    <span>Presupuesto: <b>{precioTotal.toLocaleString('es-ES', {style:'currency', currency:'EUR'})}</b> para {noches} noche{noches>1?'s':''}, {adultos} adulto{adultos>1?'s':''}{ninos>0?`, ${ninos} niño${ninos>1?'s':''}`:''}, {habitacionesFinal} habitación{habitacionesFinal>1?'es':''}</span>
                  </>
                ) : (
                  <span style={{color:'#e11d48'}}>Selecciona fechas válidas para ver el presupuesto</span>
                )}
              </div>
              <button className="hoteles-btn" style={{marginTop:16, width:'100%'}} disabled>
                Finalizar reserva (demo)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Hoteles({ visible, user }) {
  const [modalHotel, setModalHotel] = useState(null);
  const [hoteles, setHoteles] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [pagina, setPagina] = useState(1);
  const hotelesPorPagina = 6;

  useEffect(() => {
    if (visible) {
      fetch('/hoteles.json')
        .then(res => res.json())
        .then(data => setHoteles(data));
    }
  }, [visible]);

  if (!visible) return null;

  const sectores = Array.from(new Set(hoteles.map(h => h.sector).filter(Boolean)));
  const tipos = Array.from(new Set(hoteles.map(h => h.tipo_alojamiento).filter(Boolean)));

  const hotelesFiltrados = hoteles.filter(hotel => {
    const sectorOk = !filtros.sector || filtros.sector.length === 0 || filtros.sector.includes(hotel.sector);
    const tipoOk = !filtros.tipo || filtros.tipo.length === 0 || filtros.tipo.includes(hotel.tipo_alojamiento);
    return sectorOk && tipoOk;
  });

  const totalPaginas = Math.ceil(hotelesFiltrados.length / hotelesPorPagina);
  const hotelesPagina = hotelesFiltrados.slice((pagina - 1) * hotelesPorPagina, pagina * hotelesPorPagina);

  const handleCheckbox = (e, filtro, valor) => {
    setPagina(1);
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
    <div className="hoteles-layout">
      <aside className="hoteles-filtros">
        <div>
          <b>Sector:</b><br />
          {sectores.map(sector => (
            <label key={sector} style={{display: 'block', margin: '8px 0'}}>
              <input
                type="checkbox"
                checked={filtros.sector?.includes(sector) || false}
                onChange={e => handleCheckbox(e, 'sector', sector)}
              /> {sector}
            </label>
          ))}
        </div>
        <div style={{marginTop: '18px'}}>
          <b>Tipo alojamiento:</b><br />
          {tipos.map(tipo => (
            <label key={tipo} style={{display: 'block', margin: '8px 0'}}>
              <input
                type="checkbox"
                checked={filtros.tipo?.includes(tipo) || false}
                onChange={e => handleCheckbox(e, 'tipo', tipo)}
              /> {tipo}
            </label>
          ))}
        </div>
      </aside>
      <main className="hoteles-main">
        <div className="hoteles-grid">
          {hotelesPagina.map(hotel => (
            <HotelCard key={hotel.id_hotel} hotel={hotel} onClick={() => setModalHotel(hotel)} user={user} />
          ))}
        </div>
        {totalPaginas > 1 && (
          <div style={{display: 'flex', justifyContent: 'center', margin: '32px 0'}}>
            <button
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina === 1}
              style={{marginRight: '12px', padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#5b8be3', color: '#fff', fontWeight: 600, cursor: pagina === 1 ? 'not-allowed' : 'pointer', opacity: pagina === 1 ? 0.5 : 1}}
            >Anterior</button>
            <span style={{fontWeight: 600, fontSize: '1.1rem', margin: '0 12px'}}>Página {pagina} de {totalPaginas}</span>
            <button
              onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              style={{marginLeft: '12px', padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#5b8be3', color: '#fff', fontWeight: 600, cursor: pagina === totalPaginas ? 'not-allowed' : 'pointer', opacity: pagina === totalPaginas ? 0.5 : 1}}
            >Siguiente</button>
          </div>
        )}
      </main>
      {modalHotel && <HotelModal hotel={modalHotel} onClose={() => setModalHotel(null)} />}
    </div>
  );
}



