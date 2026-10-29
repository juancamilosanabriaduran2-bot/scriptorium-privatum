import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = process.env.PORT || 3000;
const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const publicDir = path.resolve(currentDir, "../public");

app.use(express.json({ limit: "100kb" }));
app.use(express.static(publicDir));

const works = [
  {
    id: 1,
    title: "El libro de los seres imaginarios",
    author: "Jorge Luis Borges",
    period: "Siglo XX",
    category: "Bestiarios",
    language: "Español",
    description: "Una colección literaria de criaturas fantásticas procedentes de diversas tradiciones.",
    excerpt: "Cada cultura imagina sus criaturas y les concede un lugar en el orden del mundo.",
    cover: "bestiary"
  },
  {
    id: 2,
    title: "El nombre de la rosa",
    author: "Umberto Eco",
    period: "Edad Media (ambientación)",
    category: "Novela histórica",
    language: "Español",
    description: "Una investigación en una abadía medieval donde los libros guardan secretos y peligros.",
    excerpt: "En una biblioteca, cada pasillo puede ser un camino hacia el conocimiento o el misterio.",
    cover: "rose"
  },
  {
    id: 3,
    title: "Las mil y una noches",
    author: "Tradición oral",
    period: "Tradición medieval",
    category: "Cuentos",
    language: "Traducciones diversas",
    description: "Relatos enlazados por la voz de Sherezade, con viajes, maravillas y relatos dentro de relatos.",
    excerpt: "Una historia llama a otra, y la noche se prolonga gracias a la palabra.",
    cover: "nights"
  },
  {
    id: 4,
    title: "Libro de horas",
    author: "Autoría diversa",
    period: "Siglos XIII–XVI",
    category: "Manuscritos iluminados",
    language: "Latín y lenguas vernáculas",
    description: "Libros devocionales personales, a menudo enriquecidos con miniaturas y ornamentación.",
    excerpt: "Los márgenes también hablan: flores, animales y pequeñas escenas acompañan la lectura.",
    cover: "hours"
  }
];

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "scriptorium-privatum" });
});

app.get("/api/works", (req, res) => {
  const query = String(req.query.q || "").trim().toLocaleLowerCase("es");
  const category = String(req.query.category || "").trim().toLocaleLowerCase("es");
  const filtered = works.filter((work) => {
    const searchable = [work.title, work.author, work.category, work.period].join(" ").toLocaleLowerCase("es");
    return searchable.includes(query) && (!category || work.category.toLocaleLowerCase("es") === category);
  });
  res.json(filtered);
});

app.get("/api/works/:id", (req, res) => {
  const work = works.find((item) => item.id === Number(req.params.id));
  if (!work) return res.status(404).json({ error: "Obra no encontrada" });
  res.json(work);
});

app.get("*path", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(port, () => {
  console.log("Scriptorium Privatum disponible en http://localhost:" + port);
});
