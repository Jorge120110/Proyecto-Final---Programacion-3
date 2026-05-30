# Documentacion del arbol custom

## Descripcion general

El paquete `com.team.folders.engine.custom` implementa una estrategia propia para trabajar con arboles de carpetas y archivos. A diferencia de la estrategia basada en colecciones, esta version utiliza estructuras enlazadas creadas manualmente para representar nodos, hijos, recorridos, registros y colas.

La entrada principal de la estrategia es una lista plana de `PlainNode`. Cada nodo contiene `id`, `name`, `type` y `parentId`. Con esa informacion, el algoritmo reconstruye la jerarquia del arbol y permite consultar subarboles, recorridos, altura, profundidad, ancestros y validacion de ciclos.

## Clase `TreeNode`

`TreeNode` representa un nodo interno del arbol custom. Su funcion es envolver un `PlainNode` y agregarle una estructura para almacenar sus hijos.

Atributos principales:

- `value`: guarda la informacion original del nodo plano.
- `children`: guarda los nodos hijos usando `NodeChildren`.

Esta clase no es publica porque solo se usa dentro del paquete custom. Sirve como una representacion jerarquica temporal: el sistema persiste nodos planos, pero el algoritmo necesita nodos conectados entre padre e hijos para ejecutar operaciones de arbol.

## Clase `NodeChildren`

`NodeChildren` es una coleccion enlazada personalizada para almacenar los hijos de un `TreeNode`.

Internamente usa enlaces simples mediante la clase privada `ChildLink`. Cada enlace contiene un `TreeNode` y una referencia al siguiente enlace. La clase mantiene dos referencias:

- `first`: primer hijo de la lista.
- `last`: ultimo hijo de la lista.

El metodo `add(TreeNode child)` agrega un nuevo hijo al final de la lista. Si la lista esta vacia, el nuevo enlace se convierte en `first` y `last`. Si ya tiene elementos, se conecta despues de `last` y luego se actualiza `last`.

`NodeChildren` implementa `Iterable<TreeNode>`, por lo que se puede recorrer con un `for-each`. Esto permite que el algoritmo lea los hijos de un nodo sin exponer directamente la estructura enlazada.

## Clase `CustomTreeAlgorithm`

`CustomTreeAlgorithm` implementa la interfaz `TreeAlgorithmStrategy`. Es la clase principal de la estrategia custom y contiene las operaciones del arbol.

Responsabilidades principales:

- Construir un arbol completo desde una lista plana.
- Construir un subarbol desde un nodo especifico.
- Calcular la ruta desde la raiz hasta un nodo.
- Recorrer el arbol en DFS o BFS.
- Calcular altura y profundidad.
- Obtener ancestros.
- Detectar ciclos o ids invalidos.

### Construccion del arbol

El metodo `buildForest` crea primero un registro de nodos (`TreeNodeRegistry`) y despues conecta cada nodo con su padre usando `parentId`. Si un nodo no tiene padre, se considera raiz.

`buildTree` toma la primera raiz encontrada y la transforma en `TreeView`, que es el formato que el backend devuelve al frontend.

### Subarboles

`buildSubtree` busca el nodo solicitado por id. Si existe, conecta sus hijos y devuelve una vista del arbol que empieza desde ese nodo. Si no existe, devuelve `Optional.empty()`.

### Ruta, profundidad y ancestros

`pathToNode` usa los `parentId` para subir desde el nodo objetivo hasta la raiz. La ruta se guarda en una pila enlazada personalizada (`PlainNodePath`) para devolver el orden correcto: raiz primero y nodo final al final.

`depth` reutiliza esa ruta. Si la ruta tiene tres nodos, la profundidad es dos, porque se cuentan las aristas desde la raiz hasta el nodo.

`ancestors` tambien reutiliza la ruta, pero elimina el nodo final para devolver solo sus padres.

### Recorridos DFS y BFS

`traverse` permite recorrer el arbol de dos maneras:

- DFS: profundidad primero. Visita un nodo y luego baja por sus hijos antes de pasar al siguiente hermano.
- BFS: anchura primero. Visita primero los nodos por nivel usando una cola personalizada (`NodeQueue`).

### Altura

`height` calcula la altura maxima entre todas las raices. Para cada raiz, `heightFrom` evalua recursivamente la altura de sus hijos y devuelve el nivel mas profundo encontrado.

### Validacion de ciclos

`hasCycles` valida dos cosas:

- Que no existan ids nulos o repetidos.
- Que la cadena de padres no forme ciclos.

Para detectar ciclos usa dos estructuras:

- `IdPath`: ids que forman parte del camino actual de validacion.
- `IdRegistry`: ids que ya fueron validados correctamente.

Si un nodo aparece dos veces en el camino actual, significa que hay un ciclo. Si un nodo apunta a si mismo como padre, tambien se considera ciclo.

## Relacion entre las tres clases

`CustomTreeAlgorithm` recibe la lista de `PlainNode` y crea objetos `TreeNode`. Cada `TreeNode` almacena sus hijos dentro de `NodeChildren`. Con esas dos clases auxiliares, el algoritmo puede trabajar como si tuviera un arbol real aunque la informacion venga desde una base de datos en formato plano.

En resumen:

- `PlainNode` es el dato plano original.
- `TreeNode` convierte ese dato en un nodo de arbol.
- `NodeChildren` conecta los hijos de cada nodo.
- `CustomTreeAlgorithm` usa esas estructuras para ejecutar las operaciones del arbol.
