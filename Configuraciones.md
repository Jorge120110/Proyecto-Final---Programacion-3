# Integrante Responsable

Parte C — Frontend, MongoDB y configuración de persistencia.

---

# Objetivos Realizados

## Validar MongoDB con datos de prueba

Se configuró y validó correctamente la persistencia utilizando MongoDB.

Se realizaron pruebas de:

- creación de nodos
- relaciones jerárquicas mediante `parentId`
- visualización de árboles
- recorridos DFS y BFS
- integración con el frontend

La base de datos utilizada fue:

```properties
spring.data.mongodb.uri=mongodb://Progra3:Progra3@localhost:27017/proyectoSpringboot?authSource=admin
```

---

# Organización Jerárquica

La estructura jerárquica implementada utiliza un árbol genérico mediante relaciones padre-hijo usando `parentId`.

Ejemplo de estructura:

```text
Universidad
├── Sistemas
    └── mate
---

# Frontend Web

Se desarrolló una interfaz web moderna para interactuar visualmente con el árbol jerárquico.

---

# Tecnologías Utilizadas

## React

Utilizado para construir la interfaz web interactiva y dinámica.

## TypeScript

Utilizado para mejorar la organización y tipado del código.

## Vite

Utilizado para ejecutar y compilar el frontend de manera rápida.

## Tailwind CSS

Utilizado para diseñar una interfaz moderna, responsiva y visualmente atractiva.

## shadcn/ui

Utilizado para componentes visuales reutilizables como cards, botones, tabs y diálogos.

## Lucide React

Utilizado para iconografía moderna dentro de la interfaz.

## Node.js y npm

Utilizados para la instalación y administración de dependencias.

---

# Funcionalidades Implementadas

- Visualización jerárquica del árbol
- Explorador interactivo de nodos
- Visualización de subárboles
- Recorridos DFS y BFS
- Visualización de profundidad y altura
- Validación del árbol
- Dashboard interactivo
- API Playground para pruebas de endpoints
- Breadcrumbs jerárquicos
- Visualización de estrategia y persistencia activa
- Interfaz responsive

---

# API Playground

Se implementó una sección visual llamada API Playground para probar endpoints directamente desde la interfaz.

Permite probar:

- creación de nodos
- recorridos DFS/BFS
- validaciones
- subárboles
- profundidad
- ancestros
- rutas

---

# Configuración del Frontend

## Instalar dependencias

```bash
cd frontend
npm install
```

## Ejecutar frontend

```bash
npm run dev
```

---

# Acceso al Frontend

El frontend se ejecuta en:

```text
http://localhost:5173
```

---

# Comunicación Frontend-Backend

El frontend consume la API REST desarrollada en Spring Boot mediante solicitudes HTTP hacia:

```text
http://localhost:8080
```

---

# Configuración y Uso de MongoDB

## Requisitos

- Java 17
- Docker Desktop
- Docker Compose
- Maven

---

## Levantar MongoDB con Docker

El proyecto incluye un archivo `docker-compose.yml` para iniciar MongoDB fácilmente.

### Ejecutar contenedor

```bash
docker compose up -d
```

### Verificar contenedor activo

```bash
docker ps
```

Debe aparecer un contenedor llamado:

```text
mongodb
```

---

## Credenciales Configuradas

Definidas dentro del archivo `docker-compose.yml`:

```yaml
environment:
  MONGO_INITDB_ROOT_USERNAME: Progra3
  MONGO_INITDB_ROOT_PASSWORD: Progra3
```

---

# Configuración de Estrategia y Persistencia

La aplicación permite visualizar:

- estrategia activa del árbol
- motor de persistencia activo

La información se obtiene desde el backend mediante:

```http
GET /config/current
```

Ejemplo:

```json
{
  "strategy": "collections",
  "storage": "memory"
}
```

---

# Configuración en application.properties

Para utilizar MongoDB como almacenamiento principal:

```properties
app.storage=mongodb
spring.data.mongodb.uri=mongodb://localhost:27017/proyectoSpringboot
```

También puede utilizarse autenticación:

```properties
spring.data.mongodb.uri=mongodb://Progra3:Progra3@localhost:27017/proyectoSpringboot?authSource=admin
```

---

# Explicación Técnica

## Estrategia del Árbol

El sistema permite utilizar diferentes implementaciones para el manejo interno del árbol.

### Motor basado en Collections

```properties
app.tree-strategy=collections
```

### Motor personalizado

```properties
app.tree-strategy=custom
```

Actualmente se utiliza:

```properties
app.tree-strategy=collections
```

---

## Persistencia

El sistema soporta diferentes motores de persistencia.

### Memoria

```properties
app.storage=memory
```

### MongoDB

```properties
app.storage=mongodb
```

### PostgreSQL

```properties
app.storage=postgres
```

El cambio se realiza dinámicamente utilizando `@ConditionalOnProperty`.

---

# Cambio Dinámico de Almacenamiento

El proyecto permite cambiar el tipo de almacenamiento desde configuración sin modificar la lógica principal del sistema.

Dependiendo de la propiedad configurada:

```properties
app.storage=
```

Spring Boot carga automáticamente la implementación correspondiente.

Ejemplo:

```properties
app.storage=mongodb
```

---

# Conclusión

Se logró integrar correctamente:

- backend Spring Boot
- persistencia MongoDB
- frontend React
- visualización jerárquica
- recorridos DFS/BFS
- configuración visual de estrategia y persistencia
- Docker para despliegue de MongoDB
