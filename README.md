# API de Dolencias - Alivia Dolores

API REST desarrollada con arquitectura MVC para gestionar dolencias y remedios naturales, utilizando Node.js, Express y Firebase Firestore.

## 🏗️ Arquitectura MVC

```
alivia_dolores_api/
├── src/
│   ├── config/              # Configuración de Firebase
│   ├── models/              # Modelos de datos y validaciones
│   ├── controllers/         # Lógica de negocio
│   ├── services/            # Servicios de Firebase
│   ├── routes/              # Definición de rutas
│   ├── middleware/          # Middleware (errores, validaciones)
│   ├── utils/               # Utilidades (carga de datos)
│   └── app.js               # Configuración de Express
├── datos.json               # Datos iniciales
├── server.js                # Punto de entrada
├── .env                     # Variables de entorno (no incluir en git)
├── .env.example             # Ejemplo de variables de entorno
└── package.json
```

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Instalar Firebase Admin SDK

```bash
npm install firebase-admin dotenv --save
```

### 3. Configurar Firebase

1. Ve a la [Consola de Firebase](https://console.firebase.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Ve a **Configuración del proyecto** → **Cuentas de servicio**
4. Haz clic en **Generar nueva clave privada**
5. Guarda el archivo JSON como `serviceAccountKey.json` en la raíz del proyecto

### 4. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita `.env` con tus datos:

```env
PORT=3000
NODE_ENV=development
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
FIREBASE_DATABASE_URL=https://tu-proyecto.firebaseio.com
```

## 📝 Scripts disponibles

```bash
# Iniciar servidor
npm start

# Iniciar en modo desarrollo (con nodemon)
npm run dev

# Cargar datos iniciales desde datos.json a Firebase
npm run load-data
```

## 🌐 Endpoints API

### Health Check
```
GET /health
```

### Dolencias

#### 1. Obtener todas las dolencias
```
GET http://localhost:3000/dolencias
```

**Respuesta:**
```json
{
  "success": true,
  "count": 11,
  "data": [...]
}
```

#### 2. Obtener una dolencia específica
```
GET http://localhost:3000/dolencias/Dolor%20de%20cabeza%20tensional
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "nombre": "Dolor de cabeza tensional",
    "comer_mas": ["Agua 500ml", "Sandía", ...],
    ...
  }
}
```

#### 3. Crear una nueva dolencia
```
POST http://localhost:3000/dolencias
Content-Type: application/json

{
  "nombre": "Dolor de espalda",
  "comer_mas": ["Pescado", "Frutas"],
  "evitar": ["Comida procesada"],
  "por_que": "Antiinflamatorios naturales",
  "receta_titulo": "Ensalada antiinflamatoria",
  "receta_pasos": "Mezclar verduras con aceite de oliva",
  "red_flag": "Si hay entumecimiento = urgencia"
}
```

#### 4. Actualizar una dolencia
```
PUT http://localhost:3000/dolencias/Dolor%20de%20espalda
Content-Type: application/json

{
  "comer_mas": ["Pescado", "Frutas", "Nueces"],
  "evitar": ["Comida procesada", "Azúcar"]
}
```

#### 5. Eliminar una dolencia
```
DELETE http://localhost:3000/dolencias/Dolor%20de%20espalda
```

## 📊 Cargar datos iniciales

Para cargar los datos desde `datos.json` a Firebase:

```bash
npm run load-data
```

Esto creará las dolencias en Firestore si no existen.

## 🛠️ Tecnologías utilizadas

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **Firebase Admin SDK** - Base de datos Firestore
- **body-parser** - Parseo de JSON
- **cors** - Manejo de CORS
- **dotenv** - Variables de entorno

## 📚 Buenas prácticas implementadas

✅ **Arquitectura MVC** - Separación de responsabilidades  
✅ **Servicios** - Lógica de Firebase desacoplada  
✅ **Validaciones** - Modelo con validaciones completas  
✅ **Manejo de errores** - Middleware centralizado  
✅ **Variables de entorno** - Configuración segura  
✅ **Logging** - Registro de requests y errores  
✅ **Health check** - Endpoint de monitoreo  
✅ **Documentación** - README completo  

## 🔒 Seguridad

- ⚠️ Nunca subas `serviceAccountKey.json` a Git
- ⚠️ Nunca subas el archivo `.env` a Git
- ✅ Usa `.gitignore` para excluir archivos sensibles
- ✅ Mantén actualizadas las dependencias

## 📞 Endpoints de ejemplo con curl

```bash
# GET todas las dolencias
curl http://localhost:3000/dolencias

# POST crear dolencia
curl -X POST http://localhost:3000/dolencias \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","comer_mas":[],"evitar":[],"por_que":"test","receta_titulo":"test","receta_pasos":"test","red_flag":"test"}'

# PUT actualizar
curl -X PUT http://localhost:3000/dolencias/Test \
  -H "Content-Type: application/json" \
  -d '{"por_que":"actualizado"}'

# DELETE eliminar
curl -X DELETE http://localhost:3000/dolencias/Test
```

## 📄 Licencia

ISC
