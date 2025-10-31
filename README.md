# 📚 Documentación del Proyecto de Microservicios - Grupo 3

## 🎯 Introducción

Este documento contiene toda la información necesaria para comenzar el desarrollo del sistema de microservicios. El proyecto está diseñado con una arquitectura modular donde cada servicio tiene responsabilidades específicas y se comunica a través de un API Gateway centralizado.

---

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
┌─────────────┐
│   Frontend  │ (Puerto 5173)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ API Gateway │ (Puerto 8080 - Nginx)
└──────┬──────┘
       │
       ├─→ Auth Service      (Puerto 3000)
       ├─→ Products Service  (Puerto 3001)
       ├─→ Inventory Service (Puerto 3002)
       ├─→ Orders Service    (Puerto 3003)
       ├─→ Billing Service   (Puerto 3004)
       └─→ Reports Service   (Puerto 3005)
              │
              ↓
       ┌──────────┐
       │ MongoDB  │ (Puerto 27017)
       └──────────┘
```

---

## 📋 Servicios a Desarrollar

### 1️⃣ **Auth Service** (Obligatorio)
- **Responsable**: Autenticación y autorización
- **Puerto**: 3000
- **Base de datos**: `authdb`
- **Función**: Emisión y validación de tokens JWT

### 2️⃣ **Products Service** (Obligatorio)
- **Responsable**: Gestión de catálogo de productos
- **Puerto**: 3001
- **Base de datos**: `productsdb`
- **Función**: CRUD de productos

### 3️⃣ **Inventory Service** (Obligatorio)
- **Responsable**: Control de stock
- **Puerto**: 3002
- **Base de datos**: `inventorydb`
- **Función**: Gestión de inventarios

### 4️⃣ **Billing Service** (Obligatorio)
- **Responsable**: Facturación
- **Puerto**: 3004
- **Base de datos**: `billingdb`
- **Función**: Generación de facturas

### 5️⃣ **API Gateway** (Obligatorio)
- **Responsable**: Enrutamiento centralizado
- **Puerto**: 8080
- **Tecnología**: Nginx

### 6️⃣ **Orders Service** (Opcional)
- **Responsable**: Gestión de pedidos
- **Puerto**: 3003
- **Base de datos**: `ordersdb`
- **Función**: Procesamiento de órdenes

### 7️⃣ **Reports Service** (Opcional)
- **Responsable**: Reportes y analítica
- **Puerto**: 3005
- **Base de datos**: `reportsdb`
- **Función**: Generación de reportes consolidados

---

## 🔄 Flujo de Comunicación

### Flujo Principal (Ejemplo de Pedido)

```
1. Usuario → Frontend → API Gateway → Auth Service (Login)
   ↓ Recibe JWT Token

2. Usuario → Frontend → API Gateway → Orders Service (Crear Orden)
   ↓
   Orders Service valida token con Auth Service
   ↓
   Orders Service consulta stock en Inventory Service
   ↓
   Orders Service registra la orden

3. Sistema → Billing Service (Generar Factura)
   ↓
   Billing consulta datos de Orders Service
   ↓
   Billing genera factura

4. Sistema → Reports Service (Analizar datos)
```

---

## 🗂️ Estructura de Carpetas

```
project-root/
│
├── docker-compose.yml          # Orquestador de servicios
├── .env                        # Variables de entorno globales
│
├── gateway/
│   └── nginx.conf             # Configuración de rutas
│
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── pages/
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   └── products.html
│   └── assets/
│       ├── css/
│       │   └── styles.css
│       ├── js/
│       │   ├── main.js
│       │   ├── api.js
│       │   ├── auth.js
│       │   ├── products.js
│       │   └── utils.js
│       └── images/
│           └── logo.png
│
└── services/
    ├── auth-service/
    ├── products-service/
    ├── inventory-service/
    ├── orders-service/
    ├── billing-service/
    └── reports-service/
```

### Estructura Común de Cada Servicio

```
service-name/
├── Dockerfile
├── package.json
└── src/
    ├── index.js              # Punto de entrada
    ├── routes/               # Definición de endpoints
    │   └── service.routes.js
    ├── controllers/          # Lógica de negocio
    │   └── service.controller.js
    ├── models/              # Esquemas de datos
    │   └── service.model.js
    ├── middleware/          # Funciones intermedias
    │   └── auth.middleware.js
    ├── config/              # Configuración (DB, env)
    │   ├── db.js
    │   └── env.js
    └── utils/               # Utilidades
        └── httpClient.js
```

---

## 🔌 Endpoints por Servicio

### 🧍‍♂️ Auth Service (`/auth`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/register` | Registrar nuevo usuario |
| POST | `/auth/login` | Iniciar sesión (devuelve JWT) |
| GET | `/auth/profile` | Obtener perfil del usuario |
| GET | `/auth/validate` | Validar token JWT (interno) |

**Comunicación:**
- Provee identidad y roles a todos los servicios
- Valida tokens para Orders, Billing y Reports

---

### 📦 Products Service (`/products`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/products` | Listar todos los productos |
| GET | `/products/:id` | Obtener producto específico |
| POST | `/products` | Crear nuevo producto |
| PUT | `/products/:id` | Actualizar producto |
| DELETE | `/products/:id` | Eliminar producto |

