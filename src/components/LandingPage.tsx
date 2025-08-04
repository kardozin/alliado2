import React from 'react';
import { 
  Lightbulb, 
  FileText, 
  Send, 
  BarChart3, 
  Zap, 
  Brain, 
  Target, 
  Globe,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Users,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Lightbulb,
      title: 'Captura Inteligente de Ideas',
      description: 'Desde texto, URLs, feeds RSS o ideas directas. La inspiración nunca se pierde.',
      color: 'amber'
    },
    {
      icon: Brain,
      title: 'Generación con IA',
      description: 'OpenAI GPT-4 crea borradores completos basados en tu configuración de proyecto.',
      color: 'purple'
    },
    {
      icon: Target,
      title: 'Análisis Profundo',
      description: 'Métricas de legibilidad, SEO, tono y consistencia de voz automáticas.',
      color: 'green'
    },
    {
      icon: Globe,
      title: 'Adaptación Multi-Plataforma',
      description: 'Convierte contenido para YouTube, Instagram, LinkedIn, Twitter y más.',
      color: 'blue'
    },
    {
      icon: BarChart3,
      title: 'Analytics Avanzado',
      description: 'Insights de escritura y patrones de contenido que guían tu estrategia.',
      color: 'indigo'
    },
    {
      icon: Shield,
      title: 'Gestión de Voz',
      description: 'Mantén consistencia en todos tus proyectos con guías de estilo personalizadas.',
      color: 'red'
    }
  ];

  const workflow = [
    {
      step: 1,
      title: 'Crea Proyectos',
      description: 'Define audiencia, tono y guías de estilo específicas',
      icon: Users
    },
    {
      step: 2,
      title: 'Captura Ideas',
      description: 'Desde múltiples fuentes: directa, URL, texto o RSS',
      icon: Lightbulb
    },
    {
      step: 3,
      title: 'Genera Contenido',
      description: 'IA crea borradores completos basados en tu configuración',
      icon: Zap
    },
    {
      step: 4,
      title: 'Edita y Optimiza',
      description: 'Editor avanzado con análisis y sugerencias de mejora',
      icon: FileText
    },
    {
      step: 5,
      title: 'Adapta y Publica',
      description: 'Convierte para diferentes plataformas y guarda como final',
      icon: Send
    },
    {
      step: 6,
      title: 'Analiza Resultados',
      description: 'Insights profundos de tu estrategia de contenido',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 overflow-y-auto">
      {/* Hero Section */}
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-gray-950 to-purple-500/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-8 py-20">
          <div className="text-center animate-fade-in">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-3xl font-bold serif text-black">A</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold serif text-gray-100">
                Allia.do
              </h1>
            </div>

            {/* Tagline */}
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-300 mb-6 leading-tight">
              Centro de Comando de Contenido Estratégico
            </h2>
            
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Plataforma inteligente de gestión de contenido impulsada por IA para creadores, 
              empresas y estrategas digitales. Desde la idea hasta la publicación.
            </p>

            {/* CTA Button */}
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-12 py-4 rounded-xl text-lg font-bold hover:from-amber-400 hover:to-amber-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-3 mx-auto"
            >
              <Sparkles className="w-6 h-6" />
              <span>Comenzar Ahora</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16 animate-slide-up">
          <h3 className="text-3xl lg:text-4xl font-bold serif text-gray-100 mb-6">
            Funcionalidades Principales
          </h3>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Todo lo que necesitas para crear, optimizar y publicar contenido estratégico de clase mundial
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-effect rounded-2xl p-8 border border-gray-800/60 hover:border-gray-700/60 transition-all duration-300 hover:transform hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-${feature.color}-500/10 rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon className={`w-8 h-8 text-${feature.color}-400`} />
                </div>
                <h4 className="text-xl font-semibold serif text-gray-100 mb-4">
                  {feature.title}
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workflow Section */}
      <div className="bg-gray-900/20 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h3 className="text-3xl lg:text-4xl font-bold serif text-gray-100 mb-6">
              Flujo de Trabajo Inteligente
            </h3>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Desde la captura de ideas hasta la publicación final, cada paso está optimizado para máxima eficiencia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workflow.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="relative animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Connection line */}
                  {index < workflow.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-gray-600 to-transparent z-10"></div>
                  )}
                  
                  <div className="glass-effect rounded-2xl p-6 border border-gray-800/60 hover:border-gray-700/60 transition-all duration-300 relative">
                    {/* Step number */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg">
                      {step.step}
                    </div>
                    
                    <div className="pt-4">
                      <Icon className="w-12 h-12 text-amber-400 mb-4" />
                      <h4 className="text-lg font-semibold serif text-gray-100 mb-3">
                        {step.title}
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16 animate-slide-up">
          <h3 className="text-3xl lg:text-4xl font-bold serif text-gray-100 mb-6">
            Tecnología de Vanguardia
          </h3>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Construido con las mejores tecnologías para garantizar rendimiento, seguridad y escalabilidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'OpenAI GPT-4', description: 'Generación de contenido avanzada', color: 'green' },
            { name: 'React + TypeScript', description: 'Frontend moderno y tipado', color: 'blue' },
            { name: 'Supabase', description: 'Backend escalable y seguro', color: 'emerald' },
            { name: 'Tailwind CSS', description: 'Diseño responsivo y elegante', color: 'cyan' }
          ].map((tech, index) => (
            <div
              key={tech.name}
              className="glass-effect rounded-xl p-6 border border-gray-800/60 text-center hover:border-gray-700/60 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 bg-${tech.color}-500/10 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <CheckCircle className={`w-6 h-6 text-${tech.color}-400`} />
              </div>
              <h4 className="font-semibold text-gray-100 mb-2">{tech.name}</h4>
              <p className="text-sm text-gray-400">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900/20 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { number: '10x', label: 'Más Rápido', description: 'Generación de contenido vs. manual' },
              { number: '95%', label: 'Consistencia', description: 'En voz y tono de marca' },
              { number: '∞', label: 'Plataformas', description: 'Adaptación ilimitada de contenido' }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-5xl lg:text-6xl font-bold serif text-amber-400 mb-4">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-gray-100 mb-2">
                  {stat.label}
                </div>
                <div className="text-gray-400">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="glass-effect rounded-3xl p-12 border border-gray-800/60 text-center animate-slide-up">
          <h3 className="text-3xl lg:text-4xl font-bold serif text-gray-100 mb-6">
            ¿Listo para Revolucionar tu Contenido?
          </h3>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Únete a la nueva era de creación de contenido estratégico. 
            Donde las ideas se transforman en contenido que conecta, convierte y construye audiencias.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-12 py-4 rounded-xl text-lg font-bold hover:from-amber-400 hover:to-amber-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-3 mx-auto"
          >
            <Zap className="w-6 h-6" />
            <span>Comenzar Gratis</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800/60 py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold serif text-black">A</span>
            </div>
            <span className="text-2xl font-bold serif text-gray-100">Allia.do</span>
          </div>
          <p className="text-gray-500 text-sm">
            Creado por{' '}
            <span className="text-gray-300 font-medium">Marcelo Cardozo</span>
            {' • '}
            Implementado por IA © 2025
          </p>
        </div>
      </div>
    </div>
  );
}