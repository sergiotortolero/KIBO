# 17 · Síntesis ronda 2 — el conector

**Fecha:** 2026-08-08 · **Autor:** Claudio (orquestador) · **Insumos:** `11`…`16` (deltas de ronda 2) + ADR-0001 revisado
**Para:** Sergio Tortolero · **Estado:** cierre de la ronda 2

> Lee esto y luego el ADR. `07-sintesis.md` (ronda 1) sigue siendo válido en su diagnóstico,
> pero sus recomendaciones quedan sustituidas por las de aquí.

---

## 1 · Qué disparó esta ronda

Tu corrección: *"no me refería a que no generemos un plugin para intercomunicar los sistemas, me
refiero a que no quiero que la plataforma de Kibo sea un plugin dentro de Obsidian."*

Y tu modelo: Kibo estructura en base de datos lo que registras —**una consulta médica y sus
recetas**— y esa información viaja a la bóveda y de vuelta; si el usuario ya tiene bóveda, importa
y exporta.

Los seis especialistas reanudaron con su contexto de la ronda 1 intacto. Cada uno entregó un
**delta**, no una reescritura.

---

## 2 · El veredicto cambió

**Ronda 1: "hay una integración que vale la pena, no es la del PRD, y hoy no se puede empezar."**

**Ronda 2: hay una integración que vale la pena, es más pequeña y más barata de lo que parecía, tu
caso de uso central sí se puede construir, y el camino a valor demostrable se acortó de ~12 semanas
a ~7.**

Tres cosas lo explican:

1. **El plugin encogió a "tubería tonta".** Todo el conocimiento del formato vive en el servidor de
   Kibo; el plugin ejecuta un plan de escritura ya resuelto. ~1,000–1,500 líneas. Se versiona por
   protocolo, no por funcionalidades, así que el contrato evoluciona sin republicar el plugin — que
   importa porque la revisión automatizada de Obsidian escanea **cada versión**.
2. **Recursos dejó de bloquear.** Descubrimiento del análisis de monorepo: la proyección de
   entidades tipadas **no depende del módulo de notas en absoluto**. Recursos baja de fase 1 a fase
   5, el motor de rachas sale del camino crítico, y aparece una "vertical de proyección" como
   primera fase.
3. **Negocio subió de GO condicionado a GO** para el conector. Los dos riesgos que sostenían la
   condición —la comunidad no adopta gamificación, y la economía de gemas dentro del vault genera
   rechazo— **los elimina tu encuadre por diseño, no por mitigación**: si no hay UI de juego dentro
   de Obsidian, no hay superficie para ese rechazo.

---

## 3 · Dos agentes se corrigieron a sí mismos

Vale la pena registrarlo porque cambia conclusiones que en la ronda 1 parecían firmes.

**El auditor de seguridad levantó su propia prohibición sobre la salud.** Su razonamiento: la ronda
1 fundió tres decisiones con destinatarios distintos, y en protección de datos el destinatario es la
variable que decide.

| | Acto | Destinatario | Veredicto ronda 2 |
|---|---|---|---|
| (a) | Kibo escribe la nota `.md` en tu bóveda local | **tú mismo** | **Permitido** bajo condiciones |
| (b) | Kibo almacena el expediente en su nube | Kibo | Permitido (ya lo hacía; nunca estuvo prohibido) |
| (c) | Los datos entran a un prompt | proveedor LLM | **Prohibido, sin excepción** |

Su frase: *"dar al usuario sus propios datos no es una transferencia a un tercero"* — es literalmente
lo que obliga el derecho de portabilidad, y en "formato estructurado, de uso común y lectura
mecánica", que es la definición de Markdown con frontmatter. Y detectó una incoherencia propia: el
PRD ya ofrece *"exportar todo (Markdown/CSV)"* y la ronda 1 lo dio por bueno — **un export de salud
y una proyección de salud son los mismos bytes en el mismo disco**.

Su autocrítica textual: *"convertí un deber de diseño en una prohibición."*

**El arquitecto corrigió una regla suya mal fundada.** En la ronda 1 escribió "Finanzas y Salud nunca
al vault" citando el Art. 3 de tu constitución. Revisó: **el Art. 3 protege información financiera,
no de salud** — se había excedido. Salud pasa a opt-in por módulo; Finanzas sigue prohibida sin
negociación, y los campos monetarios se emiten vacíos para que la nota valide sin sacar la cifra de
la base.

