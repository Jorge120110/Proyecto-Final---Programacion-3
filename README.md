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
