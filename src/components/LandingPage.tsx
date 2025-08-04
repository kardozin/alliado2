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
  Users,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted?: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Lightbulb,
      title: 'Captura Inteligente de Ideas',
      description: 'Desde texto, URLs, feeds RSS o ideas directas. La inspiración nunca se pierde.'
    },
    {
      icon: Brain,
      title: 'Generación con IA',
      description: 'OpenAI GPT-4 crea borradores completos basados en tu configuración de proyecto.'
    },
    {
      icon: Target,
      title: 'Análisis Profundo',
      description: 'Métricas de legibilidad, SEO, tono y consistencia de voz automáticas.'
    },
    {
      icon: Globe,
      title: 'Adaptación Multi-Plataforma',
      description: 'Convierte contenido para YouTube, Instagram, LinkedIn, Twitter y más.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Avanzado',
      description: 'Insights de escritura y patrones de contenido que guían tu estrategia.'
    },
    {
      icon: Shield,
      title: 'Gestión de Voz',
      description: 'Mantén consistencia en todos tus proyectos con guías de estilo personalizadas.'
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
      <div className="max-w-4xl mx-auto px-8 py-20">
        <div className="text-center animate-fade-in">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center">
              <span className="text-3xl font-bold serif text-black">A</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold serif text-gray-100">
              Allia.do
            </h1>
          </div>

          {/* Tagline */}
          <h2 className="text-3xl lg:text-4xl font-semibold serif text-gray-200 mb-8 leading-tight max-w-3xl mx-auto">
            Centro de Comando de Contenido Estratégico
          </h2>
          
          <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">
            Plataforma inteligente de gestión de contenido impulsada por IA para creadores, 
            empresas y estrategas digitales. Desde la idea hasta la publicación.
          </p>

          {/* CTA Button */}
          {onGetStarted && (
            <button
              onClick={onGetStarted}
              className="bg-gray-200 text-black px-12 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 flex items-center space-x-3 mx-auto"
            >
              <span>Comenzar Ahora</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-8 py-20 border-t border-gray-800/60">
        <div className="text-center mb-16 animate-slide-up">
          <h3 className="text-3xl font-bold serif text-gray-100 mb-6">
            Funcionalidades Principales
          </h3>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Todo lo que necesitas para crear, optimizar y publicar contenido estratégico
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-effect rounded-xl p-8 border nyt-border hover:bg-gray-800/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-gray-300" />
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
      <div className="bg-gray-900/20 py-20 border-t border-gray-800/60">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h3 className="text-3xl font-bold serif text-gray-100 mb-6">
              Flujo de Trabajo
            </h3>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Desde la captura de ideas hasta la publicación final, cada paso está optimizado para máxima eficiencia
            </p>
          </div>

          <div className="space-y-8">
            {workflow.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="flex items-start space-x-6 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                    <span className="text-lg font-bold text-black">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold serif text-gray-100 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="max-w-4xl mx-auto px-8 py-20 border-t border-gray-800/60">
        <div className="text-center mb-16 animate-slide-up">
          <h3 className="text-3xl font-bold serif text-gray-100 mb-6">
            Tecnología
          </h3>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Construido con tecnologías modernas para garantizar rendimiento y seguridad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'OpenAI GPT-4', description: 'Generación de contenido avanzada' },
            { name: 'React + TypeScript', description: 'Frontend moderno y tipado' },
            { name: 'Supabase', description: 'Backend escalable y seguro' },
            { name: 'Tailwind CSS', description: 'Diseño responsivo y elegante' }
          ].map((tech, index) => (
            <div
              key={tech.name}
              className="glass-effect rounded-xl p-6 border nyt-border text-center hover:bg-gray-800/20 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h4 className="font-semibold text-gray-100 mb-2">{tech.name}</h4>
              <p className="text-sm text-gray-400">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-8 py-20 border-t border-gray-800/60">
        <div className="glass-effect rounded-2xl p-12 border nyt-border text-center animate-slide-up">
          <h3 className="text-3xl font-bold serif text-gray-100 mb-6">
            ¿Listo para Revolucionar tu Contenido?
          </h3>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Únete a la nueva era de creación de contenido estratégico. 
            Donde las ideas se transforman en contenido que conecta, convierte y construye audiencias.
          </p>
          {onGetStarted && (
            <button
              onClick={onGetStarted}
              className="bg-gray-200 text-black px-12 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 flex items-center space-x-3 mx-auto"
            >
              <span>Comenzar Gratis</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800/60 py-12">
        <div className="max-w-4xl mx-auto px-8 text-center">
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