# Kibo — Manual de Usuario

Cómo entrar, navegar y hacer cada tarea.

**Para quién es:** Quien use Kibo todos los días.
**Versión:** 1.0-alpha

## Registro de modificaciones

| Versión | Fecha | Editó | Qué cambió | Por qué |
|---|---|---|---|---|
| 1.0-alpha | 2026-09-05 | technical-writer | Primer documento de manual de usuario | Migración de ARCHITECTURE.md v1.7 a documentación de cinco piezas (Art. 5). Contenido de pantallas PENDING por falta de prototipo funcional |

## Contenido

- [1. Entrada y configuración](#1-entrada-y-configuración)
- [2. El cuadro de mando (Hoy)](#2-el-cuadro-de-mando-hoy)
- [3. Gestionar hábitos](#3-gestionar-hábitos)
- [4. Completar tareas y proyectos](#4-completar-tareas-y-proyectos)
- [5. Aceptar retos](#5-aceptar-retos)
- [6. Ver tu progreso (Áreas y Logros)](#6-ver-tu-progreso-áreas-y-logros)
- [7. Finanzas](#7-finanzas)
- [8. Salud y estudio](#8-salud-y-estudio)
- [9. Diario y notas](#9-diario-y-notas)
- [10. Amigos](#10-amigos)
- [11. Tienda y cosméticos](#11-tienda-y-cosméticos)
- [12. Exportar tus datos](#12-exportar-tus-datos)

---

## 1. Entrada y configuración

### 1.1 Crear tu cuenta*

1. Abre Kibo en el navegador o descargar la app de Android.
2. Toca "Crear cuenta".
3. Ingresa email y contraseña.
4. **Crea tu personaje:** Elige tu nombre de juego, área de vida donde quieres enfocarte primero, y si quieres jugar solo o con amigos.
5. Tu **KIBO** (el gel animado) aparece como bienvenida.

*Pantalla, pasos, y validaciones PENDING.

### 1.2 Configuración*

Toca el engranaje (⚙️) en la esquina superior derecha.

| Opción | Qué hace |
|---|---|
| **Perfil** | Edita nombre, foto, bio |
| **Seguridad** | Cambia contraseña, sesiones activas, dispositivos conectados |
| **Privacidad** | Consentimiento por categoría (salud, finanzas, diario). Granular: salud → Kibo servers SÍ / bóveda Obsidian opción / LLM SÍ con DPA |
| **Notificaciones** | On/off, sonidos, vibración |
| **Juego** | Celebraciones, sonidos, modo reduced-motion, modo hardcore |
| **Cuenta Premium** | Plan, facturación, factura |
| **Exportar todo** | Descargar `.zip` con bóveda Obsidian funcional. Incluye todas tus notas, finanzas, diario |
| **Borrar cuenta** | Eliminación permanente. Cascada a procesadores |

---

## 2. El cuadro de mando (Hoy)

### 2.1 Qué ves cuando entras*

La pantalla principal muestra:
- Tu **racha global** (número en grande, con llamas 🔥).
- **KIBO** en el centro (gel animado). Su expresión cambia según tu HP.
- **Grilla de widgets** (personalizables).
- **Barra lateral** (en web, drawer en móvil) con acceso a todos los módulos.

*Capturas PENDING.

### 2.2 Personaliza tu cuadro*

1. Toca el ícono **+** en la grilla.
2. Galería de widgets: Hoy, Hábitos, Finanzas, Salud, etc.
3. Elige cuáles quieres ver.
4. **Arrastra para reordenar** (web: drag-drop; móvil: long-press → mover).
5. Algunos widgets son **gratis**, otros requieren **Elemento**.

*Paso a paso con pantallas PENDING.

### 2.3 KIBO, tu mascota*

KIBO está vivo. **Interactúa con él:**
- **Toca:** Juega una travesura (flip, squash, balloon, drip, wave).
- **Mantén presionado:** Radial menu (acciones rápidas).
- **Toca y arrastra:** Chipote (deformación gelatinosa interactiva).

**Su expresión cambia con tu salud (HP):**
- ✨ Feliz/relajado (90–100 HP)
- 😊 Contento (72–89 HP)
- 😐 Neutral (55–71 HP)
- 😟 Preocupado (38–54 HP)
- 😢 Triste (20–37 HP)
- 😱 Sorprendido/asustado (<20 HP)

**Guardarropa:** Skins (colores), accesorios, auras. Todos comprados con Elemento.

*Interacciones y animaciones PENDING.

---

## 3. Gestionar hábitos

### 3.1 Crear un hábito*

Desde el módulo **Hábitos** o desde el FAB (Kibo):
1. **Nombre:** "Meditar", "Correr", "Leer".
2. **Esfuerzo:** 1–5 (cuánto cuesta). Tooltip: "más esfuerzo = más recompensa".
3. **Prioridad:** Ícono de brújula. Bajo / Medio / Alto. Recompensa = prioridad × esfuerzo.
4. **Periodicidad:** Diario, cada 2 días, semanal, quincenal, mensual.
5. **Hora:** Hora del día (para recordatorio).
6. **Área:** A cuál de las cinco (Vigor, Sabiduría, Riqueza, Comunidad, Voluntad) suma XP.

**Toca "Crear". El hábito aparece en tu lista.**

*Pantalla de formulario PENDING.

### 3.2 Completar un hábito*

Abre **Hábitos**. Tu lista muestra:
```
[✓ Hoy] Meditar      ⭐⭐⭐  🔥🔥 (racha 2 días)
[—] Meditar        ⭐⭐⭐  (mañana no completado aún)
```

**Toca el hábito completado hoy → botón "Marcar como hecho".**

Lo que ocurre:
- Ganas: `esfuerzo × prioridad` Divisa + XP.
- Tu racha sube 1 día.
- Las llamas avanzan (🔥 → 🔥🔥 → 🔥🔥🔥).
- HP se recupera ligeramente si estaba bajo.
- **KIBO celebra** (animación, confeti respetando reduced-motion).

**Si faltas un día:**
- Tu racha baja a 1.
- Si faltas al día siguiente, se pierde.
- Puedes usar un **protector** (Elemento) para bloquear la caída una vez.

*Validaciones y flujo animado PENDING.

### 3.3 Ver tu historia*

Toca un hábito → **"Ver historial"**. Aparece un calendario con los días que lo completaste (verde) y los que faltaste (rojo).

---

## 4. Completar tareas y proyectos

### 4.1 Crear un proyecto*

Desde **Tareas y Proyectos**:
1. **Nombre:** "Rediseñar landing", "Aprender React".
2. **Complejidad:** 1–5 (escala de trabajo).
3. **Toca "Nuevo proyecto".**

**El proyecto abre en Kanban.**

*Pantalla PENDING.

### 4.2 Agregar tareas al proyecto*

El Kanban tiene columnas. Por defecto: **Por hacer | En progreso | Revisión | Hecho**.

1. **Toca una columna vacía** o **toca "+"** en "Por hacer".
2. Llena: **nombre**, **subtareas** (opcionales), **fecha de vencimiento**, **esfuerzo** (1–5), **prioridad**.
3. **Toca "Guardar".**

**La tarea aparece como card.**

*Subtareas y validaciones PENDING.

### 4.3 Completar tarea*

Arrastra la card de **"Por hacer"** a **"Hecho"**. (O toca la card → "Marcar como hecho".)

Lo que ocurre:
- Ganas XP.
- El proyecto avanza (barra de progreso actualiza).
- Tus tareas contribuyen a tu **eficiencia** (métrica en tu perfil).

*Animación PENDING.

### 4.4 Ver en timeline*

Toca el ícono **"Timeline"** en la barra. Ves todos tus proyectos en escala:
- **1 semana** → cada tarea es un punto.
- **1 mes** → barras de progreso.
- **3 meses** → hitos.
- Custom: elige el rango.

Scroll horizontal. Columna de proyectos fija a la izquierda.

*Timeline interactivo PENDING.

---

## 5. Aceptar retos

### 5.1 Crear un reto*

Desde **Retos**:
1. **Nombre:** "Correr 5K sin parar", "Escribir 10K palabras".
2. **Fecha límite:** Un mes desde hoy, 3 meses, custom.
3. **Dificultad:** 1–5. Daño por fallo:
   - 1 = −8 HP
   - 3 = −22 HP
   - 5 = −50 HP
4. **Solo o con amigos?** Si con amigos, invita.
5. **Toca "Crear".**

*Pantalla de creación PENDING.

### 5.2 Completar un reto*

Cada día del reto, toca **"Hoy lo cumplí"** o **"Hoy no cumplí"**.

**Mecánica:**
- Cumples todos los días: reto se cierra con **banner de victoria** (va a Logros).
- Faltas 1 día en un reto de 10: racha interna baja a 1, pero sigues.
- Faltas 2 días: el reto se cierra (20 % de fallos tolerados).

**Compartido:** Si invitaste a amigos, ves su scoreboard (quién cumplió hoy, quién falló, quién lidera).

*Scoreboard en tiempo real PENDING.

---

## 6. Ver tu progreso (Áreas y Logros)

### 6.1 Áreas: Las cinco dimensiones de tu vida*

**Vigor** | **Sabiduría** | **Riqueza** | **Comunidad** | **Voluntad**

Toca cualquiera. Ves:
- Tu **rango militar actual** (20 tiers × 9 materiales).
- **XP acumulado** (barra).
- **Prestigio** (1–16; *Leyenda = Gargantúa* en max).
- **Post-max paragon** (expansión infinita).
- **Qué suma a esta área:** Hábitos, tareas, retos, journal, notas, etc.

*Pantalla de detalle de área PENDING.

### 6.2 Logros: Tu showcase*

Toca **Logros**. Ves:
- **Trofeos mensuales** (enero: top 3; febrero: top 3; …).
- **Banners de retos** ("Completé 'Correr 5K' en julio").
- **Catálogo:** 100+ logros (públicos, secretos, escondidos; 5 rarities).
- Un logro **escondido** no aparece hasta cumplirlo.
- Un logro **secreto** aparece en el catálogo pero sin descripción.

**Toca un logro para ver su descripción.**

*Catálogo y animaciones PENDING.

### 6.3 Vitrina: Tu perfil público*

Toca tu avatar en la esquina. Tu **vitrina** muestra:
- Foto, nombre, título honorífico, lema.
- 3–9 logros destacados que elegiste (expandible a 9 con feature).
- Tu **KIBO companion** (la mascota, peeking desde una tarjeta).

**Otros usuarios ven tu vitrina igual.**

*Renderizado PENDING.

---

## 7. Finanzas

### 7.1 Registrar cuentas e inversiones*

Toca **Finanzas**.

**Cuentas:**
1. Nombre (ej. "Santander", "BBVA").
2. Tipo (cheques, ahorros, tarjeta crédito, deuda, inversión).
3. Saldo inicial.
4. Toca "Guardar".

*Pantalla de registro PENDING.

### 7.2 Tarjetas de crédito*

Toca "Agregar tarjeta". Llena:
- Número (últimos 4 dígitos solo, nunca full PAN).
- Límite.
- Tasa de interés (CAT).

La tarjeta muestra:
- **Utilización %** (usaste $2,000 de $5,000).
- **Interés YTD** (cuánto llevabas pagado este año).
- **CAT** (costo anual).

*Pantalla de detalle PENDING.

### 7.3 Presupuestos y metas*

Toca "Presupuesto" o "Metas".

**Presupuesto:** "Restaurantes: $500 este mes". Kibo rastrea. Al terminar mes, te muestra si sobre/sub-gastaste.

**Meta:** "Ahorrar $100K en 6 meses". Barra de progreso. XP si cumples.

*Validación y progreso PENDING.

### 7.4 Importar movimientos*

Toca "Importar". Sube un `.csv` de tu banco. Kibo categoriza automáticamente (débito de "Frutería" → Comida; "Netflix" → Suscripción).

Revisa, ajusta, toca "Guardar".

*Parser y categorización PENDING.

---

## 8. Salud y estudio

### 8.1 Registrar vitales*

**Salud → Registrar**:
- Presión, pulso, peso, temperatura.
- Fecha (hoy o atrás).
- Notas opcionales.
- Toca "Guardar".

Kibo acumula y muestra tendencias.

*Gráficos PENDING.

### 8.2 Cursos y rubrics*

**Estudio → Nuevo curso**:
1. Nombre ("Python avanzado").
2. Materias (cada materia tiene 1–5 rubrics, ej. "Conceptos", "Proyectos", "Examen").
3. Para cada rúbrica, toca "Progreso" (1–5).

Tu progreso se refleja en barra verde.

*Rubric detail PENDING.

### 8.3 Sesiones de lectura*

**Lectura → Nuevo libro**:
1. Título, autor.
2. Páginas totales.

Cada sesión: **"Hoy leí del capítulo X al Y". Toca "Guardar".**

Kibo suma XP a Sabiduría. Racha de lectura sube.

*Interfaz PENDING.

---

## 9. Diario y notas

### 9.1 Escribir en el diario*

**Diario → Entrada nueva**:
1. Ánimo (😊 😐 😢 😱 etc.).
2. Gratitud (3 cosas).
3. Aprendizaje (qué aprendiste).
4. Body (narrativa libre).
5. Fecha (hoy o atrás).
6. Toca "Guardar".

Kibo suma XP a Sabiduría (ó Voluntad, si reflexión).

*Interfaz emotiva PENDING.

### 9.2 Bóveda de notas (Resources)*

**Recursos → Nueva nota**:
1. Título.
2. Body (Markdown, `[[wikilinks]]`, `# tags`).
3. Carpeta.
4. Toca "Guardar".

Kibo suma XP a Sabiduría por escribir. **Notas huérfanas** (sin referencias) aparecen como **misiones**: "vincula esta nota a 2 otras".

*Wikilinks y backlinks PENDING.

---

## 10. Amigos

### 10.1 Añadir amigo*

**Amigos → Buscar**. Escribe nombre o email. Toca "Enviar solicitud".

**Ellos la ven en su inbox.** Aceptan, y se conectan.

*Notificaciones PENDING.

### 10.2 Compartir un reto*

**Retos → Nuevo → "Con amigos"**. Invita a 1 o más.

Ven la invitación. Aceptan. **Reto compartido comienza.**

Scoreboard en tiempo real:
- Quién cumplió hoy (✓).
- Quién falló (✗).
- Racha interna de cada uno.
- Quién lidera (más días).

*Scoreboard real-time PENDING.

### 10.3 Feed de actividad*

Toca el ícono de **campana** o **Activity**. Ves el feed de tus amigos (últimos 7 días, agrupado por fecha):
```
Hoy
  - Tu amiga completó "Correr" (⭐⭐⭐)
    [Aplaudir]
  - Tu amigo cerró su reto de estudio.
    [Aplaudir]
```

**Toca "Aplaudir"** para alentar.

*Feed interactivo PENDING.

---

## 11. Tienda y cosméticos

### 11.1 Abrir un cofre*

**Tienda → Cofres**.

Ves 4 opciones:
- **Bronce:** 250 Divisa. Divisa pequeño + 30 % Elemento.
- **Plata:** 800 Divisa. Divisa mediano + 50 % Elemento.
- **Oro:** 2,000 Divisa. Divisa grande + 100 % Elemento garantizado + extras.
- **Mítico:** 5,000 Divisa. Divisa enorme + 100 % Elemento + múltiples extras.

**Selecciona → "Abrir".**

**Ceremonia:** El cofre **cae del cielo**, **rebota**, **explota en lluvia de monedas y gemas.** Animación completa (o instantánea si tienes `prefers-reduced-motion`).

Recompensas se muestran, se suman a tu balance.

*Ceremonia animada PENDING.

### 11.2 Comprar cosméticos (KIBO)*

**Tienda → KIBO Cosmetics**:
- **Skins:** Azul, rojo, purpurina, invisible, etc. (50–200 Elemento cada una).
- **Accesorios:** Sombreros, gafas, alas (20–100 Elemento).
- **Auras:** Luz, fuego, nieve (50–150 Elemento).
- **Personalidades:** Travieso, serio, tímido (100 Elemento).

**Toca "Comprar".**

Descontado de tu Elemento. **KIBO se equipa al instante en tu sidebar.**

*Catálogo con preview PENDING.

### 11.3 Mis recompensas (autodefinidas)*

**Tienda → Mis recompensas**:
- Toca "Nueva".
- Nombre ("Una pizza", "Dormir hasta tarde").
- Costo en Divisa.
- Toca "Crear".

Cuando acumules esa Divisa, **"Canjear"**. Tú mismo te pagas a ti mismo. Ganas un logro.

*Interfaz de creación PENDING.

---

## 12. Exportar tus datos

### 12.1 Descargar tu bóveda*

**Cuenta → Exportar todo**.

1. Toca el botón.
2. Se prepara un `.zip` (unos segundos).
3. Se descarga: `kibo-export-YYYYMMDD.zip`.

**Dentro:**
- Carpeta `Kibo/` con todas tus notas.
- Frontmatter YAML en cada nota (fechas, categorías, links).
- Wikilinks resueltos (`[[Kibo/Diary/2026-09-05|5 de septiembre]]`).
- `.base` files (queries para Obsidian Bases).
- `README.md` (guía del formato).

4. Descomprimir en Obsidian. Abre `Kibo/Diary/` y navega.

**Todo funciona sin Kibo. Es tuyo.**

*Export mechanism PENDING.

### 12.2 Borrar tu cuenta*

**Cuenta → Borrar cuenta.**

1. Toca "Entiendo que es permanente".
2. Confirma tu email.
3. Cuenta, datos y sesiones **eliminados de inmediato**.
4. Reacción en cascada: Kibo servers, procesadores externos.

*Confirmación e irreversibilidad PENDING.

---

## Glosario

| Término | Qué es |
|---|---|
| **Áreas** | Los cinco ejes: Vigor, Sabiduría, Riqueza, Comunidad, Voluntad |
| **Cofre** | Recompensa aleatoria. Bronce (250 Divisa) a Mítico (5,000). Ceremonia: cae, rebota, explota |
| **Divisa** | Moneda cotidiana. Se gana con hábitos/tareas. Se gasta en recompensas propias |
| **Elemento** | Moneda rara. Se gana en cofres o dinero real. Se gasta en cosméticos/funcionalidades |
| **Esfuerzo** | 1–5. Cuánta energía cuesta una tarea. Recompensa = prioridad × esfuerzo |
| **HP** | Puntos de vida. Se pierden al fallar retos. Se recuperan por consistencia |
| **KIBO** | Tu mascota animada. Respira, parpadea, juega. Su expresión = tu estado |
| **Racha** | Contador de días consecutivos. Se pierde al faltar dos veces |
| **Rango** | Tu título en una Área. 20 tiers × 9 materiales. Prestige 1–16 |
| **Recurso** | Nota con wikilinks. Se gana XP escribiendo. Notas huérfanas = misiones |
| **Reto** | Compromiso a plazo fijo. Fallar cuesta HP. 20 % fallos tolerados |
| **XP** | Experiencia. Se gana con cada acción. Sube tu nivel global y por Área |

---

`*` Pendiente: interfaces completas, capturas de pantalla, flujos de usuario integrados, validaciones de formulario. El manual anterior es una secuencia de tareas; la verificación de **user journeys end-to-end** (ej. "nueva → personaje → primer hábito → primer cofre") requiere prototipo funcional.
