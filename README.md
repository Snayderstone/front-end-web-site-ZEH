# Contenido del archivo README.md

# ZEH Website

Este proyecto es una página web dedicada a ZEH, enfocada en la optimización y el registro del consumo de energía de paneles solares. A continuación se detallan los componentes y funcionalidades del proyecto.

## Objetivos del Proyecto

- **Optimización de Energía**: Implementar modelos que calculen la producción de energía de los paneles solares y optimicen el consumo energético.
- **Registro de Datos**: Permitir el seguimiento del rendimiento de los paneles solares y el consumo de energía a lo largo del tiempo.

## Estructura del Proyecto

- **src/lib/components**: Contiene componentes organizados en átomos, moléculas y organismos.
- **src/lib/models**: Incluye modelos para los paneles solares y el consumo energético.
  - `solar-panel.ts`: Define la clase `SolarPanel` que modela las propiedades y comportamientos de un panel solar.
  - `consumption.ts`: Define la clase `Consumption` que modela los patrones de consumo energético.
- **src/lib/utils**: Funciones utilitarias para cálculos relacionados con la producción y consumo de energía.
- **src/routes**: Contiene las páginas del sitio organizadas por diseño.
- **static/images**: Imágenes estáticas utilizadas en el proyecto.

## Instalación

Para instalar las dependencias del proyecto, ejecuta:

```shell
npm install
```

## Ejecución Local

Para ejecutar el proyecto en modo de desarrollo, utiliza:

```shell
npm run dev
```

El sitio estará disponible en `http://localhost:5173/`.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.