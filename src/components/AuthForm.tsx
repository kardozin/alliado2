import React, { useState } from 'react';
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AuthForm() {
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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-gray-900" />
            </div>
            <h1 className="text-3xl font-bold serif text-gray-100">Allia.do</h1>
          </div>
          <p className="text-gray-400 text-lg leading-relaxed">
            Centro de Comando de Contenido Estratégico
          </p>
        </div>

        {/* Form */}
        <div className="glass-effect rounded-2xl p-8 border border-gray-800/60 animate-slide-up">
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

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-400 text-sm">{success}</p>
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
                  className="w-full pl-12 pr-12 py-4 bg-gray-900/50 border border-gray-800/60 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
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
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 py-4 rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all duration-200 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
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
              className="text-amber-400 hover:text-amber-300 transition-colors duration-200 font-medium mt-2"
            >
              {isSignUp ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 animate-fade-in">
          <p className="text-xs text-gray-500">
            Creado por{' '}
            <span className="text-amber-400 font-medium">Marcelo Cardozo</span>
            <br />
            Implementado por IA © 2025
          </p>
        </div>
      </div>
    </div>
  );
}