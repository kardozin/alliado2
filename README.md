# Allia.do - Centro de Comando de Contenido Estratégico

**Plataforma inteligente de gestión de contenido impulsada por IA para creadores, empresas y estrategas digitales.**

## 🚀 Descripción

Allia.do es una aplicación web moderna que revoluciona la forma en que capturas, desarrollas y publicas contenido estratégico. Utilizando inteligencia artificial avanzada (OpenAI GPT-4), la plataforma te permite gestionar todo el ciclo de vida del contenido desde la idea inicial hasta la publicación final en múltiples plataformas.

### ✨ Características Principales

- **🧠 Captura Inteligente de Ideas**: Desde texto, URLs, feeds RSS o ideas directas
- **⚡ Generación de Contenido con IA**: Borradores completos generados automáticamente
- **🎯 Análisis de Contenido Avanzado**: Métricas de legibilidad, SEO, tono y consistencia de voz
- **🔄 Optimización Inteligente**: Mejoras automáticas basadas en análisis de IA
- **📱 Adaptación Multi-Plataforma**: Convierte contenido para YouTube, Instagram, LinkedIn, Twitter, etc.
- **📊 Analytics Profundo**: Insights de escritura y patrones de contenido
- **🎨 Gestión de Voz y Tono**: Mantén consistencia en todos tus proyectos
- **📚 Base de Conocimiento**: Documentos de referencia para contexto personalizado

## 🏗️ Arquitectura Técnica

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para diseño responsivo
- **Tiptap** para edición de texto enriquecido
- **Lucide React** para iconografía
- **Vite** como bundler y servidor de desarrollo

### Backend & Base de Datos
- **Supabase** como backend-as-a-service
- **PostgreSQL** con Row Level Security (RLS)
- **Autenticación** con email/password
- **Real-time subscriptions** para actualizaciones en vivo

### Inteligencia Artificial
- **OpenAI GPT-4** para generación de contenido
- **Análisis de sentimientos** y métricas de legibilidad
- **Optimización automática** de contenido
- **Adaptación contextual** para diferentes plataformas

## 📋 Requisitos Previos

- Node.js 18+ 
- Cuenta de Supabase
- API Key de OpenAI
- Navegador moderno con soporte para ES2020+

## 🛠️ Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd alliado2
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_OPENAI_API_KEY=tu_openai_api_key
```

### 4. Configurar Base de Datos
Las migraciones de Supabase se encuentran en `/supabase/migrations/`. Ejecuta:

```bash
# Si usas Supabase CLI
supabase db reset

# O aplica las migraciones manualmente en tu dashboard de Supabase
```

### 5. Ejecutar en Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

#### `projects`
- Contenedores de proyectos con configuración específica
- Guías de estilo, audiencia objetivo, tono de voz
- Documentos de referencia y feeds RSS

#### `ideas`
- Ideas capturadas desde múltiples fuentes
- Conexión con proyectos específicos
- Estados: captured, in-progress, completed

#### `drafts`
- Borradores generados por IA o creados manualmente
- Versionado automático
- Análisis de contenido opcional

#### `publications`
- Contenido finalizado y publicado
- Métricas de rendimiento
- Conexión con ideas originales para rastreo completo

## 🎯 Flujo de Trabajo

### 1. **Gestión de Proyectos**
- Crea proyectos temáticos con configuración específica
- Define audiencia, tono y guías de estilo
- Sube documentos de referencia

### 2. **Captura de Ideas**
- **Directa**: Escribe ideas manualmente
- **Desde URL**: Analiza artículos web
- **Texto**: Procesa contenido existente
- **RSS**: Monitorea feeds automáticamente

### 3. **Generación de Contenido**
- La IA genera borradores completos basados en:
  - La idea original
  - Configuración del proyecto
  - Documentos de referencia
  - Guías de estilo específicas

### 4. **Edición y Optimización**
- Editor de texto enriquecido con formato avanzado
- Análisis automático de:
  - Legibilidad y complejidad
  - Optimización SEO
  - Consistencia de tono
  - Temas clave identificados

### 5. **Adaptación Multi-Plataforma**
- Convierte contenido para diferentes plataformas:
  - **YouTube**: Guiones con ganchos y estructura
  - **Instagram**: Posts visuales con hashtags
  - **LinkedIn**: Contenido profesional
  - **Twitter**: Hilos optimizados
  - **Substack**: Newsletters expandidos

### 6. **Publicación y Analytics**
- Guarda como publicación final
- Rastrea métricas de rendimiento
- Analiza patrones de escritura
- Insights de consistencia de voz

## 🔧 Componentes Principales

### `Sidebar`
- Navegación principal
- Selector de proyectos
- Configuración rápida

### `IdeasView`
- Captura y gestión de ideas
- Indicadores de progreso
- Generación de borradores

### `DraftsView`
- Editor de contenido avanzado
- Análisis y optimización
- Adaptación para plataformas

### `PublicationsView`
- Archivo editorial
- Métricas de rendimiento
- Re-adaptación de contenido

### `AnalyticsView`
- Insights de escritura
- Patrones de contenido
- Métricas de consistencia

## 🎨 Características de Diseño

- **Tema Oscuro Elegante**: Inspirado en herramientas editoriales profesionales
- **Tipografía Dual**: Inter para UI, Crimson Text para contenido editorial
- **Animaciones Sutiles**: Micro-interacciones que mejoran la experiencia
- **Responsive Design**: Optimizado para desktop y móvil
- **Accesibilidad**: Contraste adecuado y navegación por teclado

## 🔐 Seguridad

- **Row Level Security (RLS)** en todas las tablas
- **Autenticación segura** con Supabase Auth
- **Validación de datos** en frontend y backend
- **Sanitización de contenido** para prevenir XSS

## 📊 Métricas y Analytics

### Análisis de Contenido
- **Legibilidad**: Puntuación de facilidad de lectura
- **SEO Score**: Optimización para motores de búsqueda
- **Consistencia de Voz**: Adherencia a guías de estilo
- **Temas Clave**: Identificación automática de topics

### Insights de Escritura
- **Patrones Únicos**: Identificación de estilo personal
- **Evolución Temporal**: Mejora en métricas a lo largo del tiempo
- **Distribución de Tono**: Análisis de emociones en contenido
- **Velocidad de Contenido**: Productividad editorial

## 🚀 Roadmap Futuro

- [ ] **Integración con APIs de Redes Sociales** para publicación directa
- [ ] **Colaboración en Tiempo Real** para equipos
- [ ] **Templates Inteligentes** basados en industria
- [ ] **Análisis de Competencia** automático
- [ ] **Programación de Contenido** con calendario editorial
- [ ] **Métricas de Engagement** en tiempo real
- [ ] **Exportación Avanzada** (PDF, DOCX, etc.)

## 🤝 Contribución

Este proyecto fue creado por **Marcelo Cardozo** e implementado completamente por IA. 

### Tecnologías Utilizadas
- React 18 + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- OpenAI GPT-4
- Tiptap Editor
- Vite

## 📄 Licencia

© 2025 Marcelo Cardozo. Implementado por IA.

---

**Allia.do** - Donde las ideas se transforman en contenido estratégico que conecta, convierte y construye audiencias.