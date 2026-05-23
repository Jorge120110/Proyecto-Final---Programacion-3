# Configuración y uso de MongoDB

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

## Credenciales configuradas

Definidas dentro del archivo `docker-compose.yml`:

```yaml
environment:
  MONGO_INITDB_ROOT_USERNAME: Progra3
  MONGO_INITDB_ROOT_PASSWORD: Progra3
```

---

## Configuración en application.properties

Para utilizar MongoDB como almacenamiento principal:

```properties
app.storage=mongodb
spring.data.mongodb.uri=mongodb://localhost:27017/proyectoSpringboot
```

---

## Cambio de motor del árbol

El proyecto permite cambiar el motor utilizado mediante configuración.

### Motor basado en Collections

```properties
app.tree-strategy=collections
```

### Motor personalizado

```properties
app.tree-strategy=custom
```

---

## Cambio dinámico de almacenamiento

El proyecto permite cambiar el tipo de almacenamiento desde configuración.

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