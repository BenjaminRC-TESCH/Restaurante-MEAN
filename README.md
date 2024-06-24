# RestauranteApp
RestauranteApp es una aplicación para la gestión de un restaurante, que incluye funcionalidades como un carrito de compra, autenticación por roles, verificación de cuenta por correo y manejo de imágenes para el catálogo de productos.

## Tecnologías Utilizadas
### Frontend
- Angular: Framework para la construcción de la interfaz de usuario.
- Bootstrap: Framework CSS para el diseño responsivo.
- SweetAlert: Librería para mostrar alertas personalizadas y bonitas.

### Backend
- Node.js: Entorno de ejecución para JavaScript en el servidor.
- Express: Framework para construir el servidor y las API.
- Bcrypt: Librería para el hashing de contraseñas.
- JsonWebToken: Librería para la autenticación y autorización mediante tokens JWT.
- Mongoose: ODM para MongoDB.
- Nodemailer: Librería para enviar correos electrónicos.
- Multer: Middleware para la gestión de archivos, especialmente imágenes.

## Características
- Carrito de Compra: Los usuarios pueden agregar productos al carrito y proceder con la compra.
- Autenticación por Roles: Soporte para múltiples roles de usuario (e.g., cliente, administrador).
 -  erificación de Cuenta por Correo: Los usuarios reciben un correo de verificación al registrarse.
- Gestión de Imágenes: Subida y manejo de imágenes para el catálogo de productos.

## Instalación
### Prerrequisitos
Asegúrate de tener instalado lo siguiente:
- Node.js (v14 o superior recomendado)
- npm (Node Package Manager)
- Angular CLI

### Backend
1. Clona el repositorio:
  ```bash
   git clone https://github.com/tu_usuario/RestauranteApp.git
  ```
2. Accede a la carpeta del backend: 
  ```bash
   cd RestauranteApp/backend
  ```
3. Instala las dependencias:
  ```bash
   npm install
  ```
3. Configura las variables de entorno, crea un archivo .env a nivel de la carpeta src:
  ```bash
   PORT=3000
   SECRET=ariabit
   MONGODB_URI=mongodb://127.0.0.1:27017/ariabit
   EMAIL=
   PASSWORD_EMAIL=
  ```
4. Ejecuta el servidor:
  ```bash
   npm start
  ```
### Frontend
1. Cambia al directorio del frontend:
  ```bash
   cd RestauranteApp/frontend
  ```
2. Instala las dependencias:
  ```bash
   npm install
  ```
3. Ejecuta la aplicación Angular:
  ```bash
   ng serve
  ```
4. Abre tu navegador en la siguiente URL "http://localhost:4200"

## Uso
- Regístrate como nuevo usuario.
- Verifica tu cuenta mediante el enlace enviado a tu correo electrónico.
- Inicia sesión y explora el catálogo de productos.
- Agrega productos al carrito y procede con la compra.
- (Administrador) Gestiona el catálogo de productos, incluyendo la subida de imágenes.

## Contribuciones
¡Las contribuciones son bienvenidas! Siéntete libre de bifurcar el repositorio y enviar solicitudes de extracción para sugerir mejoras o características adicionales.

## Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

