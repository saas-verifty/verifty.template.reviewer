# Verifty Template Reviewer - IPEVR Bulk Upload

Sistema de carga masiva y validación de archivos Excel para IPEVR (Identificación de Peligros, Evaluación y Valoración de Riesgos).

## 🎯 Características Principales

### Funcionalidades

- **Carga de archivos Excel (.xlsx, .xls)** con validación automática
- **Tabla editable interactiva** estilo Excel con validación en tiempo real
- **Validación de datos** según catálogos y reglas de negocio
- **Selects inteligentes** con búsqueda y filtrado en cascada para peligros
- **Generación de JSON** con estructura jerárquica (proceso → actividad → subactividad → peligros)
- **Integración con AWS S3** para subida de archivos (configurable)
- **Feature Flags** para habilitar/deshabilitar funcionalidades sin redesplegar

### Stack Técnico

- **React 18** con TypeScript
- **Vite** para desarrollo rápido
- **Tailwind CSS** con sistema de diseño personalizado
- **AWS SDK v3** para S3
- **ExcelJS** para procesamiento de archivos
- **Feature-based architecture**
- **Trunk-Based Development** con Feature Flags

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git configurado con email @verifty.com

### Instalación

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd verifty.template.reviewer

# 2. Configurar email corporativo (REQUERIDO)
git config user.email tu.nombre@verifty.com

# 3. Instalar dependencias
npm install

# 4. Configurar pre-commit hooks
npm run prepare

# 5. Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores
```

### Configuración de Variables de Entorno

Edita el archivo `.env`:

```bash
# Feature Flags
VITE_FEATURE_BULK_UPLOAD_ENABLED=true  # Habilita/deshabilita la funcionalidad
VITE_AWS_UPLOAD_ENABLED=false          # false = descarga local, true = sube a S3

# AWS S3 (opcional, solo si VITE_AWS_UPLOAD_ENABLED=true)
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=tu_access_key
VITE_AWS_SECRET_ACCESS_KEY=tu_secret_key
VITE_S3_BUCKET_NAME=tu-bucket-name
```

### Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:5173

## 📋 Cómo Usar la Aplicación

### 1. Preparar el Archivo Excel

El archivo debe tener la siguiente estructura:

**Hojas requeridas:**

- `Main` - Datos principales de IPEVR
- `Validation Lists` - Listas de validación (frecuencia, cargo, áreas, etc.)
- `Catalogo de Peligros` - Catálogos de peligros por tipo

**Columnas de la hoja Main:**

- proceso, actividad, subactividad
- frecuencia, personal_involucrado, cargo, area_empresa
- peligro, descripcion_peligro, descripcion_especifica_peligro, consecuencia_efecto_posible
- controles_existentes_fuente, controles_existentes_medio, controles_existentes_individuo
- nivel_deficiencia_ND, nivel_exposicion_NE, valor_consecuencia_NC

### 2. Subir y Validar

1. Haz clic en "Buscar archivo" o arrastra el Excel
2. El sistema procesará y validará automáticamente
3. Verás un resumen de errores (si los hay)
4. La tabla mostrará:
   - ✅ Celdas válidas en gris
   - ⚠️ Celdas con error en rojo claro
   - 🔵 Celdas editadas en morado

### 3. Editar Datos

- **Celdas de texto**: Haz clic para editar directamente (tipo Excel)
- **Celdas de catálogo**: Doble clic para abrir selector con búsqueda
- Los cambios se validan automáticamente

### 4. Enviar

1. Haz clic en "Enviar" (solo si no hay errores)
2. Confirma en el modal
3. El JSON se descarga automáticamente (o sube a S3 si está configurado)

## 🛠️ Scripts Disponibles

### Desarrollo

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
```

### Calidad de Código

```bash
npm run lint         # ESLint
npm run format       # Formatear con Prettier
npm run typecheck    # Verificar tipos TypeScript
```

### Testing

```bash
npm test             # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Cobertura de tests
```

## 📁 Estructura del Proyecto