---

## 4 · Las convergencias de esta ronda

**Arquitectura y UX llegaron a la misma corrección de tu eje de procedencia, por caminos opuestos.**

Yo propuse propiedad **por procedencia**: Kibo dueño de las notas que genera, el usuario de las que
escribe. Ambos lo aceptaron y ambos lo refinaron igual:

- **Arquitectura:** la procedencia no es estable en el tiempo. Kibo genera `Consulta 2026-08-08.md`;
  tres semanas después escribes abajo *"si sigue el dolor pedir resonancia"*. Regenerar la nota
  borraría eso. Corrección: **la unidad de propiedad es la región, no el archivo.** Frontmatter
  declarado y bloque delimitado son de Kibo; el resto del cuerpo es tuyo e intocable.
- **UX:** el eje es correcto en la capa de datos y equivocado en la de experiencia — la procedencia
  es invisible en el artefacto, un `.md` se ve igual que todos, y *"¿por qué no puedo editar esto?"*
  es peor que lo que resuelve. Corrección: **Kibo posee campos, no archivos**; el cuerpo siempre es
  tuyo; ninguna nota se bloquea nunca.

Es la misma regla dicha en dos idiomas. Y tiene precedente: el plugin oficial de Readwise es
*append-only* y nunca sobrescribe, mientras que su variante Mirror regenera el archivo y su propia
documentación declara que el usuario pierde la capacidad de modificar sus notas — la opción
minoritaria, elegida a sabiendas.

**Consecuencia buena:** el merge a tres bandas sigue siendo innecesario, y ahora se extiende a las
notas que Kibo genera — un caso que la ronda 1 no cubría.

**Otras tres convergencias:**

- **`kibo-id` pasa de opcional a obligatorio**, por tres caminos: arquitectura (por procedencia), UX
  (si puedes mover la nota, la ruta no puede ser la identidad) y seguridad. Pero es *más* restrictivo
  que antes: solo lo llevan los archivos que tú elegiste generar o adoptar. El "modo huella cero"
  sigue existiendo: no adoptar nada.
- **Bases es el objetivo, no Dataview.** Negocio y arquitectura coinciden: Kibo no necesita
  integrarse con cinco plugins, necesita **una sola disciplina** —frontmatter YAML con nombres de
  campo estables—. Eso alimenta gratis a Dataview (4.7M descargas) y a **Bases**, que es plugin
  *core* desde Obsidian 1.9.10 y por tanto está en el 100% de las instalaciones, a coste cero.
- **El ejemplo médico es conceptualmente correcto y mal primer caso de uso.** UX lo dice sin rodeos:
  dos eventos al año no producen un "ajá". Recomienda empezar por **Diario o Lectura**, que tienen
  frecuencia diaria.

---

## 5 · Tu ejemplo, resuelto de punta a punta

Registras la consulta en Kibo. Viaja a tu bóveda. **Sí se puede construir, con estas condiciones:**

- Acto **explícito y por categoría**, nunca por defecto, nunca dentro de "conectar bóveda".
- Vive en una **sub-raíz privada** (`Kibo/Private/`) que puedes excluir de git y de tu sync.
- Kibo **inspecciona el destino** antes de escribir (detecta `.git`, rutas de Dropbox/OneDrive/
  iCloud) y **declara que no puede estar seguro** — jamás dirá "tu bóveda no está sincronizada".
- **Nunca entra a un prompt de IA.** Y no como política sino como arquitectura: el servicio que
  compone prompts no debe tener credencial de lectura sobre esas tablas.
- **Sin wikilinks salientes** desde una nota clínica: un `[[Dr. Ramírez]]` crea un backlink en la
  nota del médico, que vive fuera de la carpeta privada y revela la asociación aunque el contenido
  nunca salga.
- El **título del archivo ya es dato de salud**: `Consulta oncología — Dr. Ramírez.md` filtra tanto
  como el contenido. Título neutro por defecto.

**Y aquí está el filo, que es una decisión de producto y no técnica.** Seguridad recomienda que el
comportamiento *por defecto* no sea la proyección completa sino una **nota-puntero**: identificador,
fecha, tipo genérico y un enlace profundo a Kibo. Los wikilinks funcionan, el grafo se conecta, tu
línea de tiempo queda completa — y en el disco no hay diagnóstico, ni fármaco, ni dosis. La
proyección completa con `prescriptions:` y `diagnosis:` queda como escalada opt-in.

