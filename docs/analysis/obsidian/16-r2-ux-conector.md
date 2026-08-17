# 16 · R2 — UX del conector (delta sobre la ronda 1)

**Fecha:** 2026-08-08 · **Autor:** ux-researcher · **Encargo:** Claudio (ronda 2)
**Documento base:** `06-ux-y-adopcion.md` (R1). **Esto es solo el delta** — lo que cambia, lo que
se cae y lo que aparece. Todo lo no mencionado aquí sigue vigente.
**Fuera de alcance (otros especialistas):** arquitectura técnica del conector, seguridad y cifrado,
mercado, plan de fases.

**Etiquetas de evidencia** (igual que R1): **[H]** hecho verificado · **[H-2]** fuente secundaria ·
**[I]** inferencia mía · **[S]** supuesto declarado.

---

## 0 · Qué cambió y qué no

### 0.1 El reencuadre, traducido a consecuencias de diseño

| Corrección de Sergio | Consecuencia UX |
|---|---|
| Plugin **sí**, como conector delgado | El plugin deja de ser un producto y pasa a ser **plomería**. No tiene pantallas de marca, no tiene onboarding propio, no compite por atención. Su mejor cumplido es que el usuario se olvide de que existe. |
| **Kibo no vive dentro de Obsidian** — se cancela F1 | Muere toda la UI de Kibo en el vault. Muere la racha, el HP, los hábitos del día y el XP por escritura **dentro de la bóveda**. Ver §1.4 para lo que sobrevive dentro de Kibo. |
| **Obsidian no es canal de adquisición** | Cambian las personas (§4) y se derrumba el embudo de R1 §3.2: las fugas #1 (confianza ante una comunidad ajena) y #2 (convencer a un desconocido de apagar el Modo restringido) dejan de aplicar. **El usuario ya está adentro de Kibo cuando esto empieza.** |
| **Obsidian tiene estructura sin esquema; Kibo tiene esquema. El frontmatter es el puente** | Encuadre correcto y, además, **es la dirección en la que el propio Obsidian se movió**: en 2025 lanzó *Bases*, un plugin **núcleo** que convierte conjuntos de notas en bases de datos consultables, guardando los datos en Markdown + YAML frontmatter [H, E19]. Kibo no está forzando un uso raro; está aterrizando en el terreno que Obsidian ya preparó. Esto **fortalece** la tesis de Sergio y hay que decirlo. |

### 0.2 Impacto sobre mis tres preocupaciones de R1

| Preocupación R1 | Estado tras el reencuadre |
|---|---|
| **#1 · Dos superficies de escritura** | **Sigue viva, pero cambia de forma.** Ya no es "dos editores": ahora es **dos vocabularios y dos representaciones del mismo hecho**. Sigue siendo el riesgo número uno (§1). |
| **#2 · La gamificación mata lo que quiere fomentar** | **Parcialmente desactivada, y aparece un riesgo nuevo.** Fuera de Obsidian: resuelta. Dentro de Kibo: **la crítica sigue aplicando casi íntegra** — y el reencuadre crea una asimetría de recompensa que antes no existía (§1.4). Baja de #2 a #3. |
| **#3 · Diseñar para una comunidad que desconfía** | **Desactivada como riesgo de adquisición.** Claudio tiene razón: no le pedimos nada a esa comunidad. Pero Marina no desaparece — **se transforma de público objetivo en estándar de calidad** (§4.4). |
| — | **Aparece una preocupación nueva y sube directo al #2: datos sensibles en texto plano** (§7.1). El ejemplo central de Sergio es una consulta médica con recetas. |

---

## 1 · La regla de oro revisada (pregunta 1)

### 1.1 Postura sobre el eje de procedencia

**El eje de procedencia es correcto en la capa de datos y equivocado en la capa de experiencia.**
Sirve para que el sistema sepa quién escribe qué. No sirve como modelo mental del usuario, por una
razón concreta:

> **La procedencia es invisible en el artefacto.** Una vez que un `.md` está en la bóveda, se ve
> exactamente igual que todos los demás. Obsidian es una superficie deliberadamente homogénea:
> archivos planos, sin dueño, sin permisos, sin badge de origen [H, E1 de R1]. Una regla basada en
> "de dónde vino esta nota" le exige al usuario **recordar** el origen de cada archivo — y la
> memoria falla justo cuando importa: a los seis meses, cuando ya no se acuerda.

Y sí, tu sospecha es correcta: **"¿por qué esta nota no la puedo editar?" es peor que el problema
que resuelve.** Peor aún en Obsidian que en cualquier otra app, porque la promesa de marca del
producto anfitrión es literalmente *tus archivos, tuyos, para siempre*. Una nota bloqueada dentro
de una bóveda es una contradicción con el lugar donde vive.

**Hay precedente directo y documentado, en este mismo dominio.** El ecosistema ya corrió el
experimento con dos productos que resuelven el mismo problema con modelos de propiedad opuestos:

| | **Readwise oficial** | **Readwise Mirror** (comunitario) |
|---|---|---|
| Modelo | *Append-only*: agrega y **nunca sobrescribe** lo que escribiste | *Mirror*: el plugin **administra todos los archivos**; al llegar contenido nuevo, **regenera la nota** |
| Consecuencia declarada por el propio producto | Tus ediciones sobreviven | **"Los usuarios pierden la capacidad de modificar sus notas"** — decisión deliberada para que Readwise sea la fuente de verdad |
| Cuándo elegirlo | Si quieres control y editar | Si quieres espejo fiel |