```
verifty.template.reviewer/
├── public/
│   └── assets/
│       └── logo.jpeg           # Logo de Verifty
├── src/
│   ├── features/
│   │   └── data-validation/
│   │       ├── components/
│   │       │   ├── FileUploader.tsx      # Drag & drop uploader
│   │       │   ├── DataTable.tsx         # Tabla editable principal
│   │       │   ├── TableRow.tsx          # Fila de tabla con lógica
│   │       │   ├── EditableCell.tsx      # Celda editable (contentEditable)
│   │       │   ├── SelectCell.tsx        # Celda con selector + búsqueda
│   │       │   ├── ErrorSummary.tsx      # Resumen de errores
│   │       │   ├── ConfirmationModal.tsx # Modal de confirmación
│   │       │   ├── Alert.tsx             # Alertas de éxito/error
│   │       │   ├── Loader.tsx            # Spinner de carga
│   │       │   ├── ProgressIndicator.tsx # Barra de progreso
│   │       │   ├── ActionButtons.tsx     # Botones Enviar/Cancelar
│   │       │   └── FeatureDisabled.tsx   # Vista feature deshabilitada
│   │       ├── hooks/
│   │       │   ├── useFileUpload.ts      # Lógica de carga de archivos
│   │       │   ├── useTableData.ts       # Estado de tabla + validación
│   │       │   └── useValidation.ts      # Hook de validación
│   │       ├── pages/
│   │       │   └── UploadPage.tsx        # Página principal
│   │       ├── services/
│   │       │   ├── excelParser.service.ts    # Parser de Excel
│   │       │   ├── validation.service.ts     # Lógica de validación
│   │       │   ├── jsonGenerator.service.ts  # Generador de JSON
│   │       │   └── s3Upload.service.ts       # Servicio de S3
│   │       ├── types/
│   │       │   ├── excel.types.ts        # Tipos de datos Excel
│   │       │   ├── table.types.ts        # Tipos de tabla
│   │       │   └── json-output.types.ts  # Tipos de JSON output
│   │       └── constants/
│   │           └── validationRules.ts    # Reglas de validación
│   ├── components/
│   │   └── Navbar.tsx          # Navbar con logo
│   ├── config/
│   │   ├── aws.config.ts       # Configuración de AWS
│   │   └── featureFlags.config.ts  # Sistema de feature flags
│   ├── App.tsx                 # App principal
│   ├── main.tsx               # Entry point
│   └── index.css              # Estilos globales + Tailwind
├── .env                        # Variables de entorno (local)
├── .env.example               # Template de variables
├── tailwind.config.js         # Configuración de Tailwind
└── package.json
```

## 🧪 Testing

### Probar con Archivo de Ejemplo

1. Crea un archivo Excel con las hojas mencionadas arriba
2. Llena datos de prueba (puedes poner algunos errores intencionales)
3. Sube el archivo y verifica:
   - ✅ Validación automática funciona
   - ✅ Errores se muestran correctamente
   - ✅ Edición inline funciona
   - ✅ Selects con búsqueda funcionan
   - ✅ JSON se descarga con estructura correcta

### Modo Desarrollo vs Producción

**Desarrollo (VITE_AWS_UPLOAD_ENABLED=false):**

- JSON se descarga localmente
- No requiere AWS configurado
- Útil para pruebas

**Producción (VITE_AWS_UPLOAD_ENABLED=true):**

- JSON se sube a S3
- Requiere credenciales de AWS
- Para ambiente real

## 🚀 Feature Flags (Trunk-Based Development)

Este proyecto usa **Feature Flags** para desacoplar despliegue y lanzamiento:

```bash
# Deshabilitar feature completa (modo mantenimiento)
VITE_FEATURE_BULK_UPLOAD_ENABLED=false

# Cambiar entre descarga local y S3
VITE_AWS_UPLOAD_ENABLED=true
```

## 🔒 Pre-commit Hooks

Los hooks se ejecutan automáticamente en cada commit:

- ✅ Validación de email @verifty.com
- ✅ TypeScript type checking
- ✅ ESLint
- ✅ Prettier

## 📝 Convención de Commits

```
<task-id>: <descripción>

Ejemplo:
86ad2xk1h: Add JSON generation service
```

## 🤝 Contribución

1. Hacer fork del repositorio
2. Crear rama desde `trunk`: `git checkout -b feature/nueva-feature`
3. Hacer commits con convención establecida
4. Push y crear Pull Request a `trunk`
5. Esperar aprobación y merge

## 📄 Licencia

Copyright © 2024 Verifty. Todos los derechos reservados.
