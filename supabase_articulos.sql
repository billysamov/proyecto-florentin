-- =========================================================
-- TABLA DE ARTÍCULOS (BLOG & CMS MULTILINGÜE) - FLORENTIN
-- =========================================================

CREATE TABLE IF NOT EXISTS public.articulos (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  extracto TEXT,
  contenido TEXT NOT NULL,
  -- Capa 2: Francés (Français)
  titulo_fr TEXT,
  extracto_fr TEXT,
  contenido_fr TEXT,
  meta_titulo_fr TEXT,
  meta_descripcion_fr TEXT,
  -- Capa 3: Inglés (English)
  titulo_en TEXT,
  extracto_en TEXT,
  contenido_en TEXT,
  meta_titulo_en TEXT,
  meta_descripcion_en TEXT,
  -- Metadatos generales
  imagen_portada TEXT DEFAULT '/french_hero.png',
  categoria TEXT DEFAULT 'Consejos',
  palabras_clave TEXT,
  meta_titulo TEXT,
  meta_descripcion TEXT,
  tiempo_lectura INTEGER DEFAULT 5,
  idioma TEXT DEFAULT 'es' CHECK (idioma IN ('es', 'fr', 'en')),
  autor TEXT DEFAULT 'Florentin',
  publicado BOOLEAN DEFAULT false,
  visitas INTEGER DEFAULT 0,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Si la tabla ya existía, añadir las columnas multilingües de forma segura
ALTER TABLE public.articulos 
  ADD COLUMN IF NOT EXISTS titulo_fr TEXT,
  ADD COLUMN IF NOT EXISTS extracto_fr TEXT,
  ADD COLUMN IF NOT EXISTS contenido_fr TEXT,
  ADD COLUMN IF NOT EXISTS meta_titulo_fr TEXT,
  ADD COLUMN IF NOT EXISTS meta_descripcion_fr TEXT,
  ADD COLUMN IF NOT EXISTS titulo_en TEXT,
  ADD COLUMN IF NOT EXISTS extracto_en TEXT,
  ADD COLUMN IF NOT EXISTS contenido_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_titulo_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_descripcion_en TEXT;

-- Índices de aceleración para SEO, listados y filtrado
CREATE INDEX IF NOT EXISTS idx_articulos_slug ON public.articulos(slug);
CREATE INDEX IF NOT EXISTS idx_articulos_publicado ON public.articulos(publicado);
CREATE INDEX IF NOT EXISTS idx_articulos_idioma ON public.articulos(idioma);
CREATE INDEX IF NOT EXISTS idx_articulos_categoria ON public.articulos(categoria);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.articulos ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad
DROP POLICY IF EXISTS "Lectura publica articulos publicados" ON public.articulos;
CREATE POLICY "Lectura publica articulos publicados"
  ON public.articulos FOR SELECT
  USING (publicado = true OR (auth.role() = 'service_role') OR (public.es_admin(auth.uid())));

DROP POLICY IF EXISTS "Gestion articulos solo admin" ON public.articulos;
CREATE POLICY "Gestion articulos solo admin"
  ON public.articulos FOR ALL
  USING ((auth.role() = 'service_role') OR (public.es_admin(auth.uid())));

-- =========================================================
-- ARTÍCULOS SEMILLA CON 3 CAPAS: ESPAÑOL, FRANÇAIS, ENGLISH
-- =========================================================

INSERT INTO public.articulos (
  slug,
  titulo,
  extracto,
  contenido,
  titulo_fr,
  extracto_fr,
  contenido_fr,
  titulo_en,
  extracto_en,
  contenido_en,
  imagen_portada,
  categoria,
  palabras_clave,
  meta_titulo,
  meta_descripcion,
  tiempo_lectura,
  idioma,
  autor,
  publicado,
  visitas
) VALUES 
(
  'como-pronunciar-la-r-francesa-guia-definitiva',
  -- Español
  'Cómo pronunciar la "R" francesa sin morir en el intento',
  'Descubre el método anatómico y los 3 ejercicios prácticos que uso con mis alumnos de París para dominar la R gutural francesa desde la primera semana.',
  '## El mito del sonido imposible

Para la gran mayoría de hispanohablantes, la **R francesa** (técnicamente conocida como fricativa uvular sonora) parece un obstáculo insuperable. Sin embargo, no se trata de fuerza ni de suerte: se trata de comprender **dónde** se produce el sonido en tu boca.

En español, la "R" se articula con la punta de la lengua golpeando el paladar anterior (alveolos). En francés, **la punta de la lengua no se mueve en absoluto**: se queda relajada detrás de los dientes inferiores. Todo el trabajo ocurre en la parte posterior, junto a la campanilla (úvula).

---

### Paso 1: El truco del bostezo o de hacer gárgaras

El mejor punto de partida es imitar la posición que adopta tu garganta al hacer gárgaras suaves con agua:

1. Coloca un poco de agua o simplemente simula el gesto en seco.
2. Siente cómo la parte posterior de la lengua sube ligeramente hacia el velo del paladar.
3. Exhala aire suavemente: notarás una vibración suave sin forzar la laringe.

> **💡 Consejo parisino:** No intentes raspar la garganta con agresividad como si fuera una "J" española fuerte. La R francesa moderna en París es suave y fluida, casi un suspiro con fricción.

---

### Paso 2: La posición de la lengua (La regla de oro)

Apoya la punta de tu lengua detrás de los dientes incisivos inferiores y **mantenla pegada allí**. Ahora intenta pronunciar las siguientes combinaciones:

- **Tra** -> *Train* (Tren)
- **Gra** -> *Grand* (Grande)
- **Par** -> *Paris* (París)
- **Mer** -> *Merci* (Gracias)

Notarás que al principio suena exagerado, pero con 5 minutos de práctica diaria frente al espejo, tu cerebro creará el nuevo camino neuromuscular.

---

### ¿Quieres practicar con retroalimentación en tiempo real?

En mis clases individuales 1 a 1 corregimos tu postura vocal, entonación y ritmo desde la primera lección para que hables con total naturalidad y seguridad. ¡Reserva tu sesión de prueba gratuita y compruébalo tú mismo!',
  
  -- Français
  'Comment prononcer le "R" français sans effort',
  'Découvrez la méthode anatomique et les 3 exercices pratiques que j''utilise avec mes élèves à Paris pour maîtriser le R français dès la première semaine.',
  '## Le mythe du son impossible

Pour beaucoup d''apprenants, le **R français** semble être un obstacle insurmontable. Pourtant, ce n''est ni une question de force ni de hasard : il s''agit simplement de comprendre **où** le son est produit dans votre bouche.

La pointe de votre langue ne doit pas bouger : elle reste détendue derrière les incisives inférieures. Tout le travail se passe à l''arrière, près de la luette.

---

### Étape 1 : Le réflexe du gargarisme

Le meilleur point de départ est d''imiter la position de votre gorge lorsque vous vous gargarisez doucement :

1. Faites le geste doucement à sec ou avec une gorgée d''eau.
2. Sentez l''arrière de votre langue remonter vers le voile du palais.
3. Expirez doucement : vous obtiendrez une légère vibration sans forcer sur les cordes vocales.

> **💡 Conseil parisien :** Ne forcez pas la gorge de manière agressive. Le R parisien moderne est doux, fluide et presque aérien.

---

### Étape 2 : La position de la langue

Gardez la pointe de la langue bien collée derrière vos dents du bas. Répétez ces mots :

- **Train**
- **Grand**
- **Paris**
- **Merci**

---

### Envie de pratiquer avec un retour personnalisé ?

Dans mes cours particuliers 1 à 1, nous travaillons votre prononciation et votre aisance pour que vous parliez avec plaisir et confiance. Réservez votre séance d''essai gratuite !',

  -- English
  'How to Pronounce the French "R" Without the Struggle',
  'Discover the anatomical technique and 3 practical exercises I use with my students in Paris to master the French guttural R from week one.',
  '## The Myth of the Impossible Sound

For many learners, the **French R** seems like an insurmountable barrier. However, it is not about force or throat scraping: it is about understanding **where** the sound is produced in your mouth.

In English or Spanish, the tongue taps forward. In French, **the tip of the tongue does not move at all**: it rests relaxed behind your bottom front teeth. All the articulation happens at the back, near the uvula.

---

### Step 1: The Gentle Gargle Technique

The easiest way to locate the right muscle is to mimic the gentle throat position of gargling water:

1. Imagine gargling gently without water.
2. Feel the back of your tongue rise toward your soft palate.
3. Exhale smoothly: you will produce a gentle friction sound.

> **💡 Parisian Tip:** Never scrape aggressively. The modern Parisian R is soft, subtle, and effortless.

---

### Step 2: Practice Pairs

Keep the tip of your tongue locked behind your lower teeth and pronounce:

- **Train**
- **Grand**
- **Paris**
- **Merci**

---

### Want Real-Time Feedback from a Native?

In my 1-on-1 private lessons, we refine your accent and natural flow from day one. Book your free 20-minute trial session today!',
  
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  'Pronunciación',
  'pronunciación francesa, r francesa, parler francais, french pronunciation',
  'Cómo pronunciar la R francesa: Guía paso a paso | Florentin',
  'Aprende a pronunciar la R francesa de forma natural con técnicas anatómicas y ejercicios prácticos de un profesor nativo parisino.',
  4,
  'es',
  'Florentin',
  true,
  142
),
(
  'diferencia-entre-c-est-y-il-est',
  -- Español
  'C''est vs Il est: Deja de confundirlos para siempre',
  'Una de las dudas más frecuentes de los estudiantes de francés explicada con una fórmula sencilla y ejemplos claros de la vida cotidiana en Francia.',
  '## Una duda clásica que delata a los estudiantes

Tanto **"C''est"** como **"Il est"** se traducen frecuentemente al español como *"Es"*. Por eso, es completamente natural que al empezar a hablar francés dudes cuál utilizar en cada frase.

Pero la buena noticia es que existe una **regla de oro infalible** que te permitirá acertar el 99% de las veces.

---

### La Regla de Oro

#### 1. Usamos "C''est" cuando va seguido de un determinante:
Un determinante puede ser un artículo (*un, une, des, le, la, les*) o un posesivo (*mon, ma, ton, son*):

- **C''est un** ami. *(Es un amigo.)*
- **C''est le** professeur de français. *(Es el profesor de francés.)*
- **C''est ma** valise. *(Es mi maleta.)*
- **C''est** Florentin. *(Es Florentin - nombre propio).*

> **Regla nemotécnica:** Si después de "es" dices "un/una/el/la/mi/tu", siempre usa **C''est**.

---

#### 2. Usamos "Il est" / "Elle est" cuando va seguido directamente de un adjetivo o una profesión:
En este caso **no hay artículo** en medio:

- **Il est** français. *(Es francés - nacionalidad/adjetivo).*
- **Elle est** médecin. *(Ella es médico - profesión sin artículo).*
- **Il est** intelligent. *(Él es inteligente - adjetivo).*
- **Il est** 15h00. *(Son las 15:00 - para decir la hora).*

---

### Tabla Comparativa Rápida

| Estructura | Ejemplo Francés | Traducción |
| :--- | :--- | :--- |
| **C''est + determinante + sustantivo** | *C''est un bon livre.* | Es un buen libro. |
| **Il est + adjetivo** | *Il est grand.* | Es alto. |
| **Il est + profesión** | *Il est professeur.* | Es profesor. |
| **C''est + nombre propio** | *C''est Sophie.* | Es Sophie. |',

  -- Français
  'C''est vs Il est : La règle d''or pour ne plus hésiter',
  'L''une des erreurs les plus fréquentes des apprenants enfin expliquée avec une formule claire et des exemples concrets du quotidien.',
  '## Une confusion fréquente

Beaucoup d''étudiants hésitent entre **"C''est"** et **"Il est"**. Pourtant, il existe une règle très simple pour ne plus jamais vous tromper.

---

### La Règle d''Or

#### 1. Utilisez "C''est" devant un déterminant + nom :
Un déterminant peut être un article (*un, une, des, le, la, les*) ou un possessif (*mon, ma, ton*) :

- **C''est un** ami.
- **C''est le** professeur.
- **C''est ma** valise.
- **C''est** Florentin. *(Prénom)*

---

#### 2. Utilisez "Il est" / "Elle est" directement devant un adjectif ou une profession :
Ici, **aucun article** n''est utilisé :

- **Il est** français. *(Nationalité)*
- **Elle est** médecin. *(Profession)*
- **Il est** ponctuel. *(Adjectif)*
- **Il est** 14h00. *(Heure)*',

  -- English
  'C''est vs Il est: The Golden Rule to Stop Confusing Them',
  'One of the most common pitfalls for French learners explained with a simple formula and real-life everyday examples.',
  '## A Classic French Dilemma

Both **"C''est"** and **"Il est"** translate to *"It is"* or *"He is"*. It is completely natural to hesitate when speaking.

Here is the **foolproof rule** that works 99% of the time.

---

### The Golden Rule

#### 1. Use "C''est" before a determiner + noun:
A determiner means an article (*un, une, le, la*) or a possessive (*mon, ma, ton*):

- **C''est un** ami. *(He is a friend / It is a friend.)*
- **C''est le** professeur. *(He is the teacher.)*
- **C''est ma** valise. *(It is my suitcase.)*
- **C''est** Florentin. *(It is Florentin - proper name).*

---

#### 2. Use "Il est" / "Elle est" directly before an adjective or profession (No article):
- **Il est** français. *(He is French - nationality).*
- **Elle est** médecin. *(She is a doctor - profession without article).*
- **Il est** intelligent. *(He is intelligent - adjective).*
- **Il est** 15:00. *(It is 3 PM - time).*',
  
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
  'Gramática',
  'gramatica francesa, c est vs il est, erreurs francais',
  'C''est vs Il est en Francés: Guía y Diferencias | Florentin',
  'Descubre la regla infalible para no volver a confundir C''est y Il est en francés con ejemplos prácticos y tabla resumen.',
  5,
  'es',
  'Florentin',
  true,
  98
),
(
  'vocabulario-esencial-restaurante-paris',
  -- Español
  'Cómo pedir en un restaurante en París como un auténtico local',
  'Las frases indispensables, las normas de cortesía que los parisinos aprecian y los errores más comunes al pedir la cuenta.',
  '## La gastronomía en París: Una experiencia cultural

Comer en un bistró o café en París es mucho más que alimentarse: es un ritual social. Para disfrutarlo al máximo y recibir un servicio amable, hay una serie de fórmulas de cortesía y vocabulario clave que debes conocer.

---

### La palabra mágica que lo cambia todo: "Bonjour"

En Francia, antes de formular cualquier pregunta o pedido, **siempre** debes saludar al camarero:

> *"Bonjour Madame"* o *"Bonjour Monsieur"*.

Si pides una mesa o la carta directamente sin saludar, en la cultura francesa puede percibirse como una falta de educación involuntaria. Un *"Bonjour"* con una sonrisa abre todas las puertas.

---

### Frases indispensables para tu visita

#### Para pedir una mesa:
- **Une table pour deux personnes, s''il vous plaît.** *(Una mesa para dos personas, por favor.)*
- **Est-ce qu''on peut s''asseoir en terrasse ?** *(¿Podemos sentarnos en la terraza?)*

#### Al ordenar comida y bebida:
- **Pour moi, ce sera le plat du jour.** *(Para mí, será el plato del día.)*
- **Je vais prendre une carafe d''eau, s''il vous plaît.** *(Voy a tomar una jarra de agua del grifo - ¡en Francia es gratuita y de excelente calidad!).*
- **Quel vin me conseillez-vous ?** *(¿Qué vino me recomienda?)*

#### Al momento de pagar:
- **L''addition, s''il vous plaît.** *(La cuenta, por favor.)*
- **Est-ce que je peux payer par carte ?** *(¿Puedo pagar con tarjeta?)*',

  -- Français
  'Comment commander au restaurant à Paris comme un vrai local',
  'Les phrases indispensables, les codes de politesse parisiens et les astuces pour profiter pleinement des cafés et bistrots.',
  '## La gastronomie à Paris : Un rituel culturel

Prendre un café ou déjeuner dans un bistrot parisien est un art de vivre. Voici les expressions clés et les formules de politesse indispensables.

---

### Le mot magique : "Bonjour"

Avant de demander une table ou de passer commande, saluez toujours chaleureusement le serveur :

> *"Bonjour Madame"* ou *"Bonjour Monsieur"*.

Un *"Bonjour"* souriant transforme immédiatement l''accueil et la relation avec le serveur.

---

### Expressions utiles au quotidien

- **Une table pour deux, s''il vous plaît.**
- **Pour moi, ce sera le plat du jour.**
- **Une carafe d''eau, s''il vous plaît.** *(L''eau du robinet est excellente et toujours gratuite en France !)*
- **L''addition, s''il vous plaît.**',

  -- English
  'How to Order at a Restaurant in Paris Like a True Local',
  'Essential phrases, cultural etiquette that Parisians appreciate, and tips on water, tipping, and paying the bill.',
  '## Dining in Paris: A Cultural Ritual

Sitting at a Parisian terrace or bistro is a cherished cultural experience. Here are the polite formulas and essential vocabulary to enjoy it like a Parisian.

---

### The Magic Word: "Bonjour"

Always greet your waiter before asking for anything:

> *"Bonjour Madame"* or *"Bonjour Monsieur"*.

In French culture, greeting first is essential polite etiquette that sets a friendly tone for your entire meal.

---

### Essential Phrases

- **Une table pour deux personnes, s''il vous plaît.** *(A table for two, please.)*
- **Pour moi, ce sera le plat du jour.** *(For me, I will have today''s special.)*
- **Une carafe d''eau, s''il vous plaît.** *(A jug of tap water, please - completely free and high quality in France!)*
- **L''addition, s''il vous plaît.** *(The check, please.)*',

  'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
  'Cultura & Viajes',
  'frances para viajar, restaurant paris, travel france',
  'Vocabulario Francés para Restaurantes en París | Florentin',
  'Aprende las frases esenciales y fórmulas de cortesía para ordenar en cafés y restaurantes parisinos como un local.',
  3,
  'es',
  'Florentin',
  true,
  210
)
ON CONFLICT (slug) DO UPDATE SET
  titulo_fr = EXCLUDED.titulo_fr,
  extracto_fr = EXCLUDED.extracto_fr,
  contenido_fr = EXCLUDED.contenido_fr,
  titulo_en = EXCLUDED.titulo_en,
  extracto_en = EXCLUDED.extracto_en,
  contenido_en = EXCLUDED.contenido_en;
