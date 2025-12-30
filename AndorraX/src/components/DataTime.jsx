import { Calendar, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export const DateTime = () => {
  // Estado que guarda la fecha y hora actual
  const [currentTime, setCurrentTime] = useState(new Date());

  // Efecto que actualiza la hora cada 1 segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Limpieza del intervalo cuando el componente se desmonta
    return () => clearInterval(timer);
  }, []);

  // Formatea la hora en formato HH:MM:SS
  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Formatea la fecha en formato largo
  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="current-date" aria-label="Reloj y fecha actuales" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
      <Clock size={18} style={{color: '#2563eb', filter: 'drop-shadow(0 0 4px #60a5fa88)'}} />
      <time
        dateTime={currentTime.toISOString()}
        style={{fontFamily: 'Orbitron, Segoe UI, Arial, sans-serif', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '2px', color: '#f8fafc'}}
        aria-label={`Hora actual: ${formatTime(currentTime)}`}
      >
        {formatTime(currentTime)}
      </time>
      <span style={{margin: '0 6px', color: '#e0e7ff', fontWeight: 400}}>|</span>
      <Calendar size={18} style={{color: '#0ea5e9', filter: 'drop-shadow(0 0 4px #7ecbfa88)'}} />
      <time
        dateTime={currentTime.toISOString()}
        style={{fontFamily: 'Orbitron, Segoe UI, Arial, sans-serif', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '2px', color: '#e0e7ff', textTransform: 'uppercase'}}
        aria-label={`Fecha actual: ${formatDate(currentTime)}`}
      >
        {formatDate(currentTime)}
      </time>
    </div>
  );
};
