 Simulador Interactivo - Pre-Entrega 10

Este proyecto es una aplicación interactiva que simula un catálogo de productos con un carrito de compras interactivo, persistencia de datos y consumo de servicios asíncronos.

  Tecnologías e Implementaciones Técnicas

- **Consumo de API Externa:** Implementación de `fetch` combinada con estructuras `async/await` para obtener los productos en tiempo real desde la API de `fakestoreapi`.
- **Manejo de Errores Completo:** Bloques `try/catch/finally` que controlan el flujo, aseguran la carga de la interfaz y notifican de forma amigable cualquier error de red.
- **Persistencia de Datos:** Uso de `localStorage` y métodos `JSON.parse()` / `JSON.stringify()` para garantizar que los elementos agregados no se pierdan al actualizar la página (F5).
- **Librerías Externas Integradas:**
  - **Toastify JS:** Utilizada para notificaciones dinámicas rápidas no bloqueantes al agregar/quitar elementos.
  - **SweetAlert2:** Utilizada para modales estructurados de confirmación crítica (vaciar carrito) y alertas de errores de conexión.

