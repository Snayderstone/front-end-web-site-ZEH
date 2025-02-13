☀️ ZEH Website - Optimización y Registro de Consumo Energético

📌 Descripción del Proyecto
ZEH Website es una plataforma diseñada para optimizar y registrar el consumo energético de paneles solares. Su propósito es facilitar el seguimiento del rendimiento y mejorar la eficiencia en el uso de la energía solar.

🎯 Objetivos del Proyecto
- Optimización de Energía: Implementar modelos avanzados para calcular la producción energética de los paneles solares y mejorar su consumo.
- Registro de Datos: Facilitar el seguimiento del rendimiento de los paneles solares y analizar patrones de consumo energético en el tiempo.

🏗️ Estructura del Proyecto
El código está organizado de la siguiente manera:
```
ZEH Website
├── src/lib/components       # Componentes organizados en átomos, moléculas y organismos
├── src/lib/models           # Modelos de paneles solares y consumo energético
│   ├── solar-panel.ts      # Clase que modela las propiedades y comportamientos de un panel solar
│   ├── consumption.ts      # Clase que modela los patrones de consumo energético
├── src/lib/utils            # Funciones utilitarias para cálculos relacionados con la energía
├── src/routes               # Páginas del sitio organizadas por diseño
├── static/images            # Imágenes estáticas utilizadas en el proyecto
```

⚙️ Instalación
Para instalar las dependencias del proyecto, ejecuta el siguiente comando en la terminal:
```sh
npm install
```

🚀 Ejecución Local
Para iniciar el proyecto en modo desarrollo, utiliza:
```sh
npm run dev
```
Luego, abre en tu navegador: [http://localhost:5173/](http://localhost:5173/)

📥 Clonar y Ejecutar el Proyecto en Local
Sigue estos pasos para descargar y ejecutar el proyecto en Visual Studio Code:

1. Clonar el repositorio
   Abre la terminal y ejecuta:
   ```sh
   git clone https://github.com/Snayderstone/front-end-web-site-ZEH.git
   ```

2. Acceder al directorio del proyecto
   ```sh
   cd front-end-web-site-ZEH
   ```

3. Abrir el proyecto en Visual Studio Code
   ```sh
   code .
   ```

4. Instalar dependencias
   ```sh
   npm install
   ```

5. Crear y configurar variables de entorno
   En la raíz del proyecto, crea un archivo `.env` y añade las siguientes variables:
   ```sh
   VITE_SUPABASE_URL=https://xbswxkyyvbyrjpyefxgu.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhic3d4a3l5dmJ5cmpweWVmeGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MzM1MjUsImV4cCI6MjA0ODMwOTUyNX0.0SzCz-M9UABNqvv0c8tUxFlDNH3DQD-MvBro9NFpfSw
   ```

6. Iniciar el servidor de desarrollo
   ```sh
   npm run dev
   ```

7. Abrir el navegador** y acceder a `http://localhost:5173/`

📌 Tecnologías Utilizadas
- **Frontend**: Svelte, TypeScript
- **Gestión de Estados**: Svelte Stores
- **Estilos**: Tailwind CSS
- **Herramientas**: Vite, ESLint, Prettier

🛠️ Contribución
Si deseas contribuir al proyecto:
1. Realiza un fork del repositorio.
2. Crea una rama nueva (`git checkout -b feature-nueva`).
3. Realiza tus cambios y commitea (`git commit -m 'Descripción del cambio'`).
4. Sube los cambios (`git push origin feature-nueva`).
5. Abre un Pull Request.

📜 Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

📬 Contacto  
🔗 GitHub: [Snayderstone](https://github.com/Snayderstone)  
🌐 Proyecto: [ZEH Website](https://github.com/Snayderstone/front-end-web-site-ZEH)

