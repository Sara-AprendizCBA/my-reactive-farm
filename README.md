# Actividad 3: Mejorar el formulario

- Revisa el formulario de creación de animales.
- Piensa en dos mejoras de experiencia de usuario.
- Implementa las mejoras seleccionadas.
- Explica qué cambiaste y por qué mejora la experiencia. (README.md)

## Archivo:

```
src/components/AnimalForm.jsx

```

## Codigo donde se trabaja

Se agrego el *UseCallback* justo denajos de sus estados:

```Jsx

export default function Farm() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");

```

## Cambios realizados

### ✔️ 1. Se creó un componente Loader.jsx

Sirve como indicador visual mientras los componentes son cargados dinámicamente.

### ✔️ 2. Se aplicó React.lazy

En el archivo Farm.jsx se modificó la importación de los componentes para que se carguen bajo demanda:

```Jsx

const AnimalList = React.lazy(() => import("../components/AnimalList.jsx"));
const AnimalForm = React.lazy(() => import("../components/AnimalForm.jsx"));


```

## 3. Se envolvió el contenido dentro de ```<Suspense>```

Esto permite mostrar el Loader mientras los componentes terminan de cargarse:

```Jsx

<Suspense fallback={<Loader />}>
  <AnimalForm />
  <AnimalList animals={animals} />
</Suspense>


```
## 📝 Código final implementado

### Loader.jsx

```Jsx

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Cargando...</p>
    </div>
  );
}


```

## (con lazy + suspense)

```Jsx

import React, { useState, Suspense } from "react";
import Loader from "../components/Loader";

// Lazy imports
const AnimalList = React.lazy(() => import("../components/AnimalList.jsx"));
const AnimalForm = React.lazy(() => import("../components/AnimalForm.jsx"));

export default function Farm() {
  const [animals, setAnimals] = useState([]);

  const addAnimal = (newAnimal) => {
    setAnimals([...animals, newAnimal]);
  };

  return (
    <div className="farm-container">
      <h1>My Reactive Farm</h1>

      <Suspense fallback={<Loader />}>
        <AnimalForm addAnimal={addAnimal} />
        <AnimalList animals={animals} />
      </Suspense>
    </div>
  );
}

```

## 🚀 Resultado final

la aplicación ahora:

- Carga componentes pesados solo cuando se necesitan.
- Reduce el bundle inicial.
- Muestra un loader elegante y claro.
- Mejora la experiencia del usuario en conexiones lentas
