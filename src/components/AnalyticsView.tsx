import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Filter, PieChart, Activity, Target, Zap, Brain, Eye } from 'lucide-react';
import { Publication, Project } from '../types';

interface AnalyticsViewProps {
  publications: Publication[];
  activeProject: Project | null;
}

export function AnalyticsView({ publications, activeProject }: AnalyticsViewProps) {
  const [timeFilter, setTimeFilter] = useState('all');
  const [metricFilter, setMetricFilter] = useState('tone');
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);

  if (!activeProject) {
    return (
      <div className="p-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-10 h-10 text-gray-500" />
        </div>
        <h3 className="text-2xl font-semibold serif text-gray-200 mb-4">Selecciona un proyecto</h3>
        <p className="text-gray-400 leading-relaxed">Elige un proyecto para ver análisis y tendencias</p>
      </div>
    );
  }

  const projectPublications = publications.filter(pub => pub.projectId === activeProject.id);

  // Analytics calculations
  const totalViews = projectPublications.reduce((sum, pub) => sum + (pub.performance?.views || 0), 0);
  const totalEngagement = projectPublications.reduce((sum, pub) => sum + (pub.performance?.engagement || 0), 0);
  const avgEngagementRate = projectPublications.length > 0 
    ? (totalEngagement / totalViews * 100).toFixed(1) 
    : '0';
  
  // Advanced analytics calculations
  const avgReadability = projectPublications.length > 0
    ? (projectPublications.reduce((sum, pub) => sum + (pub.analysis.readability || 0), 0) / projectPublications.length).toFixed(1)
    : '0';
  
  const avgSeoScore = projectPublications.length > 0
    ? (projectPublications.reduce((sum, pub) => sum + (pub.analysis.seoScore || 0), 0) / projectPublications.length).toFixed(1)
    : '0';
  
  const contentVelocity = projectPublications.length > 0
    ? (projectPublications.length / Math.max(1, Math.ceil((Date.now() - Math.min(...projectPublications.map(p => p.publishedAt.getTime()))) / (1000 * 60 * 60 * 24 * 30)))).toFixed(1)
    : '0';
  
  const topPerformingContent = projectPublications
    .filter(pub => pub.performance)
    .sort((a, b) => (b.performance?.views || 0) - (a.performance?.views || 0))
    .slice(0, 3);

  // Tone distribution
  const toneDistribution = projectPublications.reduce((acc, pub) => {
    acc[pub.analysis.tone] = (acc[pub.analysis.tone] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Emotion distribution
  const emotionDistribution = projectPublications.reduce((acc, pub) => {
    acc[pub.analysis.emotion] = (acc[pub.analysis.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Theme frequency
  const themeFrequency = projectPublications.reduce((acc, pub) => {
    pub.analysis.keyThemes.forEach(theme => {
      acc[theme] = (acc[theme] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topThemes = Object.entries(themeFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  const getDistributionData = () => {
    return metricFilter === 'tone' ? toneDistribution : emotionDistribution;
  };

  const getColorForIndex = (index: number) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500', 
      'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-gray-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="animate-slide-up">
            <h1 className="text-4xl font-bold serif text-gray-100 mb-3">Visión Estratégica</h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
              Inteligencia profunda de tu estrategia de contenido. Los datos que revelan patrones.
            </p>
          </div>
          
          <div className="flex items-center space-x-4 animate-scale-in">
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-3 bg-gray-900/50 border nyt-border rounded-lg text-gray-100 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
              >
                <option value="all">Todo el tiempo</option>
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 3 meses</option>
                <option value="1y">Último año</option>
              </select>
            </div>
            <button
              onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
              className={`px-4 py-3 rounded-lg border transition-all duration-200 flex items-center space-x-2 ${
                showAdvancedMetrics 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                  : 'bg-gray-900/50 border-gray-800/60 text-gray-400 hover:text-gray-200'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>Métricas Avanzadas</span>
            </button>
          </div>
        </div>

        {projectPublications.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-semibold serif text-gray-200 mb-4">No hay datos para analizar</h3>
            <p className="text-gray-400 leading-relaxed max-w-md mx-auto">
              Publica contenido para comenzar a ver análisis y tendencias que guíen tu estrategia
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className={`grid gap-6 ${showAdvancedMetrics ? 'grid-cols-1 md:grid-cols-4 lg:grid-cols-8' : 'grid-cols-1 md:grid-cols-4'}`}>
              {[
                {
                  label: 'Total Publicaciones',
                  value: projectPublications.length.toString(),
                  icon: BarChart3,
                  color: 'blue'
                },
                {
                  label: 'Total Vistas',
                  value: totalViews.toLocaleString(),
                  icon: TrendingUp,
                  color: 'green'
                },
                {
                  label: 'Interacciones',
                  value: totalEngagement.toString(),
                  icon: Activity,
                  color: 'purple'
                },
                {
                  label: 'Tasa de Interacción',
                  value: `${avgEngagementRate}%`,
                  icon: PieChart,
                  color: 'amber'
                },
                ...(showAdvancedMetrics ? [
                  {
                    label: 'Legibilidad Promedio',
                    value: `${avgReadability}%`,
                    icon: Eye,
                    color: 'purple'
                  },
                  {
                    label: 'SEO Score Promedio',
                    value: `${avgSeoScore}%`,
                    icon: Target,
                    color: 'green'
                  },
                  {
                    label: 'Velocidad de Contenido',
                    value: `${contentVelocity}/mes`,
                    icon: Zap,
                    color: 'blue'
                  },
                  {
                    label: 'Mejor Rendimiento',
                    value: topPerformingContent[0] ? `${topPerformingContent[0].performance?.views.toLocaleString()}` : '0',
                    icon: TrendingUp,
                    color: 'red'
                  }
                ] : [])
              ].map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.label}
                    className="glass-effect rounded-xl p-6 border nyt-border hover-lift animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400 mb-2">{metric.label}</p>
                        <p className="text-3xl font-bold text-gray-100">{metric.value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-${metric.color}-500/10 rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${metric.color}-400`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Advanced Metrics Section */}
            {showAdvancedMetrics && (
              <div className="space-y-8">
                {/* Content Performance Ranking */}
                <div className="glass-effect rounded-xl border nyt-border p-6 animate-slide-up">
                  <h3 className="text-xl font-semibold serif text-gray-100 mb-6">Top Contenido por Rendimiento</h3>
                  <div className="space-y-4">
                    {topPerformingContent.map((publication, index) => {
                      const rank = index + 1;
                      const getRankColor = (rank: number) => {
                        switch (rank) {
                          case 1: return 'text-amber-400 bg-amber-500/10';
                          case 2: return 'text-gray-300 bg-gray-500/10';
                          case 3: return 'text-orange-400 bg-orange-500/10';
                          default: return 'text-gray-400 bg-gray-600/10';
                        }
                      };
                      
                      return (
                        <div 
                          key={publication.id} 
                          className="flex items-center space-x-4 p-4 bg-gray-900/30 rounded-xl hover:bg-gray-800/40 transition-all duration-200 animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getRankColor(rank)}`}>
                            {rank}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-100 mb-1">{publication.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>{publication.platform}</span>
                              <span>{publication.publishedAt.toLocaleDateString()}</span>
                              <span className="text-amber-400">{publication.analysis.tone}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-100">{publication.performance?.views.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">{publication.performance?.engagement} interacciones</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Content Quality Trends */}
                <div className="glass-effect rounded-xl border nyt-border p-6 animate-slide-up">
                  <h3 className="text-xl font-semibold serif text-gray-100 mb-6">Tendencias de Calidad</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-900/30 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-100 mb-4">Legibilidad por Mes</h4>
                      <div className="space-y-3">
                        {projectPublications.slice(0, 3).map((pub, index) => (
                          <div key={pub.id} className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">{pub.publishedAt.toLocaleDateString()}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-800 rounded-full h-2">
                                <div 
                                  className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                                  style={{ width: `${pub.analysis.readability || 0}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-300 w-8">{pub.analysis.readability || 0}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-900/30 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-100 mb-4">SEO Score Evolución</h4>
                      <div className="space-y-3">
                        {projectPublications.slice(0, 3).map((pub, index) => (
                          <div key={pub.id} className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">{pub.publishedAt.toLocaleDateString()}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-800 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                  style={{ width: `${pub.analysis.seoScore || 0}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-300 w-8">{pub.analysis.seoScore || 0}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-900/30 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-100 mb-4">Engagement Rate</h4>
                      <div className="space-y-3">
                        {projectPublications.slice(0, 3).map((pub, index) => {
                          const engagementRate = pub.performance 
                            ? ((pub.performance.engagement / pub.performance.views) * 100).toFixed(1)
                            : '0';
                          return (
                            <div key={pub.id} className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">{pub.publishedAt.toLocaleDateString()}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-800 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min(100, parseFloat(engagementRate) * 10)}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-300 w-8">{engagementRate}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tone/Emotion Distribution */}
              <div className="glass-effect rounded-xl border nyt-border p-6 animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold serif text-gray-100">Distribución de Contenido</h3>
                  <select
                    value={metricFilter}
                    onChange={(e) => setMetricFilter(e.target.value)}
                    className="px-3 py-2 bg-gray-900/50 border nyt-border rounded-lg text-sm text-gray-100 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                  >
                    <option value="tone">Por Tono</option>
                    <option value="emotion">Por Emoción</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {Object.entries(getDistributionData()).map(([key, value], index) => {
                    const percentage = ((value / projectPublications.length) * 100).toFixed(1);
                    return (
                      <div 
                        key={key} 
                        className="flex items-center justify-between animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded ${getColorForIndex(index)}`}></div>
                          <span className="text-sm font-medium text-gray-300">{key}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-800 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getColorForIndex(index)} transition-all duration-1000`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400 w-12 text-right font-medium">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Themes */}
              <div className="glass-effect rounded-xl border nyt-border p-6 animate-slide-up">
                <h3 className="text-xl font-semibold serif text-gray-100 mb-6">Temas Más Frecuentes</h3>
                <div className="space-y-4">
                  {topThemes.map(([theme, count], index) => {
                    const percentage = ((count / projectPublications.length) * 100).toFixed(1);
                    return (
                      <div 
                        key={theme} 
                        className="flex items-center justify-between animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <span className="text-sm font-medium text-gray-300">{theme}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-gray-800 rounded-full h-2">
                            <div 
                              className="bg-amber-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400 w-8 text-right font-medium">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Publications Timeline */}
            <div className="glass-effect rounded-xl border nyt-border p-6 animate-slide-up">
              <h3 className="text-xl font-semibold serif text-gray-100 mb-6">Línea de Tiempo Editorial</h3>
              <div className="space-y-4">
                {projectPublications
                  .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
                  .slice(0, 5)
                  .map((publication, index) => (
                    <div 
                      key={publication.id} 
                      className="flex items-center space-x-6 p-5 bg-gray-900/30 rounded-xl hover:bg-gray-800/40 transition-all duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-100 mb-2 serif">{publication.title}</h4>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-400">{publication.publishedAt.toLocaleDateString()}</span>
                          <span className="text-sm text-amber-400 font-medium">{publication.platform}</span>
                          <span className="text-sm text-gray-500">{publication.analysis.tone}</span>
                        </div>
                      </div>
                      {publication.performance && (
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-100">{publication.performance.views.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">vistas • {publication.performance.engagement} interacciones</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}