El motivo es incómodo y hay que decirlo entero: **el mecanismo que hace valioso tu puente es
idéntico al que lo hace peligroso.** Frontmatter como columnas es lo que permite que Bases te arme
la tabla de tus consultas — y es exactamente lo que convierte una carpeta filtrada en un expediente
clínico consultable. Obsidian mantiene el frontmatter ya parseado en memoria y se lo entrega a todos
los plugins, que **no tienen sandbox**.

El auditor lo dijo así: *"quita el valor Dataview/Bases justo en el caso de salud. Esa es la decisión
de producto que no puedo tomar."*

La capa de IA aporta una figura complementaria: **zona de solo escritura** — Kibo escribe ahí y su
propia IA nunca lee de vuelta esa carpeta.

---

## 6 · El "ajá" no es lo que pensábamos

Mi hipótesis era que el momento de conversión sería ver tu registro de Kibo aparecer en una consulta
de Dataview. UX la corrigió: **eso es la prueba, no el "ajá"** — exige escribir un query, le llega a
pocos y tarde.

El "ajá" es **el primer backlink que no pediste**: la nota `Dra. Laura Pérez` con cuatro consultas
colgando, sin haber configurado nada.

De ahí sale la decisión más barata y de mayor impacto de las dos rondas: **Kibo debe emitir
`[[enlaces]]`, no texto plano.** Y un detalle técnico que la refuerza: como el soporte nativo de
backlinks desde frontmatter es limitado, Kibo debe emitir cada relación **dos veces** — en
frontmatter para que Bases y Dataview la consulten, y en el cuerpo para que el grafo funcione.

---

## 7 · La gamificación, revisada

UX afinó su crítica de la ronda 1: el efecto de sobrejustificación **depende de la saliencia, no del
lugar**. Tu encuadre entrega gratis una de las salvaguardas (no hay contador visible mientras
escribes), pero no elimina la expectativa: una vez que aprendes que escribir da XP, la anticipación
viaja contigo.

Y aparece un riesgo nuevo que antes no existía: **si escribir en Kibo paga y escribir en la bóveda
no, el sistema de recompensas compite contra la regla de oro** y te paga por escribir en el lugar
equivocado. Regla: recompensa idéntica sin importar dónde, o ninguna.

Además, con notas generadas, **Kibo produciría las huérfanas y luego te cobraría "misiones de enlace"
por adoptarlas**. Quitar esa mecánica pasa de recomendado a obligatorio.

Regla de oro revisada, de UX: **"Los datos se llenan en Kibo; las palabras se escriben en tu bóveda;
todo termina siendo archivos tuyos."**

---

## 8 · Lo que cambia en el plan de construcción

| | Ronda 1 | Ronda 2 |
|---|---|---|
| Primera fase | Recursos nativo (4–6 sem) | **Vertical de proyección** de una entidad tipada |
| Recursos | bloqueante | fase 5 |
| Motor de rachas | bloqueante para F1 | fuera del camino crítico |
| Camino a valor demostrable | ~12 semanas | **~7 semanas** |
| Plugin | producto con UI | tubería tonta, ~1,000–1,500 líneas, 3–4 semanas |
| Capa de mapeo | "1 semana" (erróneo, corregido) | **3–4 semanas** — tanto como el plugin entero |
| Modelo de datos | `Note` + `NoteFile` + `NoteLink` | `DomainRecord` supertipo con herencia por tabla; `Note` pasa a ser un subtipo |

**Prerrequisito nuevo que antes no existía:** hoy no hay **ninguna** entidad de dominio en Prisma. El
cuello de botella se movió de "el módulo de notas" a "cualquier módulo de dominio". No hay módulo de
Salud todavía — estamos diseñando el contrato del ejemplo con el que razonamos, no del producto.

**Validación más barata que existe, de UX:** mandarle a cinco personas, a mano, el `.md` de un
registro real suyo, y ver a la semana si lo enlazaron, lo movieron o lo olvidaron. Una semana, cero
código.

---

## 9 · Riesgos que desplazaron a los de la ronda 1