**Comunicación:**
- Inventory Service lo consulta para validar productos
- Orders Service lo usa para obtener información de productos

---

### 🏬 Inventory Service (`/inventory`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/inventory` | Listar inventarios |
| GET | `/inventory/:productId` | Consultar stock de producto |
| POST | `/inventory` | Registrar nuevo inventario |
| PUT | `/inventory/:productId` | Actualizar stock |

**Comunicación:**
- **Inventory → Products**: Valida existencia del producto
- **Orders → Inventory**: Consulta stock disponible

---

### 🧾 Orders Service (`/orders`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/orders` | Listar todas las órdenes |
| GET | `/orders/:id` | Obtener orden específica |
| POST | `/orders` | Crear nueva orden |
| PUT | `/orders/:id/status` | Actualizar estado de orden |

**Flujo interno:**
1. Valida token JWT con Auth Service
2. Verifica stock con Inventory Service
3. Registra la orden en ordersdb

**Comunicación:**
- **Orders → Auth**: Valida autenticación
- **Orders → Inventory**: Consulta disponibilidad
- **Billing → Orders**: Usa info para generar facturas

---

### 💳 Billing Service (`/billing`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/billing` | Listar facturas |
| POST | `/billing` | Generar nueva factura |
| GET | `/billing/:orderId` | Obtener factura de una orden |

**Comunicación:**
- **Billing → Orders**: Obtiene datos de la orden
- **Billing → Auth**: Obtiene datos del usuario
- **Reports → Billing**: Consulta para reportes de ventas

---

### 📈 Reports Service (`/reports`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/reports/sales` | Reporte de ventas |
| GET | `/reports/inventory` | Reporte de inventario |
| GET | `/reports/users` | Reporte de usuarios |

**Comunicación:**
- **Reports → Billing + Orders**: Datos de ventas
- **Reports → Inventory + Products**: Análisis de stock
- **Reports → Auth**: Datos de usuarios activos

---

## ⚙️ Variables de Entorno

### Configuración Principal (`.env`)

```ini
# ===============================
# Puertos
# ===============================
MONGO_PORT=27017
MONGO_EXPRESS_PORT=8081
GATEWAY_PORT=8080
FRONTEND_PORT=5173

AUTH_PORT=3000
PRODUCTS_PORT=3001
INVENTORY_PORT=3002
ORDERS_PORT=3003
BILLING_PORT=3004
REPORTS_PORT=3005

# ===============================
# MongoDB
# ===============================
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=admin123
MONGO_URI=mongodb://admin:admin123@mongodb:27017/

# ===============================
# Mongo Express (Panel Web)
# ===============================
MONGO_EXPRESS_USER=admin
MONGO_EXPRESS_PASS=admin123

# ===============================
# Rutas internas (Servicios)
# ===============================
AUTH_SERVICE_URL=http://auth-service:3000
PRODUCTS_SERVICE_URL=http://products-service:3001
INVENTORY_SERVICE_URL=http://inventory-service:3002
ORDERS_SERVICE_URL=http://orders-service:3003
BILLING_SERVICE_URL=http://billing-service:3004
REPORTS_SERVICE_URL=http://reports-service:3005

# ===============================
# JWT (para Auth)
# ===============================
JWT_SECRET=supersecret
JWT_EXPIRES_IN=24h
```

---

## 🚀 Guía de Inicio Rápido

### Prerrequisitos

- Docker y Docker Compose instalados
- Node.js 18+ (para desarrollo local)
- Git

### Pasos para Iniciar el Proyecto

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd project-root
```

2. **Crear archivo .env**
```bash
# Copiar las variables de entorno del apartado anterior
# y guardarlas en un archivo .env en la raíz del proyecto
```

3. **Levantar todos los servicios**
```bash
docker-compose up -d
```

4. **Verificar servicios activos**
```bash
docker-compose ps
```

5. **Ver logs de un servicio específico**
```bash
docker-compose logs -f <service-name>
# Ejemplo: docker-compose logs -f auth-service
```

6. **Acceder a las interfaces**
- Frontend: http://localhost:5173
- API Gateway: http://localhost:8080
- Mongo Express: http://localhost:8081 (admin/admin123)

---


## 🔒 Seguridad y Autenticación

### Flujo de Autenticación

1. Usuario envía credenciales a `/auth/login`
2. Auth Service valida y genera JWT
3. Frontend almacena el token (localStorage o sessionStorage)
4. En cada petición, el frontend envía el token en headers:
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```
5. Cada servicio valida el token con Auth Service antes de procesar

### Ejemplo de Middleware de Validación

```javascript
// src/middleware/auth.middleware.js
const axios = require('axios');

const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }

    // Validar token con Auth Service
    const response = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/auth/validate`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // Agregar info del usuario al request
    req.user = response.data.user;
    next();
  } catch (error) {
    console.error('Error validando token:', error.message);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = { validateToken };
```

### Uso del Middleware

```javascript
// En las rutas que requieren autenticación
const { validateToken } = require('../middleware/auth.middleware');

router.post('/', validateToken, createProduct);
router.put('/:id', validateToken, updateProduct);
router.delete('/:id', validateToken, deleteProduct);
```

---
