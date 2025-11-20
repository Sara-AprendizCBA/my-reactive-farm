import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout.jsx";
import Alert from "../components/Alert.jsx";
import Loader from "../components/Loader.jsx";
import AnimalList from "../components/AnimalList.jsx";
import AnimalForm from "../components/AnimalForm.jsx";
import { getAnimals, createAnimal } from "../services/animalsApi.js";

// Filtros disponibles
const TYPES = ["all", "cow", "chicken", "sheep", "pig", "other"];
const STATUSES = ["all", "healthy", "review", "sick"];

export default function Farm() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);  // ← cambio de ACT1
  const [loadError, setLoadError] = useState(null);

  // Filtros UI
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");

  // Error de envío desde el formulario (red / servidor)
  const [submitError, setSubmitError] = useState(null);

  // Carga inicial con useEffect
  useEffect(() => {
    let cancelled = false;
    async function fetchAnimals() {
      try {
        setLoading(true);
        setLoadError(null);
        const data = await getAnimals();
        if (!cancelled) setAnimals(data);
      } catch (err) {
        if (!cancelled) setLoadError("Failed to load animals. Please retry.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAnimals();
    return () => {
      cancelled = true;
    };
  }, []);

  // Crear animal (llamado por AnimalForm)
  async function handleCreate(animal) {
    try {
      setSubmitError(null);
      const created = await createAnimal(animal);
      // Optimistic update (prepend)
      setAnimals((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setSubmitError("Could not create the animal. Try again.");
      throw err; // mantiene el flujo del formulario
    }
  }

  // Derivar lista filtrada + búsqueda
  const filteredAnimals = useMemo(() => {
    const q = query.trim().toLowerCase();
    return animals.filter((a) => {
      const byType = typeFilter === "all" || a.type === typeFilter;
      const byStatus = statusFilter === "all" || a.status === statusFilter;
      const byQuery =
        q.length === 0 ||
        a.name?.toLowerCase().includes(q) ||
        a.type?.toLowerCase().includes(q) ||
        String(a.weight).includes(q) ||
        String(a.age).includes(q);
      return byType && byStatus && byQuery;
    });
  }, [animals, typeFilter, statusFilter, query]);

  return (
    <Layout title="My Reactive Farm 🐄🌾">
      {/* Loading / Error de carga */}
      {loading && <Loader message="Fetching animals from the farm…" />}
      {loadError && <Alert variant="error">{loadError}</Alert>}

      {/* Contenido principal */}
      {!loading && !loadError && (
        <div className="space-y-8">
          {/* Formulario controlado para crear animales */}
          <section aria-labelledby="create-animal">
            <h2 id="create-animal" className="mb-3 text-xl font-semibold">
              Add new animal
            </h2>
            <AnimalForm onSubmit={handleCreate} submitError={submitError} />
          </section>

          {/* Filtros y lista */}
          <section aria-labelledby="animals-list">
            <h2 id="animals-list" className="sr-only">
              Animals
            </h2>

            <AnimalList animals={filteredAnimals}>
              {/* Controls (composición) */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <label className="sr-only" htmlFor="search">
                  Search
                </label>
                <input
                  id="search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, type, age, weight…"
                  className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
                />

                {/* Type filter */}
                <label className="sr-only" htmlFor="type-filter">
                  Type
                </label>
                <select
                  id="type-filter"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

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
              </div>
            </AnimalList>
          </section>
        </div>
      )}
    </Layout>
  );
}
