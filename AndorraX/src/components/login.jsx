import { useEffect, useRef, useState } from 'react';

export default function LoginModal({
  isOpen,
  title = 'Iniciar sesión',
  initialName = '',
  initialPassword = '',
  submitLabel = 'Entrar',
  cancelLabel = 'Cancelar',
  includeEmail = false,
  includeConfirm = false,
  onSubmit,
  onClose,
}) {
  const [name, setName] = useState(initialName);
  const [password, setPassword] = useState(initialPassword);
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const dialogRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        nameRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const t = setTimeout(() => nameRef.current?.focus(), 0);
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setName(initialName || '');
      setPassword(initialPassword || '');
      setEmail('');
      setConfirmPassword('');
    }
  }, [isOpen, initialName, initialPassword]);


  if (!isOpen) return null;
  if (registered) {
    return (
      <div className="login-modal__backdrop" ref={dialogRef} style={{background:'#fff', minHeight:'100vh', minWidth:'100vw', display:'flex', alignItems:'center', justifyContent:'center', zIndex:3000}}>
        <div className="login-modal login-modal--card login-modal--imgbg" style={{textAlign:'center', padding:'48px 32px'}}>
          <h2 style={{color:'#2563eb', marginBottom:16}}>¡Usuario registrado correctamente!</h2>
          <button className="hoteles-btn" style={{marginTop:18, width:'100%'}} onClick={()=>{setRegistered(false); setIsRegister(false); onClose?.();}}>
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  const handleBackdrop = (e) => {
    if (e.target === dialogRef.current) {
      onClose?.();
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (isRegister) {
      if (!name || !password || !confirmPassword) {
        setRegisterError('Rellena todos los campos');
        return;
      }
      if (password !== confirmPassword) {
        setRegisterError('Las contraseñas no coinciden');
        return;
      }
      setRegisterError('');
      setRegistered(true);
      return;
    }
    onSubmit?.({ name, password, email, confirmPassword });
  };

  return (
    <div
      className="login-modal__backdrop"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      onMouseDown={handleBackdrop}
      style={{
        background: `#fff`,
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000
      }}
    >
      <div className="login-modal login-modal--card login-modal--imgbg" onMouseDown={(e) => e.stopPropagation()}>
        <header className="login-modal__header">
          <h3 id="login-modal-title" className="text-gradient">{isRegister ? 'Registrarse' : 'Iniciar sesión'}</h3>
          <button
            aria-label="Cerrar"
            className="login-modal__close text-secondary"
            onClick={() => onClose?.()}
          >
            ×
          </button>
        </header>
        <form onSubmit={handleSubmit} className="login-modal__body">
          <label className="login-modal__field">
            <span className="text-secondary">Usuario</span>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu usuario"
              required
            />
          </label>
          {isRegister && (
            <label className="login-modal__field">
              <span className="text-secondary">Correo</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
              />
            </label>
          )}
          <label className="login-modal__field">
            <span className="text-secondary">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          {isRegister && (
            <label className="login-modal__field">
              <span className="text-secondary">Repetir contraseña</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>
          )}
          {registerError && (
            <div style={{color:'#e11d48', fontWeight:600, margin:'8px 0 0 0', fontSize:'1.01rem'}}>{registerError}</div>
          )}
          <div style={{display:'flex', gap:12, marginTop:18, alignItems:'center'}}>
            <button type="submit">
              {isRegister ? 'Registrarse' : 'Entrar'}
            </button>
            <button type="button" className="hoteles-btn" style={{width:'100%'}} onClick={() => onClose?.()}>
              Cancelar
            </button>
          </div>
        </form>
        <div style={{marginTop:18, textAlign:'center'}}>
          {isRegister ? (
            <span>¿Ya tienes cuenta? <button style={{color:'#2563eb', background:'none', border:'none', fontWeight:700, cursor:'pointer'}} onClick={()=>{setIsRegister(false); setRegisterError('');}}>Inicia sesión</button></span>
          ) : (
            <span>¿No tienes cuenta? <button style={{color:'#2563eb', background:'none', border:'none', fontWeight:700, cursor:'pointer'}} onClick={()=>{setIsRegister(true); setRegisterError('');}}>Regístrate</button></span>
          )}
        </div>
      </div>
    </div>
  );
}
