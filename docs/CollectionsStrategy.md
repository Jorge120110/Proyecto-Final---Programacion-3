# Estrategia Collections - Motor de Algoritmos

## 1. Propósito de la estrategia collections

La estrategia collections es una de las dos implementaciones del motor 
de algoritmos del proyecto. Es fundamental porque permite resolver las 
operaciones del árbol apoyándose en un framework de java y nos permite usar métodos
de java.util.

Esto significa que métodos como HASCYCLES, ANCESTORS, TRAVERSE, usen metodos
de java.util como Hashmaps, ArrayList y no tener que crear nuestros propios métodos
desde cero. Esto es lo que lo diferencia del custom.

La estrategia se encuentra en tree-engine, separada del resto, esto con el objetivo de que 
independientemente de la persistencia de la BD (Mongo, Postgres o memory) funcione sin ningun problema. 
Esto lo hace porque solo recibe PlainList.

## 2. Cómo se activa la estrategia collections
Esta funciona a través de la propiedad de app.tree-strategy=collections, la cuál permite cambiar la 
estrategia que usaremos (Custom o Collections). Esta se encuentra en el application.properties.

## 3. Contrato común: la interfaz `TreeAlgorithmStrategy`
Este contiene 8 metodos que operan en ambas estrategias, estas  son: 
- Builtree: Para constuir un árbol
- BuilSubtree: Construye al arbol desde un nodo específico
- Traverse: Que ejecuta los metodos DSF y BFS
- heigth: Para medir la altura del árbol
- depth: Para calcular la profundidad de una nodo
- Ancestors: Para conocer los ancestros (Nodos anteriores) de un nodo especifico.
- hasCycles: Verifica que no ocurran ciclos en el árbol.

## 4. Helpers internos: `childrenByParentId` y `nodesById`

Existe dos helpers internos que ayudan a los métodos a trabajar de manera más 
eficaz, estos son: ChildrensByParentId, para encontrar los nodos por su ParentId y encontrar los nodos padres de cada hijo o por el contrario los nodos hijo de cada padre.

nodesById: Como su nombre lo dice para encontrar el nodo por su Id especifico. 

## 5. Validación de equivalencia entre estrategias

Para demostrar que ambas estrategias son intercambiables, se implementó 
el test StrategyEquivalenceTest en el módulo app. Este test ejecuta 
las mismas operaciones con CollectionsTreeAlgorithm y 
CustomTreeAlgorithm sobre los mismos datos y se obtienen los mismos resultados en ambos casos.

