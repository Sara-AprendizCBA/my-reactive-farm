# Actividad 2: Agregar un filtro nuevo

- Analiza cómo funcionan los filtros actuales.
- Crea un nuevo filtro (por edad, peso, etc.).
- Agrega un control nuevo en la interfaz.
- Ajusta la lógica de filtrado.
- Explica dónde agregaste el estado, cómo cambia la lógica y cómo afecta la lista.

## Archivo:

```
src/pages/Farm.jsx

```

## Codigos donde se trabaja

Se agrego el *UseCallback* justo denajos de sus estados:

```Jsx

export default function Farm() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");

```

## Codigo modificado

```Jsx

export default function Farm() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");

  // ← ACT2: Nueva función memorizada con useCallback
  const filterByType = useCallback(() => {
    if (typeFilter === "all") return animals;
    return animals.filter((a) => a.type === typeFilter);
  }, [animals, typeFilter]); 

```

## Agregar el control en la interfaz

En el bloque ```<AnimalList>```:

```Jsx

{/* Status filter */}
<label className="sr-only" htmlFor="status-filter">
  Status
</label>
<select
  id="status-filter"
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
>
  {STATUSES.map((s) => (
    <option key={s} value={s}>
      {s}
    </option>
  ))}
</select>

```

Debajo se coloco:

```Jsx

{/* Age Filter */}
<label className="sr-only" htmlFor="min-age">
  Min Age
</label>
<input
  id="min-age"
  type="number"
  value={minAgeFilter}
  onChange={(e) => setMinAgeFilter(e.target.value)}
  placeholder="Min age"
  className="w-32 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
/>

```

## Ajustar el ```useMemo``` de filtrado

```Jsx

const filteredAnimals = useMemo(() => {
  return animals.filter((a) => {
    const byType = typeFilter === "all" || a.type === typeFilter;

    const byStatus =
      statusFilter === "all" ||
      a.status?.toLowerCase() === statusFilter.toLowerCase();

    const q = searchQuery.trim().toLowerCase();
    const byQuery =
      q.length === 0 ||
      a.name?.toLowerCase().includes(q) ||
      a.type?.toLowerCase().includes(q) ||
      String(a.weight).includes(q) ||
      String(a.age).includes(q);

    // AQUÍ vas a modificar:
    return byType && byStatus && byQuery;
  });
}, [animals, typeFilter, statusFilter, searchQuery]);

```

## Modificacion

```Jsx

const filteredAnimals = useMemo(() => {
  return animals.filter((a) => {
    const byType = typeFilter === "all" || a.type === typeFilter;

    const byStatus =
      statusFilter === "all" ||
      a.status?.toLowerCase() === statusFilter.toLowerCase();

    const q = searchQuery.trim().toLowerCase();
    const byQuery =
      q.length === 0 ||
      a.name?.toLowerCase().includes(q) ||
      a.type?.toLowerCase().includes(q) ||
      String(a.weight).includes(q) ||
      String(a.age).includes(q);

    // ← NUEVA LÓGICA
    const byMinAge =
      minAgeFilter === "" || a.age >= Number(minAgeFilter);

    // ← RETURN actualizado
    return byType && byStatus && byQuery && byMinAge;
  });
}, [animals, typeFilter, statusFilter, searchQuery, minAgeFilter]);

```
## Qué cambia en la interfaz

**Antes:**

- Cada vez que escribías en un input, cambiabas un select o cualquier estado,
toda la función de filtrado se volvía a crear.
- Algunos componentes hijos podían re-renderizar innecesariamente.

**Después:**

- La función solo se recrea cuando cambian estas dependencias:

```js
animals, typeFilter

```

Se evita trabajo extra cuando:
- Cambias color, nombre o campos no relacionados.
- Se actualiza otro estado que no es del filtro.
- La UI se siente más fluida en listas grandes.

**Visualmente**:

- No cambia nada en la apariencia.
- Sí cambia el rendimiento internamente.

## Explicación tecnica

```jsx

const filterByType = () => {
  if (typeFilter === "all") return animals;
  return animals.filter(a => a.type === typeFilter);
};

```

**Esto significa**:

- En cada render, se crea una nueva función en memoria.
- Los componentes hijos que reciben esta función como prop detectan una referencia nueva y se vuelven a renderizar.

**Con *useCallback* se evita esto**:

```jsx

const filterByType = useCallback(() => {
  if (typeFilter === "all") return animals;
  return animals.filter(a => a.type === typeFilter);
}, [animals, typeFilter]);

},

```

**¿Qué hace useCallback?**

- Memoiza la función, evitando recrearla en cada render.
- Solo genera una nueva cuando cambian las dependencias:

     animals
     typeFilter

**¿Por qué mejora el rendimiento?**

- Si la función se pasa como prop a listas, tarjetas, o componentes hijos:

¡Ya no causará re-render innecesario!

- Ayuda a React a optimizar qué debe volver a dibujar.