[H, E17] Fuentes: [Readwise docs — Obsidian](https://docs.readwise.io/readwise/docs/exporting-highlights/obsidian) ·
[jsonMartin/readwise-mirror](https://github.com/jsonMartin/readwise-mirror) ·
[Readwise Mirror en Obsidian Stats](https://www.obsidianstats.com/plugins/readwise-mirror) — consultadas 2026-08-08.

**[I] Lectura:** el modo "espejo" existe, es legítimo y es **explícitamente la opción minoritaria**,
que se elige a sabiendas de que se pierde el derecho a editar. El modo por defecto de la integración
más querida del ecosistema es el que **nunca te quita el lápiz de la mano**.

### 1.2 La corrección: propiedad **por campo**, no por archivo

El eje de procedencia se salva bajando un nivel de granularidad:

> **Kibo no es dueño de notas. Es dueño de *campos*.**
> El **frontmatter que Kibo declaró** es de Kibo. **El cuerpo de la nota es del usuario, siempre.**
> Y **ninguna nota se bloquea nunca.**

Con eso, las tres categorías de Sergio se reordenan sin perder nada:

| Categoría | Quién manda | Qué puede hacer el usuario | Qué hace Kibo si el usuario lo cambia |
|---|---|---|---|
| **Nota-registro generada por Kibo** (la consulta médica) | Kibo escribe los **campos**; el usuario posee el **cuerpo** y el archivo | Todo: editar, mover, renombrar, enlazar, borrar | Respeta el cuerpo siempre. Si cambia un campo suyo → **pregunta una vez**, no revierte (§2.4) |
| **Nota escrita por el usuario** | El usuario, entero | Todo | Kibo no escribe nada ahí. Ni un campo. |
| **Nota del usuario de la que Kibo extrae registros** | El usuario, entero | Todo | **Nunca extrae en silencio: propone y el usuario confirma** (§1.5) |

**Esto resuelve la duplicidad de verdad**, y conviene nombrar por qué: la consulta médica va a
existir en dos lados (la base de Kibo y un `.md`). **Eso es duplicación de *representación*, no de
*autoría*.** La regla de R1 —"nunca dos lugares donde escribir lo mismo"— no se viola mientras
**cada campo tenga exactamente un lugar donde se captura**. Dos copias de un dato es infraestructura;
dos lugares donde teclear el mismo dato es un defecto de diseño. Son cosas distintas y R1 las
confundía. **Corrijo R1 §4.2 en ese punto.**

### 1.3 Regla de oro reformulada

La de R1 (*"tu bóveda es donde escribes; Kibo es donde eso se vuelve progreso"*) **queda obsoleta**:
ahora el usuario sí escribe en Kibo —llena el formulario de la consulta— y era justo lo que R1
prohibía. La sustituyo:

> ## **"Los datos se llenan en Kibo; las palabras se escriben en tu bóveda; todo termina siendo archivos tuyos."**

Con dos corolarios operativos, ambos en lenguaje de usuario:

> **La prueba del formulario.** ¿Dudas de dónde va algo? Pregúntate: *¿esto lo llenarías en un
> formulario o lo escribirías en un párrafo?* Formulario → Kibo. Párrafo → tu bóveda.

> **Kibo nunca te bloquea una nota.** Si cambias algo que Kibo llenó, te pregunta a quién le hace
> caso. Nunca decide por ti y nunca borra lo que escribiste.

**Por qué esta regla es mejor que la de R1 y que la de pura procedencia:** no exige recordar el
origen de nada (la crítica de §1.1), no exige entender la palabra "sincronización", y decide el
100% de los casos con una pregunta que cualquiera puede contestar en dos segundos. Es falsable:
si en las entrevistas la gente clasifica mal con la prueba del formulario, la regla está mal.

### 1.4 El puente cambia de criterio (corrección a R1 §4.3)

R1 definía el puente por **tipo de objeto** (solo nota diaria, nota de proyecto, nota de lectura).
Bajo el encuadre nuevo eso queda corto: una consulta médica no estaba en la lista y sí debe cruzar.
Sustituyo el criterio por uno de una línea:

> **Cruza lo que es un *hecho de tu vida*. No cruza lo que es *mecánica del juego*.**

| Cruzan (hechos) | No cruzan nunca (mecánica) |
|---|---|
| Consultas médicas, recetas, signos | XP, niveles, prestigio, paragón |
| Entrenamientos, sesiones de lectura, libros | HP, daño de retos |
| Entradas de diario, notas de estudio | Monedas K, gemas, cofres |
| Proyectos y su estado, tareas con fecha | Rachas, protectores, tiers de flama |
| Logros con fecha real *(discutible — ver abajo)* | Cosméticos, guardarropa de KIBO |

Un logro es un hecho ("terminé el reto de 30 días") **y** una mecánica (rareza, estandarte,
vitrina). **[I] Recomendación: cruza el hecho desnudo, no el trofeo.** Que en la bóveda diga
*"Terminé un reto de 30 días de lectura"* y no *"Estandarte Épico · +250 XP · rareza 4/5"*. La
prueba: si la línea se lee rara en un documento de texto dentro de diez años, no debía cruzar.

### 1.5 La categoría más peligrosa: extraer registros de notas del usuario

De las tres categorías, la que Sergio menciona de pasada —*"notas del usuario que Kibo solo lee
para extraer registros"*— es la de mayor riesgo de experiencia, porque es la única donde **algo
pasa sin que el usuario lo pida**. Escribe libremente en su nota diaria, y aparece un registro en
su expediente de salud.

**Regla dura: la extracción nunca es silenciosa.** Siempre es una propuesta que el usuario
confirma, y siempre con la cita textual de dónde salió.

> **KIBO:** *"En tu nota del 3 de agosto vi algo que parece una consulta médica:*
> *«fui con la Dra. Pérez, me recetó amoxicilina 500 por 7 días».*
> *¿La registro en Salud? Tu nota no se toca de ninguna manera."*
> `[ Sí, regístrala ]` `[ No es eso ]` `[ Ya no me preguntes de esto ]`

Tres cosas hacen que esto funcione y no asuste: **(a)** enseña la evidencia literal, **(b)** promete
explícitamente que la nota no se modifica, **(c)** el tercer botón existe y es permanente. Sin el
tercer botón, esto se vuelve acoso.

---

## 2 · Las notas-registro: qué espera el usuario hacer con ellas (pregunta 2)

**Advertencia de método:** no tengo entrevistas. Esto es **[I]** derivado de las afordancias de
Obsidian, de los precedentes documentados (E17) y de lo que la comunidad discute (R1 §1). Cada
expectativa lleva su consecuencia y el §8 dice cómo verificarla barato.

### 2.1 Expectativas, ordenadas por fuerza

| # | Expectativa | Fuerza | Consecuencia dura |
|---|---|---|---|
| **1** | **Enlazarla** desde otras notas con `[[...]]` | **Máxima. No negociable.** Enlazar es el verbo central de Obsidian; una nota que no se puede enlazar no está realmente en la bóveda | **Kibo no puede renombrar un archivo después de crearlo, jamás.** Si lo renombra, rompe enlaces que viven en notas del usuario — y arreglarlos exigiría escribir fuera de su carpeta, que es la línea que no se cruza |
| **2** | **Moverla de carpeta** | Alta. Es su bóveda y la reorganiza (R1 §1, E7: no hay consenso de estructura; cada quien tiene la suya) | **La ruta no puede ser la identidad.** Hace falta un identificador estable en el frontmatter (`kibo-id`) — ver §2.2 |
| **3** | **Escribir debajo, con sus palabras** | Alta. Es *el* caso de uso: el dato lo pone Kibo, el significado lo pone la persona | **Kibo nunca regenera el archivo completo.** Modo Readwise oficial, no modo Mirror (E17) |
| **4** | **Consultarla con Dataview / Bases** | Alta en el subconjunto avanzado; **es la prueba del valor** (§5) | Los nombres y **tipos** de propiedad deben ser idiomáticos: fecha en ISO para que se renderice el widget de fecha; booleano real para checkbox [H, E18] |
| **5** | **Editar un campo estructurado** (corregir el nombre del doctor) | Media, consecuencia alta | Se permite, se detecta, **se pregunta**. Nunca revertir en silencio: que se borre lo que acabas de teclear es exactamente el dolor documentado de los conflictos (R1 §1, E4) |
| **6** | **Borrarla** | Media, **ambigua y peligrosa** | ¿Borrar la nota borra la consulta del expediente? **[I] La mayoría esperaría que no** — borró un archivo, no su historial médico. Pero no es obvio. **Preguntar una sola vez, recordar la respuesta** (§2.4) |
| **7** | **Que aparezca en grafo y búsqueda** | Alta, y gratis si es un `.md` de verdad | Ninguna |
| **8** | **Que sobreviva a Kibo** | Media hoy, **decisiva en la cancelación** | La nota debe leerse bien como texto plano. Nada de bloques propietarios que se vean como basura sin el plugin |

### 2.2 La tensión del frontmatter se disuelve (corrección al brief §5)

El brief marcaba una contradicción real: *"¿'archivos limpios sin frontmatter' es compatible con
sync bidireccional? Sin identificador estable, ¿cómo se reconcilia un renombrado?"*

**Bajo el encuadre nuevo, la contradicción desaparece — pero solo si se parte la regla en dos:**

- En una nota **que escribió el usuario**, el frontmatter de Kibo **es contaminación**. Prohibido.
  Sigue vigente el "no hacer" del PRD §4.
- En una nota **que generó Kibo**, el frontmatter **no es contaminación: es el contenido**. Un
  `kibo-id` en una nota que Kibo escribió desde un formulario es tan legítimo como el campo `fecha`.

**[I] Recomiendo reformular el "no hacer" del PRD así:** *"Kibo no escribe metadata en archivos que
no creó."* Es más preciso, deja de bloquear la solución al problema de identidad, y sigue
protegiendo lo que importaba proteger.

Dos advertencias de campo, ambas verificadas:
- **[H, E21]** La comunidad ya se quejó de que la propia función *Properties* de Obsidian
  **reformatea** el frontmatter existente, y de que la metadata mete "ruido visual" a la nota
  ([Make New Properties Feature NOT Re-Format Frontmatter](https://forum.obsidian.md/t/make-new-properties-feature-not-re-format-frontmatter/66297), [Hide properties in Canvas Node](https://forum.obsidian.md/t/hide-properties-frontmatter-metadata-in-canvas-node-embed-view/106038)). Traducción: **el frontmatter debe ser corto.** Propongo un techo de diseño: **8 propiedades por nota**, contando `kibo-id`. Más allá de eso el usuario ve una nota que "es puro encabezado".
- **[H, E22]** Existe confusión estructural sobre a quién pertenece el frontmatter: el hilo
  [Frontmatter confusion — for plugins only and yet plugins require the data](https://forum.obsidian.md/t/frontmatter-confusion-for-plugins-only-and-yet-plugins-require-the-data/14796) muestra que ni la comunidad tiene resuelto si es del usuario o de las herramientas. **[I]** Kibo puede ganar puntos resolviéndolo explícitamente en su copy en vez de dejarlo ambiguo.

### 2.3 La nota generada tiene que parecer escrita por una persona

**[I] Riesgo alto y barato de evitar.** Si la nota se ve como un volcado de base de datos, el
usuario la esconde en una carpeta, nunca la enlaza y la feature muere aunque el conector funcione
perfecto. Cuatro reglas:

1. **Nombre de archivo legible y humano:** `2026-08-08 Consulta — Dra. Pérez.md`. No un UUID.
2. **Frontmatter corto** (§2.2) con los nombres del usuario, no los internos de Kibo (§3).
3. **Cuerpo redactado, no tabulado.** Una o dos frases en español que un humano leería, más el
   detalle. Y un espacio explícito, con encabezado, invitando a escribir: `## Mis notas`.
4. **Entidades como enlaces, no como texto.** `[[Dra. Laura Pérez]]`, no `doctor: Laura Pérez` en
   plano. Este detalle cuesta casi nada y es **la diferencia entre un registro y una nota que vive
   en el grafo** — y es la condición del "ajá" (§5).

### 2.4 Las dos preguntas que hay que hacer una sola vez

Ambas se hacen la primera vez que ocurren, no en el onboarding (nadie contesta bien preguntas
hipotéticas), y se recuerdan:

> **Editó un campo:** *"Cambiaste el doctor en la nota de tu consulta del 8 de agosto. ¿Lo corrijo
> también en tu expediente de Kibo?"*
> `[ Sí, corrígelo ]` `[ Solo en la nota ]` · <sub>`[ ] Haz esto siempre sin preguntarme`</sub>

> **Borró la nota:** *"Borraste la nota de tu consulta del 8 de agosto. ¿Quito también el registro
> de tu expediente, o solo la nota?"*
> `[ Quita las dos ]` `[ Solo la nota ]` · <sub>`[ ] Haz esto siempre`</sub>

---

## 3 · El mapeo de campos (pregunta 3)

### 3.1 Primero la decisión, después la pantalla

Antes de diseñar nada hay que contestar **quién se adapta a quién**. Tres opciones:

| Opción | Veredicto |
|---|---|
| (a) Kibo **renombra** los campos del usuario en su bóveda para que digan `date`, `doctor` | **No.** Mutación masiva de archivos ajenos el día uno. Es el acto que hace que te desinstalen. |
| (b) **Kibo aprende el vocabulario de la bóveda**: guarda el mapeo de su lado, lee `fecha` y **escribe `fecha`** | **Sí. Es la respuesta.** |
| (c) Conviven los dos vocabularios (`fecha` y `date` en la misma bóveda) | **No.** Parte las vistas del usuario en dos y nadie entiende por qué. |

> ## **"Kibo aprende cómo le dices tú a las cosas. No al revés."**

Y aquí está el punto que convierte el mapeo de trámite en beneficio, y que debe ser **el eje del
copy**: el mapeo no sirve principalmente para *importar*. Sirve para que **las notas nuevas que
Kibo escriba se vean como las que ya tienes, y tus vistas de Dataview y Bases sigan funcionando
sin que muevas nada** [H, E19]. Si Kibo escribiera `date:` en una bóveda que dice `fecha:`, le
partiría en dos las vistas que el usuario ya tenía armadas. El mapeo es **lo que evita romperle
algo**, no una burocracia de configuración.

*(Nota: si el usuario **sí** quisiera unificar nombres, Obsidian trae desde la v1.10 renombrado y
borrado masivo de propiedades de forma nativa [H-2, E20 — [hilo del foro](https://forum.obsidian.md/t/rename-a-property-value-across-all-notes/101275)]. **Kibo debe señalar esa función, no hacerlo por él.** "Tu bóveda ya sabe hacer eso" es una frase que compra mucha confianza.)*

### 3.2 Los seis principios de esa pantalla

1. **Kibo propone, el usuario corrige.** Nunca una pantalla en blanco. Auto-detección por nombre,
   por sinónimo es/en y **por forma del valor** (si dice `2026-03-14`, es una fecha).
2. **Un tipo de registro a la vez.** Jamás mapear la bóveda entera. "Empecemos por consultas
   médicas" y ya.
3. **Ejemplos reales de sus notas, no nombres abstractos.** Esta es la clave de "sin lenguaje
   técnico": no se explica qué es una clave YAML; **se enseña su propia nota**.
4. **El concepto de Kibo se expresa en humano**, nunca con el nombre interno del campo. La columna
   de en medio dice *"cuándo pasó"*, no `date`.
5. **Dos vistas previas antes de aplicar:** lo que voy a *leer* y lo que voy a *escribir*.
6. **Nada se modifica en tus notas.** Debe estar escrito en pantalla y debe ser cierto.

### 3.3 El flujo, con copys en es-MX

---

**M1 · Encuadre (por qué estamos aquí)**

> ### Enséñame cómo le dices tú a las cosas
> *"Vi que ya llevas tus consultas médicas en notas. Qué bien —así no empezamos de cero.*
> *Tú le pones **fecha** a lo que yo llamo *cuándo pasó*. No te voy a cambiar nada: **yo aprendo tu
> forma**, y las notas nuevas que te deje van a verse igualitas a las que ya tienes, para que tus
> vistas sigan funcionando."*
>
> `[ Va, enséñame ]` `[ Ahorita no ]`

---

**M2 · El mapeo, con sus propias notas de ejemplo**

> ### Así te entendí
> <sub>Encontré **23 notas** que parecen consultas médicas.</sub>
>
> | Tú le dices | Yo lo entiendo como | En tu nota del 14 de marzo |
> |---|---|---|
> | `fecha` | **cuándo pasó** ✓ | `2026-03-14` |
> | `médico` | **con quién** ✓ | `Dra. Laura Pérez` |
> | `lugar` | **dónde** ✓ | `Clínica del Valle` |
> | `receta` | **qué te recetaron** ✓ | `Amoxicilina 500 mg` |
> | `costo` | **¿esto qué es?** ⚠️ | `1,200` |
> | `humor` | *no lo uso* — **se queda como está** | `cansada` |
>
> *"Lo que marqué con ⚠️ no supe qué era. Y lo que dice «no lo uso» **se queda en tus notas tal
> cual**: no lo borro ni lo muevo, nomás no lo leo."*
>
> `[ Está bien así ]` `[ Déjame corregir ]`

**Detalle de diseño que importa:** la fila de `humor` está ahí a propósito. Enseñar explícitamente
que **lo que Kibo no entiende sobrevive intacto** es la manera más barata de comprar confianza en
esta pantalla. Ocultarlo produce exactamente la duda que mata la conversión.

---

**M3 · Vista previa — lo que voy a leer**

> ### Así se vería en Kibo
> <sub>Tres de tus 23 notas, para que veas si te late.</sub>
>
> ```
> 14 mar 2026 · Dra. Laura Pérez · Clínica del Valle
>               Amoxicilina 500 mg
> 02 feb 2026 · Dr. Ramón Ruiz  · Hospital Ángeles
>               Sin receta
> 19 ene 2026 · Dra. Laura Pérez · Clínica del Valle
>               Loratadina 10 mg
> ```
>
> **Tus notas no cambian.** Solo las leo.
>
> `[ Traer las 23 ]` `[ Traer solo estas 3 y ver qué tal ]` `[ Mejor no ]`

El botón de en medio importa: **permite probar sin comprometerse**. Es la versión barata de bajar
el riesgo percibido, y en R1 §3.2 la fuga #3 era justo el miedo del primer escaneo.

---

**M4 · Vista previa — lo que voy a escribir**

> ### Y así se vería una nota mía
> <sub>Cuando registres una consulta en Kibo, te voy a dejar esto en tu bóveda:</sub>
>
> ```markdown
> ---
> fecha: 2026-08-08
> médico: "[[Dra. Laura Pérez]]"
> lugar: Clínica del Valle
> receta: Amoxicilina 500 mg — 7 días
> kibo-id: c_8f3a21
> ---
>
> # Consulta — 8 de agosto de 2026
>
> Consulta con [[Dra. Laura Pérez]] en Clínica del Valle.
> Receta: amoxicilina 500 mg cada 8 horas, 7 días.
>
> ## Mis notas
>
> ```
>
> *"Uso **tus** palabras: dice `fecha` y `médico`, como en tus otras notas. Lo de `kibo-id` es mi
> marquita para no perderle la pista si la mueves de carpeta — puedes borrarla y no pasa nada
> grave, nomás dejo de saber que es la misma.*
> *El espacio de **Mis notas** es tuyo. Ahí escribe lo que quieras: eso yo no lo toco nunca."*
>
> `Guardar en la carpeta:` **[ Salud/Consultas ]**
> `[ Así está bien ]` `[ Cambiar algo ]`

---

**M5 · Lo que no encajó (nunca se esconde)**

> ### Tres cosas que dejé pendientes
>
> **13 notas se parecen pero no encontré la fecha.** Las dejé en paz. `[ Verlas ]`
> **`costo` no supe qué era.** Puedo mandarlo a Finanzas, o dejarlo así. `[ Decidir ]` `[ Dejarlo ]`
> **Te falta `duración`, que yo sí uso.** Lo voy a dejar vacío — no invento datos. `[ Ok ]`

**Tres reglas detrás de esta pantalla:** (a) nada se descarta en silencio, (b) **Kibo nunca
inventa un valor** para completar su esquema, (c) lo ambiguo se queda ambiguo hasta que el usuario
decida — nunca se resuelve por default.

---

**M6 · Deshacer**

Debe estar visible **durante** el proceso, no escondido en configuración:

> **Importar** → *"Deshacer es fácil: como no cambié ninguna de tus notas, deshacer es nomás que se
> me olvide lo que leí."* `[ Olvidar las 23 consultas ]`
>
> **Notas que Kibo escribió** → *"Escribí **7 notas** en `Salud/Consultas`. Sé exactamente cuáles
> son. ¿Las quito?"* `[ Quitar las 7 ]` `[ Dejarlas ]`
> <sub>Si las quitas, tus consultas siguen en Kibo. Solo se van los archivos.</sub>
>
> **Cambiar el mapeo después** → *"¿Le cambiaste el nombre a un campo en tu bóveda? Dímelo y lo
> vuelvo a aprender. Las notas viejas se quedan como están."*

**Regla de reversibilidad, explícita:** *deshacer el mapeo nunca reescribe notas viejas.* Las notas
que Kibo ya escribió son fotos del pasado y se quedan como están. Reescribir 200 archivos porque
cambió una configuración es precisamente el modo Mirror (E17) — el que hace que la gente pierda
confianza.

### 3.4 Palabras prohibidas en esta pantalla

`mapear` · `campo` · `clave` · `esquema` · `YAML` · `frontmatter` · `propiedad` (usar *"cómo le
dices"*) · `parsear` · `normalizar` · `migración` · `conflicto` · `sobrescribir`.

**Sí se puede decir:** *cómo le dices tú* · *lo que yo entiendo* · *en tu nota* · *no lo toco* ·
*se queda como está* · *lo dejo en paz* · *puedes deshacerlo*.

---

## 4 · Personas revisadas (pregunta 4)

Cambio estructural: **el ingreso ya no es por Obsidian, es por Kibo.** Eso reordena todo el elenco.

### 4.1 Persona primaria — **Andrea, la de los dos cerebros**

*Usuaria de Kibo (diaria, con hábitos y salud) que **además** tiene una bóveda de Obsidian que sí
usa.*

| Campo | Contenido |
|---|---|
| **Contexto** | Kibo le organiza la vida operativa; la bóveda le organiza el pensamiento y el trabajo. Son dos mundos que nunca se hablan, y a ella eso ya le molesta: son sus datos en los dos lados. |
| **Objetivos** | (1) Que su vida real sea **consultable con sus propias herramientas**. (2) Poder escribir *sobre* un hecho —lo que sintió en esa consulta— pegado al hecho. (3) Que sus datos existan como archivos suyos, pase lo que pase con Kibo. |
| **Herramientas hoy** | Kibo · Obsidian con propiedades y alguna vista de Dataview o Bases · sync entre dos dispositivos. |
| **Motivo real para adoptar** | **Poder preguntarle a su bóveda cosas de su vida.** *"¿Cuántas veces fui al doctor este año y cuánto gasté?"* Hoy esa pregunta no la puede hacer en ningún lado: Kibo tiene el dato pero no su lenguaje de consulta; la bóveda tiene el lenguaje pero no el dato. **Ese hueco es el producto.** |
| **Motivo real para rechazar** | (a) Que le rompa las vistas que ya tenía (por eso el §3 es crítico). (b) Que le llene la bóveda de archivos que ella no escribió. (c) Que las notas se vean como volcado de base de datos y le den pena (§2.3). |
| **Qué la haría abandonar a los 30 días** | **Que las notas generadas se queden como bloques muertos.** Si a los 30 días no hay **ni un solo `[[enlace]]` desde una nota suya hacia una nota generada por Kibo**, la feature está muerta aunque el conector funcione perfecto. Ver §4.5. |
| **Base de evidencia** | E17–E19 (Bases y Properties como capacidad real y creciente), R1 §1 |
| **Cómo se refuta** | Si resulta que a las usuarias de Kibo con bóveda **no les importa** consultar su vida —que usan la bóveda para trabajo y Kibo para vida, y les gusta que estén separados—, esta persona es falsa y la integración pierde su motivo. **Es la pregunta número uno de las entrevistas.** |

### 4.2 Persona secundaria — **Diego, la bóveda dormida** (actualizada desde R1 §2.2)

Su pronóstico **mejora** con el reencuadre, por un motivo que en R1 no existía: **Kibo le genera
contenido sin que él escriba.** Su bóveda muerta empieza a tener notas reales —sus consultas, sus
lecturas, sus entrenos— sin esfuerzo. Es el único camino plausible para revivir una bóveda muerta:
no pedirle que escriba, sino darle qué leer.

**Pero el riesgo se invierte y hay que decirlo:** si Kibo le genera 200 notas y él nunca escribe
ninguna, su bóveda pasa de estar muerta a estar **habitada por otro**. Es una forma más triste de
la misma muerte.
**[I] Regla derivada: el éxito de Diego no se mide en notas generadas, sino en notas generadas que
él tocó.** Si esa proporción es cero a los 30 días, Kibo lo convirtió en archivero de sí mismo.

### 4.3 Persona terciaria — **Ximena, sin bóveda, a quien Kibo le presenta Obsidian**

Claudio pregunta si aparece. **Aparece, pero no como persona: como un *momento*.** Y mi postura de
R1 §2.3 cambia parcialmente.

- **Lo que cambia:** ahora sí existe una propuesta de valor honesta para ella, que antes no existía.
  No es "organiza mejor tus notas" (para eso ya tiene Kibo); es **soberanía**: *"tus datos también
  existen como archivos tuyos, aunque un día dejes Kibo"*.
- **Lo que no cambia:** instalar y mantener un gestor de notas nuevo sigue siendo trabajo real a
  cambio de un beneficio abstracto. Y en su celular la ruta es mala [H, E8 de R1: en iOS la bóveda
  solo puede vivir en la carpeta de Obsidian en iCloud].

**Postura: no es público objetivo, es una oferta contextual de una sola vez.** Y —esto es lo
importante— **el gancho no es Obsidian**:

> *"¿Quieres que tus consultas también existan como archivos tuyos, en tu compu?"*

Obsidian es la *implementación*, no la promesa. Y el momento correcto no es un banner permanente
(eso es ruido, R1 §6.4): son **tres momentos donde la pregunta de soberanía ya está en su cabeza**:
al exportar datos, al cancelar Premium, y al preguntar "¿dónde viven mis datos?" en Configuración.
Una vez en cada uno. Si dice que no, se guarda 180 días.

### 4.4 Marina deja de ser persona y se vuelve **estándar de calidad**

La usuaria consolidada de R1 §2.1 ya no es alguien a quien hay que convencer de entrar. Pero sus
exigencias no desaparecen — **se vuelven el listón**. Propongo usarla como prueba binaria de
diseño, con el nombre que ya tiene:

> **La prueba de Marina.** Antes de aprobar cualquier decisión del conector: *si una usuaria con
> una bóveda de 3,000 notas y cinco años de historia viera esto pasar en su vault, ¿desinstalaría?*
> Si la respuesta es sí o "depende", la decisión no pasa.

Falla la prueba: renombrar archivos, escribir fuera de la carpeta acordada, meter frontmatter en
notas del usuario, regenerar archivos, reescribir notas viejas al cambiar el esquema, dejar 40
propiedades en el encabezado.

### 4.5 Indicador adelantado (barato y decisivo)

**[I]** El mejor indicador de si esto sirve no es "bóvedas conectadas" ni "notas sincronizadas".
Es:

> **% de usuarios conectados que, a los 30 días, tienen al menos un enlace `[[...]]` **desde** una
> nota escrita por ellos **hacia** una nota generada por Kibo.**

Mide lo único que importa: que la nota generada **se integró al pensamiento del usuario** en vez de
quedarse como un depósito. Es medible desde el propio conector, no requiere encuesta, y da señal
mucho antes que la retención. **Propongo que sustituya a la métrica del PRD §5** (que en R1 §3.2 ya
mostré que es aritméticamente inalcanzable, y que bajo este encuadre además mide lo que no
importa).

---

## 5 · El "ajá" del sistema combinado (pregunta 5)

### 5.1 Sí, se mueve — y se invierte de sentido

En R1 §3.3 el "ajá" iba **conocimiento → compromiso**: *"escribiste 6 notas sobre este proyecto y
llevas 3 semanas sin tocarlo"*. Bajo el encuadre nuevo, **la flecha se voltea**: ahora va
**compromiso → conocimiento**: *tus hechos de vida se vuelven material pensable con tus propias
herramientas*. Esa inversión es el cambio conceptual más grande de la ronda 2.

### 5.2 Tu hipótesis: casi. Es la **prueba**, no el "ajá"

Claudio propone: *el momento en que el usuario ve su registro de Kibo aparecer como nota
consultable por sus propios Dataview*.

**Correcto en el fondo, mal ubicado en el tiempo.** Dos objeciones concretas:

1. **Exige que el usuario escriba una consulta.** Escribir un query de Dataview o armar una vista
   de Bases es trabajo, y solo lo hace un subconjunto. Si el "ajá" depende de eso, **le llega a
   pocos y le llega tarde** (días, no minutos). Un "ajá" que hay que trabajar para conseguir no es
   un "ajá": es una recompensa.
2. **El ejemplo central tiene mala frecuencia.** Una consulta médica ocurre dos o tres veces al
   año. Con dos registros no hay nada que consultar, y sin historial sembrado la bóveda se queda
   vacía semanas. **[I] La consulta médica es un excelente ejemplo conceptual y un mal primer caso
   de uso.** Ver §5.4.

### 5.3 El "ajá" real: **el primer backlink que el usuario no pidió**

> Andrea abre la nota de su consulta, escribe abajo con sus palabras *"con esta doctora sí me
> sentí escuchada"*, y sin querer se da cuenta de que la nota `Dra. Laura Pérez` —que ella nunca
> creó— **ya tiene cuatro backlinks**: sus cuatro consultas. Su historial se armó solo, en su
> propio idioma, dentro de su propia bóveda.

Por qué este es el momento y no otro:

- **Ocurre sin configurar nada**, en la segunda o tercera nota generada.
- **Es visible sin buscarlo**: el panel de backlinks es nativo y está a la vista.
- **Es específicamente imposible en Kibo solo** (Kibo no tiene grafo) **y en Obsidian solo** (nadie
  captura consultas a mano). Es el único momento que **requiere las dos herramientas**, que es
  justo el objetivo que Sergio declaró: *aprovechar ambas*.

**Consecuencia de diseño, no negociable:** para que esto ocurra, Kibo **debe generar enlaces a
entidades, no texto plano** (§2.3, regla 4). `[[Dra. Laura Pérez]]`, no `doctor: Laura Pérez`. Un
enlace sin nota destino es perfectamente normal en Obsidian (aparece como enlace no resuelto y sale
en el grafo), así que no hay que crear nada extra. **Es la decisión más barata y de mayor impacto
de todo este documento.**

Y entonces sí, **la consulta con Dataview/Bases es el segundo momento: el de confirmación.** Ahí
Andrea deja de ser usuaria y se vuelve defensora. Pero llega después y no se le puede pedir al
onboarding que lo produzca.

### 5.4 Dos condiciones para que el "ajá" llegue a tiempo

1. **Sembrar el historial.** Si Kibo solo escribe notas hacia adelante, la bóveda tarda semanas en
   tener contenido. El onboarding debe ofrecer generar los últimos N registros existentes —con
   vista previa y conteo (§3.3, M4)— para que el grafo tenga algo el primer día.
2. **Elegir un primer tipo de registro con frecuencia alta.** Mi recomendación en orden:
   **Diario** (frecuencia diaria, mapea nativamente a las *daily notes* que la comunidad ya usa) >
   **Lectura / sesiones** > **Salud / entrenos** > **Consultas médicas**. La consulta médica se
   queda como el ejemplo con el que se explica el modelo, no como el primero que se construye.

---

## 6 · Sergio como usuario cero (pregunta 6)

### 6.1 Veredicto: **sigue siendo sí, y se vuelve más necesario — pero cambia de objetivo**

En R1 §7 el motivo era *ganar el gusto de una comunidad a la que hay que convencer*. **Ese motivo
casi se cae** con el reencuadre, y Claudio tiene razón en señalarlo.

Pero el reencuadre introduce una exigencia que R1 no tenía: **Sergio ahora tiene que diseñar un
esquema que viaje a frontmatter y regrese.** Eso no se diseña leyendo documentación. Hay tres cosas
que solo se aprenden usándolo:

1. **Qué se siente que una propiedad no cuadre.** Escribir `autor` en unas notas y `author` en
   otras, y ver la vista partirse en dos. **Ese dolor exacto es el §3 completo.** Una hora de uso
   da más criterio que este documento entero.
2. **Qué se siente que una app te escriba archivos.** Es literalmente la experiencia de Andrea
   (§4.1), y es imposible de imaginar bien.
3. **Cómo se ve una nota generada al lado de las tuyas.** El "parece volcado de base de datos"
   (§2.3) no se detecta en un mockup; se detecta cuando te da pena tu propia carpeta.

### 6.2 Protocolo revisado

**Se mantiene de R1 §7.2:** bóveda única, nombres sin acentos, la estructura de seis carpetas,
notas diarias en `YYYY-MM-DD`, plantilla de tres campos, **cero plugins las semanas 1–2**, y la
bitácora fuera de la bóveda (R1 §7.5).

**Se agrega (y es lo nuevo que importa):**

| Cuándo | Qué hacer | Qué criterio le da |
|---|---|---|
| **Semana 2** | Ponerle **propiedades** a 15 notas —a propósito de forma inconsistente: `autor` en unas, `author` en otras— y armar **una vista con Bases** (núcleo, sin plugins) y una consulta con Dataview | Todo el §3. Es la hora más rentable del mes. |
| **Semana 3** | **Dejar que algo le escriba notas.** Cualquier importador que genere `.md` con frontmatter (Readwise si tiene, un *web clipper*, un importador de RSS o de Kindle). Luego observar sin intervenir: ¿las enlazó?, ¿las movió?, ¿las editó?, ¿las volvió a abrir?, ¿le estorbaron en la búsqueda? | **La observación más valiosa de R2.** Es ser Andrea. Contesta el §2 con datos propios. |
| **Semana 4** | **Romper cosas a propósito:** mover una nota generada a otra carpeta, renombrarla, borrarla, y editarle un campo del frontmatter. Anotar qué se rompió y qué mensaje (si hubo) le dio la herramienta | Contesta §2.1 (#1, #2, #5, #6) y calibra los copys de §2.4 |
| **Sigue de R1, ahora opcional** | Provocar un conflicto de sync a propósito | Sigue siendo valioso para §6.3 de R1, pero baja de prioridad: con lectura + escritura acotada a una carpeta, los conflictos dejan de ser el escenario dominante |
| **Se degrada** | El plugin de gamificación de la semana 4 (R1 §7.2) | Cancelada la F1, ya no informa una decisión pendiente. Sigue siendo barato y sirve para la pregunta de Recursos (§1.4 / R1 §5), pero es opcional |

### 6.3 Cuánto tiempo

R1 pedía 30 días para congelar arquitectura de información y 60 para escribir en bóvedas ajenas.
**Se puede acelerar la parte que importa:**

- **Día 21 — congelar el esquema del puente y el modelo de mapeo.** El criterio para §3 y §2 se
  alcanza en tres semanas si se hacen las semanas 2 y 3 del protocolo de arriba. No hace falta
  esperar 30 días para eso.
- **Día 30 — sigue siendo el piso para el resto** (nomenclatura, IA general, la regla de oro).
- **60 días** ya no son necesarios: eran para la ruta bidireccional agresiva, que este encuadre
  vuelve menos central.

### 6.4 Lo que **sí** se cae de R1

- **K6 se disuelve.** Ya no hay que reclutar 5 usuarios consolidados de la comunidad Obsidian: el
  riesgo de alcance que medía ese criterio desapareció con el canal de adquisición.
- **El reclutamiento se abarata radicalmente.** El perfil ahora es *"gente que usa Obsidian y le
  interesaría una app de vida"*, no *"guardianes del local-first a los que hay que convencer"*.
- **El concierge (R1 §8.2, pieza 3) cambia de forma y mejora.** En vez de mandar un mensaje semanal
  con el "ajá", ahora es más directo y más barato: **mandarle a cinco personas, a mano, el archivo
  `.md` de un registro real suyo, pedirles que lo metan a su bóveda, y observar una semana después
  qué hicieron con él.** ¿Lo enlazaron? ¿Lo movieron? ¿Lo editaron? ¿Se acuerdan de que existe?
  Eso contesta todo el §2 con cinco personas, cero código y una semana. **Es la prueba más barata
  con más señal de las dos rondas.**
- **K3 se reformula:** *si menos de 2 de 5 tocaron el archivo que les mandé a la semana siguiente,
  no construyas esto.*

---

## 7 · Riesgos nuevos que introduce el reencuadre

Ninguno estaba en R1 porque el encuadre anterior no los producía.

### 7.1 Datos sensibles saliendo a texto plano — **nueva preocupación #2**

El ejemplo central de Sergio es **una consulta médica con recetas**. Ese dato hoy vive en una base
de datos con control de acceso, y va a terminar en **un archivo de texto sin cifrar** que
probablemente se sincroniza por iCloud o Dropbox y que **cualquier plugin comunitario instalado
puede leer** — Obsidian lo advierte con todas sus letras: los plugins comunitarios ejecutan código
de terceros que podría hacer daño [H, E2 de R1: [Plugin security](https://obsidian.md/help/plugin-security)].

**La arquitectura de seguridad no es mi encargo. El consentimiento informado sí lo es**, y es un
problema de UX puro: el usuario tiene que **entender** lo que está aceptando, en una frase, sin
alarmismo y sin letra chica. Tres reglas:

1. **Salud y finanzas NO viajan por defecto.** Nunca. Se activan una por una, con su propia
   pantalla. *(Finanzas además está cubierto por el Art. 3 de la constitución del workspace.)*
2. **Decirlo antes, no en los términos y condiciones:**
   > *"Ojo con esto: tus consultas se van a guardar como archivos de texto normales en tu compu.
   > Eso es bueno —son tuyos y los abre cualquier programa— pero también quiere decir que **no van
   > cifrados**, y que cualquier complemento que tengas instalado en Obsidian los puede leer.*
   > *Tú decides si tu salud viaja o se queda nomás en Kibo."*
   > `[ Que viaje ]` `[ Mejor se queda en Kibo ]`
3. **Granularidad por tipo de registro**, no un interruptor único de "sincronizar todo".

### 7.2 La bóveda como basurero de Kibo

**[I]** Si Kibo genera notas de todo, en seis meses el usuario tiene 800 archivos que no escribió,
y su grafo, su búsqueda y su barra lateral se llenan de ruido. Sería tomar la herramienta más
personal que tiene y llenársela de output de una máquina.

**Límite de diseño: el usuario elige qué tipos de registro viajan, y el default es *ninguno*.**
Opt-in por tipo, con conteo estimado antes de aceptar (*"esto te va a dejar como 3 notas al mes"*).
Nunca un botón de "sincronizar todo".

### 7.3 La asimetría de recompensa (y la respuesta a la pregunta fina de Claudio)

**La pregunta:** *¿la crítica de sobrejustificación sigue aplicando dentro de Kibo, o el efecto
depende de que la recompensa aparezca en el lugar donde se escribe?*

**Respuesta: depende de la *saliencia*, no del lugar — y por eso el reencuadre ayuda a medias.**

El mecanismo detrás del meta-análisis (R1 §5.2, E12) es la teoría de la evaluación cognitiva: una
recompensa socava la motivación intrínseca cuando es **(a) tangible, (b) esperada** y **(c) se
experimenta como control** de la conducta. El *lugar* donde se muestra el número solo importa en
tanto cambia (b) y (c). Entonces, tres casos:

| Caso | ¿Aplica la crítica? |
|---|---|
| **Notas escritas dentro de Kibo (Recursos)** | **Íntegra.** Recompensa tangible, esperada y contingente al acto, en la misma pantalla donde se escribe. **G1–G7 de R1 §5.4 siguen vigentes tal cual para Recursos.** Nada cambió aquí. |
| **Notas escritas en la bóveda, con XP otorgado en Kibo** | **Atenuada, no eliminada.** Sacar el contador de la superficie de escritura **baja la saliencia** — de hecho **el reencuadre entrega G2 gratis** ("sin contador visible mientras se escribe"). Pero **no elimina la expectativa**: en cuanto el usuario aprende que escribir da XP, la anticipación viaja con él; vive en su cabeza, no en la app. Sigue faltando G1 (no premiar el acto, premiar el retorno). |
| **La asimetría entre ambas** | **Riesgo nuevo, creado por el reencuadre.** |

**El riesgo nuevo, en concreto:** si escribir en Kibo da XP y escribir en la bóveda da menos, o más
tarde, o nada, **el sistema de recompensas empieza a competir contra la regla de oro**. Kibo
estaría pagándole al usuario por escribir en el lugar equivocado. El resultado predecible es el
peor de los mundos: notas de relleno dentro de Kibo para farmear, y la bóveda —que era el punto—
vacía.

> **Regla derivada: la recompensa por escribir debe ser idéntica sin importar dónde se escribió, o
> no debe existir.** Cualquier asimetría es un defecto de diseño, no un incentivo.

**Y una consecuencia que vale la pena decir sin rodeos:** con notas-registro generadas, **Kibo
estaría creando notas huérfanas por construcción** —una consulta médica que nadie enlazó todavía es,
por definición, huérfana— y después cobrándole al usuario "misiones de enlace" para adoptarlas.
Kibo genera las huérfanas y luego cobra por adoptarlas. **La recomendación de R1 §5.4 (G5:
eliminar las misiones de enlace) pasa de recomendada a obligatoria.**

---

## 8 · Recomendación

### 8.1 Postura

1. **El reencuadre mejora el proyecto y hay que decirlo.** Un conector delgado que traduce esquema
   ↔ frontmatter, sin UI de producto dentro del vault, es más defendible, más barato y más
   respetuoso que la F1 cancelada. Además **aterriza donde Obsidian ya se movió solo**: *Bases*
   convirtió el frontmatter en la capa de datos oficial del ecosistema [H, E19]. Sergio está
   empujando una puerta que ya estaba abierta.

2. **Propiedad por campo, no por archivo.** El eje de procedencia es correcto abajo e insuficiente
   arriba. **Ninguna nota se bloquea nunca**; Kibo posee los campos que declaró y el usuario posee
   el cuerpo y el archivo. El precedente Readwise oficial vs. Mirror (E17) muestra que el modelo
   "yo administro tus archivos" existe, funciona y es explícitamente el que la gente elige a
   sabiendas de que pierde algo.

3. **Regla de oro nueva:** *"Los datos se llenan en Kibo; las palabras se escriben en tu bóveda;
   todo termina siendo archivos tuyos."* Con la prueba del formulario como desempate y la promesa
   de no bloqueo como corolario.

4. **El mapeo lo hace Kibo, no el usuario.** *"Kibo aprende cómo le dices tú a las cosas."* Y el
   argumento de venta de esa pantalla no es "para poder importar": es **"para que tus notas nuevas
   se vean como las que ya tienes y no se te rompan tus vistas"**.

5. **Enlazar entidades, no escribir texto.** `[[Dra. Laura Pérez]]` en vez de `doctor: Laura Pérez`
   es la decisión más barata y de mayor impacto de las dos rondas: es la que produce el "ajá" (§5.3)
   y la que convierte un volcado en una nota viva.

6. **Cambiar el primer caso de uso.** La consulta médica es el mejor ejemplo **conceptual** y el
   peor **primer producto**, por frecuencia (§5.4). Empezar por Diario o Lectura.

7. **Sergio: sí, 30 días, con el protocolo revisado (§6.2), y esquema del puente congelado al día
   21.** Y la prueba de los cinco archivos `.md` mandados a mano (§6.4) antes de escribir código.

8. **Métrica:** sustituir la del PRD §5 por el indicador adelantado de §4.5 — *% de usuarios
   conectados con al menos un enlace propio hacia una nota generada, a los 30 días*.

### 8.2 Las tres cosas que más me preocupan (actualizadas)

**1 · La nota generada que nadie enlaza.** El fracaso silencioso: el conector funciona, el mapeo es
perfecto, las notas llegan puntuales… y se quedan en su carpeta sin que nadie las abra, las enlace
ni las consulte. La bóveda no se enriqueció: se le agregó un anexo. Es un fracaso caro porque
*parece éxito* en todos los tableros técnicos. Por eso insisto en el indicador de §4.5: es el único
que lo detecta a tiempo. **Y es exactamente lo que la prueba de los cinco archivos (§6.4) puede
descartar en una semana, sin construir nada.**

**2 · Datos de salud saliendo a texto plano sin que el usuario entienda lo que aceptó.** Sube
directo desde ningún lado hasta el segundo lugar. El ejemplo que Sergio eligió como central es
justamente la categoría más sensible, y el destino es un archivo sin cifrar que cualquier plugin
comunitario puede leer [H, E2]. La arquitectura le toca a otro; **el consentimiento entendible me
toca a mí**, y por eso propongo que salud y finanzas no viajen por defecto y que la advertencia se
diga en una frase clara, antes, y no en la letra chica. Si esto sale mal no sale mal en una métrica:
sale mal en la vida de alguien.

**3 · La asimetría de recompensa empujando a escribir en el lugar equivocado.** El reencuadre apagó
el peor incendio (XP dentro del vault) pero encendió uno chico y contraintuitivo: si Kibo paga por
escribir en Kibo y no paga por escribir en la bóveda, el producto va a estar comprando el
comportamiento que su propia regla de oro dice que no quiere. Se arregla barato —igualar o eliminar—
**si se decide antes de construir el módulo de Recursos, no después.** Y las "misiones de enlace"
hay que quitarlas: con notas generadas, Kibo produciría las huérfanas y luego cobraría por
adoptarlas.

---

## Fuentes nuevas de esta ronda

Todas consultadas el **2026-08-08**. Las fuentes de R1 (E1–E16) siguen vigentes y están en
`06-ux-y-adopcion.md`.

| # | Fuente |
|---|---|
| **E17** | [Readwise docs — Obsidian export](https://docs.readwise.io/readwise/docs/exporting-highlights/obsidian) · [readwiseio/obsidian-readwise](https://github.com/readwiseio/obsidian-readwise) · [jsonMartin/readwise-mirror](https://github.com/jsonMartin/readwise-mirror) · [Readwise Mirror — Obsidian Stats](https://www.obsidianstats.com/plugins/readwise-mirror) |
| **E18** | [Obsidian Help — Properties](https://obsidian.md/help/properties) · [Obsidian Help — YAML front matter](https://help.obsidian.md/Advanced+topics/YAML+front+matter) · [Properties: query for checkbox, numbers and empty values](https://forum.obsidian.md/t/properties-obsidian-query-for-checkbox-values-numbers-and-empty-null-no-value-values/66431) |
| **E19** | [Obsidian changelog — Desktop v1.9.0 (2025-05-21)](https://obsidian.md/changelog/2025-05-21-desktop-v1.9.0/) · [Anuncio oficial de Bases](https://x.com/obsdmd/status/1925210385935913139) · [An Overview of the Bases Core Plugin](https://practicalpkm.com/bases-plugin-overview/) · [Neowin — Obsidian 1.9.0](https://www.neowin.net/news/obsidian-190-launches-with-new-file-format-footnotes-view-plugin-and-more/) |
| **E20** | [H-2] Renombrado/borrado masivo de propiedades nativo desde v1.10 — [Rename a property value across all notes](https://forum.obsidian.md/t/rename-a-property-value-across-all-notes/101275) · [How can I rename a frontmatter/property value in all my notes?](https://forum.obsidian.md/t/how-can-i-rename-a-frontmatter-property-value-in-all-my-notes/68009) *(fuente de foro, no changelog oficial — verificar antes de citarlo hacia afuera)* |
| **E21** | [Make New Properties Feature NOT Re-Format Frontmatter](https://forum.obsidian.md/t/make-new-properties-feature-not-re-format-frontmatter/66297) · [Hide properties in Canvas Node](https://forum.obsidian.md/t/hide-properties-frontmatter-metadata-in-canvas-node-embed-view/106038) |
| **E22** | [Frontmatter confusion — for plugins only and yet plugins require the data](https://forum.obsidian.md/t/frontmatter-confusion-for-plugins-only-and-yet-plugins-require-the-data/14796) · [Make file metadata and properties separate concepts](https://forum.obsidian.md/t/make-file-metadata-and-properties-separate-concepts/75664) |

---

**Siguientes manos sugeridas** *(recomendación, no ejecución)*
- Pantallas de mapeo (§3) y anatomía visual de la nota generada (§2.3) → `ui-designer`.
- Prueba de los cinco archivos `.md` (§6.4) como compuerta antes de construir → `product-planner`.
- PRD del conector con la regla de oro (§1.3), el criterio del puente (§1.4) y el consentimiento
  de datos sensibles (§7.1) → `pm-docs`.
- El esquema ↔ frontmatter, la identidad estable (`kibo-id`) y la política de no-reescritura
  (§2.2, §3.3-M6) → `solution-architect`.
