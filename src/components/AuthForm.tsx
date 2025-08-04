import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthFormProps {
  onClose?: () => void;
}

export function AuthForm({ onClose }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setError('La aplicación no está configurada correctamente. Las variables de entorno de Supabase no están disponibles. Por favor, contacta al administrador para configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Netlify.');
      setLoading(false);
      return;
    }
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('User already registered')) {
            setError('Este email ya está registrado. Intenta iniciar sesión en su lugar.');
          } else if (error.message.includes('Password should be at least')) {
            setError('La contraseña debe tener al menos 6 caracteres.');
          } else {
            setError(`Error al crear cuenta: ${error.message}`);
          }
        } else {
          setSuccess('¡Cuenta creada exitosamente! Revisa tu email para confirmar tu cuenta antes de iniciar sesión.');
          setIsSignUp(false);
          setEmail('');
          setPassword('');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Credenciales incorrectas. Verifica tu email y contraseña.');
          } else if (error.message.includes('Email not confirmed')) {
            setError('Tu email no ha sido confirmado. Revisa tu bandeja de entrada y haz clic en el enlace de confirmación.');
          } else if (error.message.includes('Too many requests')) {
            setError('Demasiados intentos. Espera unos minutos antes de intentar nuevamente.');
          } else {
            setError(`Error al iniciar sesión: ${error.message}`);
          }
        }
      }
    } catch (err) {
      setError('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
              <span className="text-3xl font-bold serif text-black">A</span>
            </div>
            <h1 className="text-3xl font-bold serif text-gray-100">Allia.do</h1>
          </div>
          <p className="text-gray-400 text-lg leading-relaxed">
            Centro de Comando de Contenido Estratégico
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-950 rounded-2xl p-8 border border-gray-800/60 animate-scale-in shadow-2xl">
          {/* Close button */}
          <div className="relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-200 transition-all duration-200 hover:bg-gray-800/50 rounded-lg hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold serif text-gray-100 mb-2">
              {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h2>
            <p className="text-gray-400">
              {isSignUp 
                ? 'Únete a la revolución del contenido estratégico' 
                : 'Accede a tu centro de comando editorial'
              }
            </p>
          </div>

          {/* Configuration Warning */}
          {(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) && (
            <div className="mb-6 p-4 bg-gray-800/30 border border-gray-700/40 rounded-lg animate-fade-in">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm font-medium">Configuración Requerida</p>
                  <p className="text-gray-400 text-xs">
                    Las variables de entorno de Supabase no están configuradas. 
                    Contacta al administrador para configurar la base de datos.
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-gray-800/30 border border-gray-700/40 rounded-lg flex items-center space-x-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-gray-300 flex-shrink-0" />
              <p className="text-gray-300 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-gray-800/30 border border-gray-700/40 rounded-lg flex items-center space-x-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-gray-300 flex-shrink-0" />
              <p className="text-gray-300 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-800/60 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                  className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-800/60 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400/50 transition-all duration-200"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-900/50 border border-gray-800/60 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400/50 transition-all duration-200"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {isSignUp && (
                <p className="text-xs text-gray-500 mt-2">
                  Mínimo 6 caracteres
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>{isSignUp ? 'Creando cuenta...' : 'Iniciando sesión...'}</span>
                </div>
              ) : (
                isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Toggle Form */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              {isSignUp ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
            </p>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
              className="text-gray-300 hover:text-gray-100 transition-colors duration-200 font-medium mt-2"
            >
              {isSignUp ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </div>
        </div>
      </div>
    </>
      </div>
    </div>
  );
}