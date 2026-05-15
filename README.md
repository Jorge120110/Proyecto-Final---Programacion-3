# Folders Project

Scaffolding Spring Boot para gestionar un arbol de carpetas y archivos.

El proyecto sigue el enunciado de Programacion 3:

- Modulo `tree-engine`: contratos y clases base para dos estrategias intercambiables.
- Modulo `app`: API Spring Boot, controladores, servicio y persistencias como esqueleto.
- Selector de motor: `app.tree-strategy=collections|custom`.
- Selector de persistencia: `app.storage=memory|postgres|neo4j`.
- Contrato unico en `openapi.yaml`.

## Estructura

```text
folders-project/
├── pom.xml
├── docker-compose.yml
├── openapi.yaml
├── README.md
├── app/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/team/folders/
│       │   ├── FoldersApplication.java
│       │   ├── api/
│       │   │   ├── controller/
│       │   │   ├── dto/
│       │   │   └── mapper/
│       │   ├── config/
│       │   ├── domain/
│       │   ├── persistence/
│       │   │   ├── memory/
│       │   │   ├── postgres/
│       │   │   └── nosql/
│       │   └── service/
│       └── resources/
│           ├── application.properties
│           ├── application-postgres.properties
│           ├── application-neo4j.properties
│           └── db/schema.sql
└── tree-engine/
    ├── pom.xml
    └── src/main/java/com/team/folders/engine/
        ├── TreeAlgorithmStrategy.java
        ├── TraversalType.java
        ├── model/
        ├── collections/
        └── custom/
```

## Arranque rapido

Compilar todo:

```bash
mvn clean test
```

Ejecutar con memoria y estrategia collections:

```bash
mvn -pl app spring-boot:run
```

Ejecutar con estrategia custom:

```bash
mvn -pl app spring-boot:run -Dspring-boot.run.arguments="--app.tree-strategy=custom"
```

Levantar PostgreSQL y Neo4j:

```bash
docker compose up -d
```

Ejecutar con PostgreSQL:

```bash
mvn -pl app spring-boot:run -Dspring-boot.run.profiles=postgres
```

Ejecutar con Neo4j:

```bash
mvn -pl app spring-boot:run -Dspring-boot.run.profiles=neo4j
```
## PostgreSQL setup  

Levantar y configurar la DB con Postgres: 

```bash 
docker compose up -d postgres
```
verificar que corra el docker:

```bash
docker ps
```

### Credenciales

| Campo | Valor |
|-------|-------| 
| Host | Localhost |
| Puerto | 5433 |
| Base de Datos | folders |
| Usuario | folders |
| Contraseña | folders |

> **Importante:** El puerto fue cambiado de 5432 a 5433, puede presentar problemas si se tiene otro servidor corriendo en ese puerto. 

### Conectarse desde pgAdmin

1. Abrir pgAdmin
2. Click derecho en Servers -> Register -> Server
3. En "General" -> Name: poner un nombre que se identifique (Ejemplo: "Folders Project (Docker)")
4. En Connection -> llenar los campos con las credenciales de la tabla anterior.
5. Click en Save.

### Cargar esquema y base de datos

Hay dos formas:

#### Opcion 1: 

Cuando se arranca la aplicación con el perfil postgres activo, Spring Boot ejecuta automáticamente schema.sql y seed.sql. Esto está configurado en application-postgres.properties mediante las propiedades spring.sql.init.*.

#### Opcion 2: 

1. Abrir pgAdmin 
2. Pegar y ejecutar schema.sql 
3. Pegar y ejecutar seed.sql

`app/src/main/resources/db/schema.sql`
`app/src/main/resources/db/seed.sql`

### Verificacion simple de instalacion

```sql
SELECT COUNT(*) FROM nodes;
```

### Troubleshooting 

**Problema 1:** "Port already in use" o "Bind for 0.0.0.0:5433 failed"

**Causa:** ya hay algo corriendo en el puerto 5433.

**Solución:** detectar qué lo usa y detenerlo, o cambiar el puerto en docker-compose.yml.

**Problema 2:** "Cannot connect to the Docker daemon"

**Causa:** Docker Desktop no está corriendo.

**Solución:** abrir Docker Desktop y esperar a que el ícono esté fijo (no animado).

**Problema 3:** "Connection refused" desde pgAdmin

**Causa:** el contenedor no está corriendo aunque pgAdmin diga que sí está configurado.

**Solución:** verificar con docker ps que aparezca folders-postgres con estado Up. Si no, levantarlo con docker compose up -d postgres.

## Endpoints principales

- `POST /nodes/root`
- `POST /nodes/{parentId}/children`
- `GET /tree`
- `GET /tree/{nodeId}`
- `GET /nodes/{nodeId}/path`
- `GET /tree/traversal?type=DFS`
- `GET /tree/traversal?type=BFS`
- `GET /tree/height`
- `GET /nodes/{nodeId}/depth`
- `GET /nodes/{nodeId}/ancestors`
- `GET /tree/validate`

Ejemplo para crear raiz:

```json
{
  "name": "Documentos",
  "type": "FOLDER"
}
```

Ejemplo para crear un archivo hijo:

```json
{
  "name": "tarea.pdf",
  "type": "FILE"
}
```

## Reparto sugerido

Integrante A:

- `tree-engine/src/main/java/com/team/folders/engine/custom/`
- `app/src/main/java/com/team/folders/persistence/memory/`
- Pruebas de equivalencia de estrategia custom.

Integrante B:

- `tree-engine/src/main/java/com/team/folders/engine/collections/`
- `app/src/main/java/com/team/folders/persistence/postgres/`
- `app/src/main/resources/db/schema.sql`

Integrante C:

- `app/src/main/java/com/team/folders/config/`
- `app/src/main/java/com/team/folders/persistence/nosql/`
- Perfiles `application-neo4j.properties` y frontend.

## Estado del scaffolding

Este proyecto es intencionalmente basico:

- Los controladores y DTOs ya existen.
- Los contratos del motor y repositorio ya existen.
- Las clases de estrategia `collections` y `custom` existen, pero sus metodos lanzan `UnsupportedOperationException`.
- El service existe, pero no orquesta todavia.
- Los repositorios de memoria, PostgreSQL y Neo4j estan como puntos de implementacion.

Cada integrante debe reemplazar los `TODO` por la logica correspondiente a su parte.

## Notas de arquitectura

La logica pesada del arbol debe vivir en `tree-engine`, detras de `TreeAlgorithmStrategy`.

La app principal transforma los nodos persistidos a `PlainNode`, llama al motor activo y devuelve DTOs HTTP.

Las bases de datos guardan datos planos (`id`, `name`, `type`, `parentId`). No deben resolver los recorridos, altura, ruta o validacion de ciclos.
