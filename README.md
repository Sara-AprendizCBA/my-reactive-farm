# Actividad 1: Modificar y explicar un estado

- Cambia el valor inicial de un estado existente (ej.: loading, animals, typeFilter).
- Observa qué sucede en la interfaz al cargar la aplicación.
- Explica qué estado modificaste, qué cambió visualmente y cómo se relaciona con el renderizado.


## Archivo:

```
src/pages/Farm.jsx

```
En la parte:

```Jsx
export default function Farm() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  

```
## Codigo Modificado:

```Jsx
export default function Farm() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);  // ← cambio de ACT1
  const [loadError, setLoadError] = useState(null);

```

##  Que cambia en la interfaz:

Antes:

- Al entrar a la página aparecía el componente  ```<Loader />``` con el mensaje:
**“Fetching animals from the farm…”**

Después:

- El loader ya no aparece.
- Se muestra directamente:
- El formulario
- Los filtros
- La lista

Porque ```loading``` comienza como ```false```.

## Explicación técnica

Cambié el estado inicial:

```Jsx

const [loading, setLoading] = useState(true);

```

Por esto:

```jsx

const [loading, setLoading] = useState(false);

```

Esto hace que la aplicación **salte el estado de carga inicial** y renderice inmediatamente la interfaz. El renderizado condicional:


```jsx

{loading && <Loader message="Fetching animals from the farm…" />}

```

ya no se ejecuta, porque *loading* ya no es *true*.