1. **El contrato de frontmatter es deuda que no controlas.** Una migración de Postgres corre en un
   despliegue; renombrar la clave `doctor` con 500 usuarios es una migración **en discos ajenos**,
   que solo corre cuando cada usuario abre Obsidian, puede fallar a la mitad, y rompe las consultas
   que el usuario escribió encima. Mitigación de secuencia, ya incorporada al ADR: **fijar ahora lo
   irreversible** (procedencia, regiones, identidad, alcance de escritura, canonicalización) y
   **dejar el vocabulario de claves de dominio sin congelar** hasta que exista el modelo de datos.
2. **Que el consentimiento envejezca mal.** Autorizas proyectar salud a una bóveda que hoy no está
   sincronizada, y en noviembre instalas Dropbox o corres `git init`. Se atenúa con reverificación y
   caducidad, no se elimina. Todo el diseño de consentimiento tiene que construirse sobre esa
   confesión, no sobre una garantía falsa.
3. **La ingesta es la puerta que la ronda 1 no analizó.** Un `.md` que nadie escribió pensando en
   Kibo se convierte en fila de base de datos, en tarea, en evento de racha y potencialmente en
   dosis clínica. El eslabón no es el diseño sino el parser: hay una CVE de 2025 en el parser de YAML
   más usado, y la coerción implícita de YAML 1.1 convierte `no` en `false` y `010` en `8`. Para una
   dosis, eso deja de ser un bug y pasa a ser un error clínico.

---

## 10 · Decisiones abiertas para ti

En orden de apalancamiento.

1. **Salud a la bóveda: ¿nota-puntero por defecto o proyección completa?** Es tu ejemplo y es la
   única decisión donde el valor y el riesgo son el mismo mecanismo. Ningún agente puede tomarla.
2. **¿Recursos deja de ser editor con bóveda vinculada?** Sobrevive de la ronda 1 pero **se hizo más
   pequeña**: ahora aplica solo a notas libres del usuario; las notas-registro son de Kibo por
   procedencia y se editan en Kibo sin ambigüedad.
3. **Notas adoptadas: ¿ampliar el alcance de escritura o exigir que el usuario mueva sus notas a la
   carpeta de Kibo?** El arquitecto lo escaló formalmente a seguridad y su lectura es que exigir
   reorganizar la bóveda es justo lo que hace que la gente desinstale integraciones. **Este bucle
   quedó abierto** — los dos agentes corrieron en paralelo y no se cruzaron.
4. **Cuál es el primer módulo de dominio que se construye.** Determina todo lo demás. UX recomienda
   Diario o Lectura por frecuencia, no Salud.
5. **Distribución del conector:** catálogo oficial, BRAT o instalación manual desde Kibo.
6. **Proveedor de ASR.** Hueco abierto del PRD: RF-14 asume dictado y la familia Claude no transcribe
   audio. Es el único hueco de coste sin cerrar.

---

## 11 · Correcciones pendientes al PRD

Además de las de la ronda 1 (`07-sintesis.md` §4), esta ronda añade:

- **Cancelar la F1** (racha, HP y hábitos dentro de Obsidian).
- **Acotar la regla de "archivos limpios"**: hoy está escrita como si aplicara a todo. Debe decir
  **"Kibo no escribe metadata en archivos que no creó"**. En una nota que Kibo generó, el frontmatter
  no es contaminación — es el contenido.
- **Re-derivar la métrica del §5**: ya no mide adquisición. Y su denominador incluye gente que
  estructuralmente no puede cumplir la condición, porque no usa Obsidian. Negocio propone un paso
  previo: medir elegibilidad con una pregunta en el onboarding antes de fijar cualquier meta.
- **Corregir el error factual** sobre Todoist y Zotero (solo Readwise tiene plugin oficial).

---

## 12 · Notas de proceso

- El documento de seguridad de la ronda 1 llevaba pegado un bloque de metadatos de sesión que
  introduje yo al recuperarlo tras la caída. El propio auditor lo detectó; ya está limpio.
- La skill `claude-api` no está instalada en este entorno. El ingeniero de IA fue a la documentación
  oficial y citó URL y fecha en cada dato de modelo o precio; ningún precio sale de memoria.
- Costes estimados de la capa de IA: perfil **Interop ≈ $0.13** por usuario activo al mes (sube a
  ~$0.17 cuando venza el precio introductorio de Sonnet 5 el 31-ago-2026); perfil **Completo ≈ $0.29
  → $0.40**. La lectura que importa: **la versión más privada del producto es también la más barata y
  la más rápida de construir.**
