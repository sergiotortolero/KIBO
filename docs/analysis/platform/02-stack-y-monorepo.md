# 02 · Stack y monorepo de la plataforma Kibo — Android primero

**Fecha:** 2026-08-08 · **Autor:** `web-architect` · **Tipo:** análisis de plataforma (ronda 3)
**Insumos:** `constitution.md` v1.7 (Art. 3 acotado, Art. 12 nuevo) · `docs/analysis/obsidian/03-aterrizaje-monorepo.md` (R1) · `13-r2-conector-monorepo.md` (R2) · `15-r2-seguridad-conector.md` (KS/D, `[P]`-6 y `[P]`-9) · `17-sintesis-r2.md` · `docs/product/PRD-kibo.md` · el repo, leído directamente
**Alcance:** qué stack sostiene un SO Personal con cliente Android de primera clase. **No repito R1 ni R2**; los referencio.

**Convención de evidencia** (la misma de los documentos hermanos): `[V]` verificado con fuente y fecha · `[S]` supuesto de ingeniería, con razonamiento · `[P]` pendiente de verificar antes de decidir.

**Cierro dos pendientes que me asignó `security-auditor`:** `[P]`-6 (§4.5) y `[P]`-9 (§5). Ambos quedan **resueltos y verificados contra fuente primaria**, y ambos cambian recomendaciones suyas.

---

## 0 · Qué cambia con el nuevo encuadre

Cuatro decisiones de Sergio, y su consecuencia arquitectónica directa:

| Decisión | Consecuencia arquitectónica |
|---|---|
| Kibo es un SO Personal; salud y finanzas son núcleo | El esquema necesita **clasificación de sensibilidad declarada**, cifrado a nivel de columna y frontera de credenciales (§6.4–§6.6). No es una capa que se añade después |
| Constitución v1.7: Art. 12 | La **matriz de residencia por categoría es un ADR previo al código** (Art. 12, primer inciso). Y consentimiento granular, export y borrado dejan de ser "features de backlog": son requisitos de esquema |
| **Android primero**, web, y quizá Windows | **`apps/api` deja de ser opcional y pasa a ser obligatorio** (§1.2). Es el cambio estructural más grande de todo el análisis |
| La bóveda es una **salida** del sistema, no un socio | La proyección deja de ser "la integración" y pasa a ser **un exportador más**. Y —hallazgo de §4— es un exportador que **solo puede correr en escritorio** |

Y el hecho central de R1 §6 sigue siendo el hecho central, ahora a favor: el repo tiene **6 modelos de identidad, sin migraciones y sin CI**. No hay inversión que proteger. Es el único momento en la vida del proyecto en que replantear la base cuesta cero.

---

## 1 · Qué sobrevive del monorepo actual

### 1.1 Veredicto por pieza

| Pieza | Estado verificado (R1 §0) | Veredicto | Por qué |
|---|---|---|---|
| `packages/database` (Prisma + Postgres) | 6 modelos, sin `migrations/` | **Se queda.** Es ~5% de lo que necesita | Postgres es correcto para un SO Personal: relacional, transaccional, con cifrado y auditoría maduros. Prisma es adecuado **en el servidor** |
| `apps/api` (NestJS 11) | Huérfano, sin auth, controlador roto | **Se queda y sube a pieza central** | §1.2 |
| `apps/web` (Next 16) | Habla Prisma directo | **Se queda, cambia de rol y baja de prioridad** | §1.3 |
| `packages/ui` | `main: ./index.tsx` — **el archivo no existe** | **Se borra** | §1.4 |
| `packages/config` | Un `package.json` de 79 bytes | **Se queda, se llena** | Ahora sirve a 4 consumidores (api, web, mobile, packages) en vez de 2 |
| `turbo.json` | Sin `db:generate`, sin `test`, sin `typecheck` | **Se reescribe** | R1 §3.5, más las tareas de móvil (§2.4) |
| `docker-compose.yml` | Solo Postgres | **Se amplía** con `api` y `worker`. **Sin Redis** (R1 §4.1: pg-boss) | Un solo almacén de datos |
| Basura de la raíz (`Clean`, `Launching`, `Old`, `Spawning`, `Waiting`) | Salidas de `echo` de `start-kibo.bat` | **Se borra** | Higiene |

### 1.2 El cambio estructural: Android convierte a `apps/api` en obligatorio

En R1 §2.1 recomendé una frontera pragmática: `apps/web` lee con Server Components y `apps/api` es "la superficie para máquinas". **Con Android de primera clase esa frontera es incorrecta y hay que decirlo.**

Un cliente Android no puede importar `@kibo/database` ni abrir una conexión a Postgres. Necesita HTTP. Si `apps/web` sigue hablando Prisma directo mientras Android habla con `apps/api`, cada regla de dominio —la fórmula de XP, la evaluación de racha, el límite de protectores, la validación de un movimiento financiero— **se implementa dos veces y diverge**. No es una hipótesis: es la consecuencia mecánica de tener dos rutas de acceso a datos sobre el mismo dominio.

**Decisión: `apps/api` es el backend único. `apps/web` y `apps/mobile` son ambos clientes suyos.**

Next.js sigue haciendo render en servidor llamando a la API desde el servidor (patrón BFF), que es normal y rápido. Lo que **no** hace es tocar Prisma. Excepción única y acotada: Auth.js necesita el `PrismaAdapter` para las tablas de sesión de la web (`apps/web/src/auth.ts`); eso se queda, porque es infraestructura de sesión del navegador, no dominio.

Trabajo nuevo que esto implica y que es fácil subestimar porque "`apps/api` ya existe":

1. **Autenticación de móvil, que no existe.** Auth.js está orientado a cookies de navegador. Android necesita OAuth 2.0 + **PKCE** (extensión que evita la interceptación del código de autorización en clientes públicos, donde no se puede guardar un secreto), tokens de acceso cortos, *refresh tokens* rotatorios y almacenamiento en el llavero del sistema (`expo-secure-store`, respaldado por Android Keystore). Es un esquema distinto del de la web y del de dispositivo de R2 §2.4 — **tres esquemas de credencial** conviviendo: sesión de navegador, token de app móvil, token de conector de bóveda. Hay que diseñarlos juntos, no uno por uno.
2. **`main.ts` completo**: prefijo global, versionado por URI, `ValidationPipe`, CORS con allowlist (hoy `app.enableCors()` sin argumentos), límite de cuerpo, filtro de errores RFC 9457 (R1 §2.1–§2.2).
3. **Economía autoritativa en el servidor** (§3.3). No es "un endpoint más": es la condición para que el cliente pueda estar offline sin corromper la economía.
4. **Borrar `apps/api/src/users/users.controller.ts`**, cuyo `findOne(+id)` convierte un UUID a `NaN` (R1 §0.2).

### 1.3 `apps/web` cambia de rol

La maqueta es de escritorio a 1280 px. Con Android primero, la web deja de ser el producto y pasa a ser **la superficie de escritorio y de cumplimiento**. Alcance recomendado para v1:

- Marketing y alta.
- **Centro de privacidad**: consentimientos granulares, acuses descargables, exportación completa y borrado (Art. 12 los exige como funciones, no como favores). Se hacen mucho mejor en pantalla grande y con teclado.
- Facturación / plan.
- Los tableros amplios (cronograma, kanban, finanzas) donde el móvil es genuinamente peor.

Lo que **no** debe hacer la web en v1: duplicar el bucle diario. Si el hábito se marca en el teléfono, la web no necesita su propia pantalla de hábitos hasta la fase 4 (§7).

### 1.4 `packages/ui`: borrar, no arreglar

Está roto (declara un `index.tsx` inexistente) y, con React Native en la ecuación, **un paquete de componentes compartidos entre web y móvil es una falsa promesa** (§2.3). Lo que sí se comparte es un paquete de **tokens** —valores de color, espaciado, radios, escala tipográfica— sin una sola línea de estilo. Eso vive en `packages/tokens` y no se parece en nada a `packages/ui`. Borrar es más honesto que reciclar el nombre.

### 1.5 Lo que se añade

```
apps/
  api/               ← existente; pasa a backend único
  web/               ← existente; cambia de rol
  mobile/            ← NUEVO. Expo / React Native (§2)
  obsidian-plugin/   ← R2 §4; sigue en el monorepo por ahora
packages/
  database/          ← existente; solo servidor
  config/            ← existente; se llena (tsconfig + eslint base)
  api-contract/      ← NUEVO. Esquemas Zod + cliente generado. Lo consumen web, mobile y api
  core/              ← NUEVO. Dominio puro: curva de XP, racha, recompensas, fechas. Sin UI, sin IO
  tokens/            ← NUEVO. Valores de diseño. Sin implementación de estilo
  markdown/          ← R2 §3.3. SOLO servidor
  sync-core/         ← R1 §3.2. Lo comparten servidor y plugin. NO el móvil
  projection/        ← R2 §1.5-§1.6. Motor de proyección. SOLO servidor
```

Regla que hay que escribir en el `CLAUDE.md` del repo y hacer cumplir con lint de dependencias: **`packages/database`, `markdown` y `projection` no pueden ser importados por `apps/mobile` ni por `apps/web`.** Es la frontera que impide que el dominio se filtre al cliente.

---

## 2 · El cliente Android en el monorepo

### 2.1 Expo/React Native frente a Kotlin nativo

**Recomendación: Expo (React Native).** Y el argumento decisivo no es técnico, es de estructura del equipo: **el equipo es una persona que está aprendiendo a programar y ya piensa en React/TypeScript.**

| Criterio | Expo / RN | Kotlin + Compose |
|---|---|---|
| Lenguajes y paradigmas a dominar | 1 (TS/React) | 2 (TS para web + Kotlin/Compose) |
| Pantallas escritas dos veces | No (mismo lenguaje, distinta capa de vista) | Sí, íntegramente |
| Compilación y firma | EAS Build (gestionado en la nube) | Toolchain propio, mantenido por Sergio |
| Actualización fuera de tienda | EAS Update (JS OTA) | No |
| Rendimiento de listas y animación | Bueno; excelente con Reanimated/Skia | Superior |
| Acceso a SAF (requisito duro, §4) | **Disponible** `[V]` (§4.3) | Nativo |
| Riesgo real | El acabado de KIBO y la ceremonia de cofres | Que el proyecto no salga |

Kibo es una app de **captura, formularios, listas y tableros** con una capa de animación de marca. Ése es el terreno donde React Native rinde bien. No es una app de cámara, audio en tiempo real ni AR, que es donde nativo se vuelve obligatorio.

**Lo que honestamente se paga con Expo**, sin adornar: la mascota KIBO (respira, parpadea, hace travesuras, morfa en losa) y la ceremonia de apertura de cofres a pantalla completa son la pieza de riesgo. Se hacen con `react-native-reanimated` (animación en el hilo de UI) y `@shopify/react-native-skia` (dibujo 2D acelerado, que es lo que permite un blob deformable de verdad). Es viable y hay precedentes, pero **es la parte que hay que prototipar antes de comprometer el diseño**, no después. Un *spike* de dos días con el blob respirando y una travesura decide si la estética de marca sobrevive al cambio de plataforma.

Si aun así se eligiera Kotlin: la forma de no duplicar el contrato es **generar el cliente Kotlin desde el OpenAPI que emite `apps/api`** (los esquemas Zod de `packages/api-contract` producen OpenAPI, y `openapi-generator` produce un cliente Kotlin con modelos y validación). Se comparte el contrato, no el código. Pero se pierde `packages/core`: la fórmula de XP y la evaluación de racha habría que reimplementarlas en Kotlin y mantenerlas sincronizadas a mano — que es exactamente el tipo de divergencia silenciosa que me preocupa en un producto con economía.

### 2.2 pnpm + Turbo + Metro: el problema concreto y su solución

Metro es el empaquetador de React Native. El conflicto clásico es que **pnpm construye `node_modules` como un bosque de enlaces simbólicos** y Metro históricamente no los seguía. `[S]` El soporte de enlaces simbólicos en Metro ha mejorado sustancialmente y Expo documenta la configuración de monorepo; `[P]` **verificar contra la versión concreta del SDK de Expo antes de fijar la configuración** — es el tipo de cosa que cambia entre versiones menores.

Configuración recomendada, de la más fiable a la más elegante:

1. **`.npmrc` con `node-linker=hoisted`** en la raíz del workspace. Hace que pnpm genere un `node_modules` plano estilo npm. Es la opción que menos sorpresas da con Metro. **Coste real:** se pierde la garantía de pnpm de que un paquete no puede importar lo que no declaró. Es un coste que yo pagaría: la alternativa es depurar resoluciones de módulos en un empaquetador móvil, que es de las peores tardes de ingeniería que existen.
2. **`metro.config.js` explícito** en `apps/mobile`:
   ```js
   // apps/mobile/metro.config.js
   const { getDefaultConfig } = require('expo/metro-config');
   const path = require('path');

   const projectRoot = __dirname;
   const workspaceRoot = path.resolve(projectRoot, '../..');
   const config = getDefaultConfig(projectRoot);

   // Watch the whole workspace so edits in packages/* trigger a rebuild.
   config.watchFolders = [workspaceRoot];
   // Resolve from the app first, then from the workspace root.
   config.resolver.nodeModulesPaths = [
     path.resolve(projectRoot, 'node_modules'),
     path.resolve(workspaceRoot, 'node_modules'),
   ];
   // Do not walk up the tree beyond the paths above.
   config.resolver.disableHierarchicalLookup = true;
   module.exports = config;
   ```
3. **Los paquetes compartidos se consumen como fuente TypeScript**, con `main` apuntando al `.ts` y añadidos a la lista de transformación de Metro. Publicar JS compilado también funciona, pero rompe el ciclo de edición-recarga que es lo único que hace tolerable el desarrollo móvil.

**Turbo.** `apps/mobile` obtiene `lint`, `typecheck` y `test`. **`build` NO**: la compilación real la hace EAS en la nube y su salida es un `.aab` firmado que Turbo no puede cachear ni reproducir. Hay que decirlo explícitamente en `turbo.json` para que nadie espere caché ahí:

```jsonc
{
  "tasks": {
    "db:generate": { "cache": false },
    "build":     { "dependsOn": ["^build", "^db:generate"], "outputs": [".next/**", "!.next/cache/**", "dist/**"] },
    "typecheck": { "dependsOn": ["^build"] },
    "test":      { "dependsOn": ["^build"], "outputs": ["coverage/**"] },
    "lint":      { "dependsOn": ["^lint"] },
    "dev":       { "cache": false, "persistent": true },
    // Mobile release builds run on EAS; their output is not reproducible locally.
    "mobile:build": { "cache": false, "persistent": false }
  }
}
```

### 2.3 Qué se comparte de verdad entre web y móvil

| Qué | ¿Compartir? | Razón |
|---|---|---|
| **Contratos y tipos** (`packages/api-contract`) | ✅ **Sí, es el mayor valor** | Un esquema Zod, tres consumidores. Un campo renombrado rompe la compilación en los tres a la vez, que es exactamente lo que quieres |
| **Dominio puro** (`packages/core`): curva de XP, evaluación de racha, recompensa = prioridad × esfuerzo, aritmética de fechas con zona horaria | ✅ **Sí** | El móvil debe poder mostrar "esta tarea da 40 XP" **sin red**, y el servidor debe calcular ese mismo 40 como autoridad. Dos implementaciones = el usuario ve un número y cobra otro. Es el mismo argumento que `canonicalize()` en R1 §3.2 |
| **Cliente HTTP generado** | ✅ Sí | `fetch` existe en ambos entornos |
| **Claves de consulta y hooks de datos** (TanStack Query) | ⚠️ Parcial | Las claves y los hooks sí; la configuración del cliente y el adaptador de persistencia no |
| **Tokens de diseño** (`packages/tokens`) | ✅ Sí, solo valores | `#14B8A6` es el mismo color en CSS y en `StyleSheet`. La *implementación* no se comparte |
| **Componentes de UI** | ❌ **No** | React DOM y React Native no comparten primitivas: `div`/`View`, CSS/`StyleSheet`, eventos distintos. React Native Web existe, pero obliga a escribir **la web entera** en idioma RN, lo que tira a la basura la inversión en shadcn/Tailwind de `apps/web` y las ~40 pantallas de la maqueta |
| **Prisma / `packages/database`** | ❌ Nunca | No corre en el dispositivo y expondría el esquema completo |
| **`packages/markdown`, `projection`, `sync-core`** | ❌ No al móvil | El móvil no escribe la bóveda (§4). Enviarlos infla el paquete y amplía superficie |

**Y lo que *se podría* compartir pero no conviene:**

- **La capa de sesión y autenticación.** La web usa cookie de sesión; el móvil usa token en el llavero con refresco rotatorio. Construir una abstracción que cubra ambas produce una API que no encaja bien en ninguna de las dos y esconde precisamente los detalles de seguridad que hay que poder auditar de un vistazo. Dos implementaciones pequeñas y explícitas son mejores que una compartida y astuta.
- **La navegación.** Next App Router y Expo Router se parecen lo suficiente para tentar, y difieren lo suficiente (pila de navegación, gestos de retroceso, enlaces profundos, estado de pestañas) para que la abstracción se rompa en el primer caso real.
- **Los formularios completos.** Compartir el **esquema de validación** sí (viene de `api-contract`); compartir los componentes de formulario no, por la razón de la tabla.

### 2.4 Estructura resultante

```
apps/mobile/
  app/                      # Expo Router: rutas por archivo
    (auth)/…
    (tabs)/index.tsx        # Hoy
    (tabs)/habits.tsx
    (tabs)/tasks.tsx
  src/
    api/                    # cliente generado desde packages/api-contract
    db/                     # expo-sqlite + Drizzle: caché local y outbox (§3)
    features/
    ui/                     # componentes NATIVOS, no compartidos
  app.json · eas.json · metro.config.js
```

---

## 3 · Base de datos local en el móvil

### 3.1 Primero, acotar qué significa "offline real" en Kibo

Antes de comparar herramientas hay que notar dos propiedades del dominio que eliminan la mayor parte del problema:

1. **Kibo es de un solo usuario y, en la práctica, de un solo escritor.** No hay edición concurrente de dos personas sobre el mismo registro. Desaparece la razón principal por la que existen los motores de sincronización con CRDT.
2. **La economía debe ser autoritativa en el servidor.** Si el dispositivo puede escribir XP, monedas, HP o racha localmente y sincronizar después, se abren tres agujeros: doble otorgamiento en reintentos, manipulación del reloj del teléfono para salvar una racha, y un libro mayor inauditable. R2 §1.6 ya estableció `XpGrant.idempotencyKey` por esto.

De ahí sale la forma correcta del cliente: **el móvil no replica la base; el móvil cachea lecturas y encola intenciones.**

- **Lectura offline:** "mis hábitos de hoy", "mis tareas de la semana", "mi racha". Caché local, se sirve al instante, se refresca con red.
- **Escritura offline:** "marqué el hábito X a las 07:12". Eso es una **intención**, no una mutación de estado. El servidor la recibe, valida, calcula la recompensa y devuelve el estado nuevo.

Esto es el patrón **outbox** (bandeja de salida): una tabla local de comandos pendientes con clave de idempotencia, que se drena cuando hay red. Y encaja de forma exacta con la API por lotes idempotente que ya diseñé en R1 §2.6 — **el mismo mecanismo sirve para el plugin de la bóveda y para el móvil.** No hay que inventar nada nuevo.

### 3.2 Comparativa

| Opción | Modelo | Complejidad para un dev solo | Madurez | Encaje con Postgres+Prisma | Veredicto |
|---|---|---|---|---|---|
| **`expo-sqlite` + Drizzle + outbox propio** | Caché + cola de comandos | **Baja-media**, y estable en el tiempo si el alcance no crece | Alta (SQLite) | Total: tú defines los endpoints | ✅ **Recomendado** |
| **PowerSync** | `[V]` Servicio que replica la base del backend a SQLite en la app; la app lee y escribe local y el SDK sube los cambios | Media: un servicio más que operar y las reglas de partición por usuario | Alta, producto comercial con SDK oficiales | **Alto** — Postgres es fuente soportada `[V]` | 🟢 **La escalada correcta**, no el punto de partida |
| **Electric** | `[V]` **Solo sincronización de lectura.** Su documentación lo dice literal: *"Electric does not do write-path sync"* | Media | Alta para lo que hace | Alto en lectura | 🟡 Media solución: habría que construir igual la escritura |
| **WatermelonDB** | SQLite con protocolo de sync que **tú implementas en el servidor** | Media-alta: el protocolo es tuyo | Madura pero de ritmo lento | Requiere endpoints `pull`/`push` a medida | 🟡 Da la parte fácil y deja la difícil |
| **Realm / Atlas Device Sync** | Orientado a MongoDB | — | `[P]` Atlas Device Sync fue anunciado para retiro; **verificar antes de considerarlo siquiera** | Bajo: no es Postgres | ❌ |
| **Solo TanStack Query con persistencia, sin BD local** | Caché serializada | **Mínima** | Alta | Total | 🟢 Suficiente para el primer mes; se queda corto para consultas locales |

### 3.3 Recomendación

**`expo-sqlite` + Drizzle ORM como caché de lectura, más una tabla `outbox` de intenciones, escrita a mano.**

Estimación honesta: **400–600 líneas**, de las cuales la mitad son la máquina de reintentos. Y no contradice lo que dije en R1 y R2 sobre no escribir sincronización a mano: aquello era **sincronización bidireccional de documentos con reconciliación a tres bandas**, que es un problema abierto. Esto es una **cola de comandos con clave de idempotencia contra un servidor autoritativo**, que es un patrón cerrado y con una prueba de corrección trivial: si el servidor es idempotente, reenviar es seguro; si reenviar es seguro, la cola solo necesita no perder elementos.

Forma de la tabla local:

```sql
-- apps/mobile/src/db/schema.ts (Drizzle), shown as SQL for clarity
CREATE TABLE outbox (
  id              TEXT PRIMARY KEY,          -- uuid v4, generated on device
  idempotency_key TEXT NOT NULL UNIQUE,      -- travels to the server; makes retries free
  kind            TEXT NOT NULL,             -- 'habit.complete' | 'task.complete' | 'journal.create' ...
  payload         TEXT NOT NULL,             -- JSON, validated against packages/api-contract
  occurred_at     TEXT NOT NULL,             -- device clock: INTENT time, never authoritative
  enqueued_at     TEXT NOT NULL,
  attempts        INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TEXT,                      -- exponential backoff
  last_error      TEXT,
  state           TEXT NOT NULL DEFAULT 'PENDING'  -- PENDING | SENT | FAILED_PERMANENT
);
CREATE INDEX outbox_drain_idx ON outbox (state, next_attempt_at);
```

Detalle que evita un abuso obvio: `occurred_at` viaja como **declaración del dispositivo**, y el servidor la acepta solo dentro de una ventana razonable respecto a su propio reloj y respecto al momento de recepción. Adelantar el reloj del teléfono no debe poder salvar una racha vencida. Es una regla de tres líneas que hay que escribir el primer día, porque retrofitearla obliga a auditar el histórico.

**Disparadores explícitos para migrar a PowerSync** (para no quedarse pegado a la decisión barata más tiempo del debido):
1. Cuando el usuario necesite **editar** registros existentes estando offline, no solo capturar eventos.
2. Cuando el conjunto que hay que tener disponible sin red deje de caber en una caché simple (p. ej. Recursos con miles de notas).
3. Cuando el outbox propio pase de ~1,500 líneas.

### 3.4 Qué NO se cachea en el dispositivo

Decisión de residencia que va al ADR del Art. 12: **los datos C4 (salud, finanzas) no se cachean localmente en la v1.** Sus pantallas requieren red.

Motivos: (1) elimina de un golpe la necesidad de cifrar la base local y de gestionar llaves en el dispositivo; (2) elimina el riesgo de un respaldo automático de Android arrastrando la base a la nube de Google; (3) el patrón de uso de esas pantallas es de consulta ocasional, no de captura en el metro. El coste es real pero pequeño y el beneficio de simplificación es grande.

Cuando llegue el momento de levantarla: SQLite cifrado (SQLCipher a través del soporte de cifrado de `expo-sqlite`) con la llave en Android Keystore vía `expo-secure-store`, y `android:allowBackup="false"` para el directorio de datos.

---

## 4 · Escritura de la bóveda desde Android — la pregunta dura

### 4.1 Qué permite Android, verificado

`[V]` **Storage Access Framework, `ACTION_OPEN_DOCUMENT_TREE`** (disponible desde Android 5.0, API 21): el usuario elige un directorio y la app obtiene acceso a *"any file in the selected directory and any of its sub-directories"*. La app **no** obtiene acceso a nada fuera de esa selección. (Fuente: developer.android.com, *Access documents and other files from shared storage*, consultado 2026-08-08.)

`[V]` **Restricciones desde Android 11 (API 30):** no se puede pedir con `ACTION_OPEN_DOCUMENT_TREE` el directorio raíz del volumen de almacenamiento interno, el directorio raíz de tarjetas SD que el fabricante considere fiables, ni **el directorio `Download`**. Tampoco se pueden seleccionar archivos individuales de `Android/data/` ni `Android/obb/`. (Misma fuente.)

`[V]` **La concesión se puede persistir** entre reinicios con `takePersistableUriPermission()`. **Pero la propia documentación advierte:** *"Even after calling takePersistableUriPermission(), your app doesn't retain access to the URI if the associated document is moved or deleted. In those cases, you need to ask permission again to regain access to the URI."* (Misma fuente.)

`[V]` **Advertencia de rendimiento:** *"If you iterate through a large number of files within the directory that's accessed using ACTION_OPEN_DOCUMENT_TREE, your app's performance might be reduced."* (Misma fuente.)

`[V]` **La vía de escape, `MANAGE_EXTERNAL_STORAGE` ("All files access"), está cerrada para Kibo.** La política de Google Play la restringe a apps cuya **funcionalidad principal** la requiera; los usos permitidos que enumera son *"file managers, backup and restore apps, anti-virus apps, and document management apps"*; exige un Formulario de Declaración de Permisos y aprobación; y *"Apps that fail to meet policy requirements or do not submit a Permissions Declaration Form may be removed from Google Play."* (Fuente: Play Console Help, *Use of All files access (MANAGE_EXTERNAL_STORAGE) permission*, consultado 2026-08-08.) Kibo es un SO Personal, no un gestor de archivos. **Pedirlo es exponerse a un rechazo o a una retirada de la tienda.** Queda descartado: SAF o nada.

### 4.2 Cómo se comportan los clientes de nube en Android — el hallazgo que decide

Aquí está el problema real, y no es de permisos.

`[V]` La **documentación oficial de Obsidian** sobre sincronización dice, textualmente:
- **OneDrive** — *"Recommended systems: Windows, macOS (limited functionality on Android)"*, y en un aviso destacado: *"OneDrive may not function well for Android syncing. Consider using apps like Dropsync or FolderSync."*
- **Google Drive** — *"Although it's not officially supported for syncing Obsidian vaults, you can use third-party apps and plugins to sync across devices."*
(Fuente: help.obsidian.md, *Sync your notes across devices*, consultado 2026-08-08.)

`[S]` La razón estructural detrás de eso: en Android, las apps oficiales de Google Drive y OneDrive se exponen al sistema como **`DocumentsProvider` respaldados por almacenamiento en la nube**, no como espejos de una carpeta local. No existe en ellas una función de "esta carpeta local se sincroniza en dos direcciones de forma continua", que es lo que sí hacen sus clientes de escritorio (Drive for desktop, OneDrive en Windows). Por eso la comunidad de Obsidian recurre a utilidades de terceros (FolderSync, Dropsync, Syncthing): **están supliendo una capacidad que el sistema operativo y los clientes oficiales no ofrecen.**

**Y esto choca de frente con el escenario declarado de Sergio**: su bóveda es una carpeta física en su Windows, sincronizada a la nube. Ese montaje funciona en Windows. En su teléfono Android, esa carpeta **no existe como carpeta local sincronizada** salvo que instale y configure una herramienta adicional de terceros. Lo que verá en la app de Drive es una vista de la nube, no un directorio que Kibo pueda escribir como archivos y que vuelva a su PC.

### 4.3 ¿Y Expo lo soporta?

`[V]` Sí. `expo-file-system` admite URIs `content://` de SAF, con limitaciones documentadas (los `content://` no admiten modo lectura-escritura; el modo de apéndice es estrictamente *append-only*), y el módulo heredado expone `StorageAccessFramework` con `requestDirectoryPermissionsAsync()`, `readDirectoryAsync()`, `createFileAsync()` y `moveAsync()`. (Fuente: docs.expo.dev, *FileSystem* y *FileSystem (legacy)*, consultado 2026-08-08.)

Es decir: **el framework no es el obstáculo, y la elección de Expo no cierra ninguna puerta.** El obstáculo es de comportamiento del ecosistema, no de API.

### 4.4 Cuatro límites duros que quedan incluso cuando funciona

1. **No hay ruta absoluta.** Un `content://` es un identificador opaco emitido por un proveedor de documentos. No se puede mostrar al usuario, ni compararlo con patrones de ruta, ni inspeccionarlo.
2. **La concesión es frágil justo ante lo que hacen los sincronizadores.** `[V]` Si el documento se mueve o se borra, el permiso persistente se pierde. Un cliente de nube que reorganiza, renombra o recrea la carpeta **rompe la vinculación en silencio**, y el usuario solo se entera cuando nota que hace semanas que no llega nada.
3. **El recorrido es lento.** `[V]` Enumerar una bóveda de miles de archivos vía SAF degrada el rendimiento, y el primer escaneo es exactamente eso.
4. **No hay semántica de renombrado atómico** equivalente a POSIX. La escritura atómica (temporal + rename) que R2 §3.3 identificó como requisito no tiene un equivalente limpio y multiproveedor.

### 4.5 `[P]`-6 — respuesta formal

> **`[P]`-6 (asignado por `security-auditor`): ¿hay ruta absoluta de la bóveda accesible desde el plugin en escritorio? ¿Y en móvil?**
>
> **Escritorio: SÍ.** `[V]` La API pública de Obsidian expone `FileSystemAdapter.getBasePath(): string`, que devuelve la ruta absoluta de la bóveda. `FileSystemAdapter` es el adaptador de escritorio (`implements DataAdapter`); el idioma estándar es comprobar `app.vault.adapter instanceof FileSystemAdapter` antes de usarlo. Además `Platform` expone `isDesktopApp`, `isMobileApp`, `isAndroidApp`, `isIosApp`. (Fuente: `obsidianmd/obsidian-api`, `obsidian.d.ts`, rama `master`, consultado 2026-08-08.)
> → **KS-27 (detección de superficie de sincronización) es implementable en escritorio**: se puede buscar `.git` en la raíz y comparar la ruta contra patrones de Dropbox/OneDrive/iCloud/Google Drive, con la fiabilidad limitada que el propio auditor declaró.
>
> **Móvil: NO.** `[V]` No existe equivalente: en móvil el adaptador no es un `FileSystemAdapter` y no hay ninguna API pública que devuelva una ruta absoluta. Y en la app propia de Kibo para Android, SAF entrega un `content://` opaco (§4.4.1).
> → **KS-27 es estructuralmente imposible en móvil.** No es que sea poco fiable: es que no hay nada que inspeccionar.
>
> **Confirmo por tanto la recomendación de `security-auditor` — proyección C4 deshabilitada en móvil en v1 — y añado que la razón es más fuerte de lo que él supuso:** no es solo que no se pueda inspeccionar el destino; es que **en Android la escritura mayormente no llega al destino**, porque las nubes mayoristas no espejan carpetas locales (§4.2). Un consentimiento informado sobre un destino que ni se puede identificar ni se puede alcanzar de forma fiable no es informado.

### 4.6 Veredicto y consecuencia arquitectónica

> **La bóveda tiene exactamente un escritor por bóveda, y ese escritor corre en escritorio.**

- **Escritorio:** el conector de Obsidian (R2 §3) escribe. Tiene ruta absoluta, eventos de archivo fiables, renombrado atómico y detección de destino.
- **Android:** es un **cliente de Kibo**, no un escritor de la bóveda. Captura, consulta y encola intenciones (§3). Lo que el usuario registra en el teléfono llega a la bóveda **por la vía del servidor y del conector de escritorio**, la próxima vez que abra Obsidian en su PC. Eso es correcto, es explicable en una frase y es lo que ya espera cualquiera que use un vault sincronizado.
- **Import/export puntual en móvil:** eso sí es viable con SAF y con el selector de documentos, y no requiere concesión persistente. "Exporta esta nota a donde quieras" funciona bien; "mantén esta carpeta espejada" no.

**Y esto responde de paso a la pregunta abierta de la app instalable en Windows** (*"quizá, si aporta valor y es prudente"*). Su razón de existir sería precisamente ésta: **ser el escritor de la bóveda para quien no usa Obsidian.** Si el usuario tiene Obsidian, el plugin ya cubre el caso y la app de Windows no aporta. Mi recomendación: **no construir app de Windows en v1**; reevaluar solo si aparece un segmento real de usuarios que quieren la carpeta Markdown **sin** usar Obsidian.

### 4.7 La alternativa server-side, y por qué la rechazo

Existe una vía que evita SAF por completo: que **el servidor de Kibo escriba en el Google Drive / OneDrive del usuario mediante la API de esos servicios**, con OAuth. Funcionaría en todas las plataformas por igual.

**La rechazo, y el motivo es legal antes que técnico.** Todo el veredicto de la ronda 2 sobre salud (`15-r2` §1.4–§1.5) descansa en una distinción: escribir en el disco del propio usuario es una **divulgación al titular**, no una transferencia a un tercero. Si el servidor de Kibo toma un token OAuth del Drive del usuario y sube ahí el expediente, ese acto **vuelve a ser una transferencia a un encargado tercero** (Google/Microsoft), realizada por Kibo, desde infraestructura de Kibo. Se pierde exactamente la propiedad que permitió levantar la prohibición.

Añádase que Kibo pasaría a custodiar una credencial de acceso al Drive completo del usuario —un secreto C1 de altísimo valor— y que la superficie de una brecha se multiplica.

> **Escalado a `security-auditor`:** si en algún momento producto plantea la escritura server-side a nubes de terceros como forma de resolver el móvil, **es una decisión que reabre KS-06b y hay que analizarla como transferencia, no como entrega al titular.** No es un detalle de implementación.

---

## 5 · `[P]`-9 — alcance del *metadata cache* de Obsidian

> **Pregunta:** ¿el frontmatter de una nota queda legible por cualquier plugin comunitario sin tocar disco?
>
> **Respuesta: SÍ, verificado, y el alcance es mayor que el supuesto.**

Todo lo siguiente sale de la definición de tipos pública `obsidian.d.ts` (repositorio oficial `obsidianmd/obsidian-api`, rama `master`, consultado 2026-08-08):

```ts
// MetadataCache
getFileCache(file: TFile): CachedMetadata | null;      // @since 0.9.21
getCache(path: string): CachedMetadata | null;         // @since 0.14.5  ← acepta una ruta en texto

resolvedLinks:   Record<string, Record<string, number>>;  // grafo completo de enlaces resueltos
unresolvedLinks: Record<string, Record<string, number>>;  // y de los no resueltos

on(name: 'changed', callback: (file: TFile, data: string, cache: CachedMetadata) => any): EventRef;

// CachedMetadata
frontmatter?: FrontMatterCache;
links?: LinkCache[];  embeds?: EmbedCache[];  tags?: TagCache[];
headings?: HeadingCache[];  sections?: SectionCache[];  listItems?: ListItemCache[];
frontmatterPosition?: Pos;

// FrontMatterCache
export interface FrontMatterCache { [key: string]: any; }   // ← el frontmatter íntegro, sin filtro

// Vault
getMarkdownFiles(): TFile[];
```

**Qué puede hacer, en consecuencia, cualquier plugin comunitario instalado:**

1. Enumerar **todas** las notas con `vault.getMarkdownFiles()`.
2. Llamar a `metadataCache.getCache(path)` por cada una y recibir **el frontmatter completo ya parseado, clave por clave, tipado como `any`** — de forma **síncrona, desde memoria, sin una sola lectura de disco** y sin ningún diálogo de permiso.
3. Suscribirse a `metadataCache.on('changed', ...)` y recibir, en cada reindexado, `data: string` — es decir **el texto íntegro del archivo**, empujado al plugin sin que éste lo pida.
4. Leer `resolvedLinks` / `unresolvedLinks`, que es **el grafo completo de la bóveda** con rutas absolutas de vault.

**Y el dato que cierra la cuestión:** la cadena `permission` aparece **cero veces** en las 8,498 líneas de la API pública. No hay permisos, ni ámbitos, ni capacidades, ni consentimiento, ni sandbox. Confirma con evidencia directa lo que la ronda 1 documentó sobre la campaña PHANTOMPULSE.

### 5.1 Qué implica para las decisiones ya tomadas

- **KS-28 (minimización de esquema para C4) es necesaria pero NO suficiente, y hay que decirlo así.** Mover el diagnóstico del frontmatter a la prosa **no lo oculta**: el evento `changed` entrega el cuerpo completo. Lo que cambia es el **coste de extracción**: el frontmatter es una lectura estructurada gratuita; la prosa exige procesamiento de lenguaje. Esa diferencia es real y vale la pena —separa el rastreo oportunista del ataque dirigido— **pero no puede venderse al usuario como protección.** La frase honesta es: *"reduce quién puede leerlo fácilmente, no quién puede leerlo."*
- **El único control que sí funciona es no poner el dato en la bóveda.** Refuerza la recomendación de `security-auditor` de que el comportamiento por defecto sea la **nota-puntero**, y le da un argumento verificado en vez de un supuesto.
- **KS-30 (sin wikilinks salientes desde C4) sube de importancia y a la vez se revela insuficiente:** `resolvedLinks` expone el grafo entero, y el **nombre del archivo y su ubicación** están en la caché aunque el contenido no diga nada. Ya se había señalado que el título es dato de salud (H-6); esto lo confirma a nivel de API.
- **Aparece un uso legítimo y valioso para el conector de Kibo.** El escaneo de la capa de mapeo (R2 §5.1) y **KS-35** ("clasificar en el dispositivo, enviar el esquema y no los datos") se implementan **casi gratis** con `getCache()`: el plugin puede calcular estadísticas de claves de frontmatter —nombres, tipos inferidos, conteos— **sin leer un solo archivo del disco y sin enviar contenido al servidor**. Esto abarata mucho `VaultScan`/`VaultKeyStat`/`VaultCluster`.
  - **Salvedad de coherencia:** R2 §2 fijó que hay **un solo emisor y un solo analizador** de bytes, en el servidor, por determinismo. La caché de Obsidian puede usarse para **detección de cambios y estadística**, nunca como análisis autoritativo. Si el hash o la extracción de enlaces dependieran del parser de Obsidian, volvería el riesgo de bucle de reescritura de R1 §3.2.

---

## 6 · Modelo de datos, revisado al alza

### 6.1 El patrón (invariante desde R2 §1.2)

`DomainRecord` como supertipo con herencia por tabla y clave primaria compartida sigue siendo la base y no cambia. Lo que se añade en esta ronda son **cuatro capas transversales** que el Art. 12 convierte en obligatorias:

1. **Clasificación de sensibilidad declarada en el esquema** (§6.2), no en comentarios ni en código de aplicación.
2. **Cifrado a nivel de columna para C4** (§6.3).
3. **Frontera de credenciales** que hace estructuralmente imposible que el servicio de IA lea C4 (§6.4).
4. **Consentimiento, exportación y borrado como tablas** (§6.5).

Y una regla nueva de modelado que evita un error caro:

> **No todo lo que se registra es un `DomainRecord`.** `DomainRecord` es la unidad de **proyección y sincronización**. Un signo vital medido cada 5 minutos por un reloj no debe crear un registro proyectable por lectura: son 100,000 filas al año, ninguna de las cuales quiere ser un archivo `.md`. Las series temporales de alta frecuencia van a tablas planas, y lo que se vuelve `DomainRecord` es su **agregado** (el resumen diario o la medición que el usuario capturó a mano).

### 6.2 Clasificación de sensibilidad — la matriz de residencia, en el esquema

```prisma
/// Sensitivity classes, aligned with the vocabulary of docs/analysis/obsidian/05 §1.
enum DataCategory {
  C1_SECRET        // tokens, keys — never user-visible
  C2_OPERATIONAL   // hashes, counters, sizes, economy ledger
  C3_PERSONAL      // user-authored content, titles, folder structure
  C4_SPECIAL       // health, financial/patrimonial, intimate content
}

enum ResidencyRule {
  ALLOWED
  CONSENT_REQUIRED    // explicit, per-category, revocable (Art. 12)
  FORBIDDEN
}

/// Declarative residency matrix. Required by constitution Art. 12 before code,
/// and kept in the database (not only in an ADR) because the projection engine,
/// the export engine and the consent screens all need to query it.
model RecordTypePolicy {
  recordType        RecordType    @id @map("record_type")
  category          DataCategory

  toUserDevice      ResidencyRule @default(FORBIDDEN) @map("to_user_device")   // vault / local file
  toKiboServer      ResidencyRule @default(ALLOWED)   @map("to_kibo_server")
  toLlmProcessor    ResidencyRule @default(FORBIDDEN) @map("to_llm_processor")

  /// Encryption at rest at column level is mandatory for this type.
  requiresColumnEncryption Boolean @default(false) @map("requires_column_encryption")
  /// Default projection shape when device residency is granted.
  /// POINTER = no clinical/financial payload on disk (security KS-28 default).
  projectionShape   ProjectionShape @default(POINTER) @map("projection_shape")
  /// Outgoing wikilinks are forbidden from this type (KS-30).
  allowOutgoingLinks Boolean @default(true) @map("allow_outgoing_links")

  policyVersion     Int      @default(1) @map("policy_version")
  updatedAt         DateTime @updatedAt @map("updated_at")

  @@map("record_type_policies")
}

enum ProjectionShape {
  NONE        // never leaves the server
  POINTER     // id + date + generic type + deep link, neutral filename
  MINIMAL     // pointer + non-sensitive frontmatter
  FULL        // complete structured frontmatter — opt-in escalation
}
```

Se siembra desde una constante de código para que sea revisable en el diff, pero **vive en la base** porque cuatro consumidores distintos la consultan en caliente. Una constante en TypeScript no se puede unir con una consulta ni auditar desde el servicio de exportación.

Y por campo, extendiendo `ProjectionFieldMap` de R2 §1.5:

```prisma
model ProjectionFieldMap {
  // ... campos de R2 §1.5 ...
  category      DataCategory @default(C3_PERSONAL)
  /// Hard block: this field never leaves the server, regardless of consent.
  /// Enforces D-17 (exploitable financial identifiers).
  neverProject  Boolean      @default(false) @map("never_project")
  /// Whether the field is included in the Art. 12 data export.
  exportable    Boolean      @default(true)
}
```

### 6.3 Ejemplo 1 — Salud

```prisma
model MedicalVisit {
  recordId      String    @id @map("record_id")
  userId        String    @map("user_id")

  // --- Clear-text: needed for indexing, listing and non-sensitive projection ---
  visitedAt     DateTime  @map("visited_at")
  followUpAt    DateTime? @map("follow_up_at")

  // --- C4 payload: AEAD-encrypted at application level (§6.4) ---
  // Ciphertext columns cannot be indexed or searched. That is the trade-off,
  // and it is why the timeline fields above stay in clear text.
  specialtyEnc    Bytes?  @map("specialty_enc")
  providerNameEnc Bytes?  @map("provider_name_enc")
  facilityEnc     Bytes?  @map("facility_enc")
  reasonEnc       Bytes?  @map("reason_enc")
  diagnosisEnc    Bytes?  @map("diagnosis_enc")
  indicationsEnc  Bytes?  @map("indications_enc")
  notesEnc        Bytes?  @map("notes_enc")

  /// Envelope encryption: identifies the per-user data key used, so keys can rotate.
  dekId         String    @map("dek_id")

  record        DomainRecord   @relation(fields: [recordId], references: [id], onDelete: Cascade)
  prescriptions Prescription[]

  @@index([userId, visitedAt(sort: Desc)])
  @@index([userId, followUpAt])
  @@map("medical_visits")
}

model Prescription {
  recordId      String    @id @map("record_id")
  userId        String    @map("user_id")
  visitId       String?   @map("visit_id")     // FK -> wikilink on projection (R2 §1.6)

  startsOn      DateTime? @db.Date @map("starts_on")
  endsOn        DateTime? @db.Date @map("ends_on")
  isActive      Boolean   @default(true) @map("is_active")

  drugNameEnc     Bytes  @map("drug_name_enc")
  doseEnc         Bytes? @map("dose_enc")
  frequencyEnc    Bytes? @map("frequency_enc")
  routeEnc        Bytes? @map("route_enc")
  instructionsEnc Bytes? @map("instructions_enc")
  dekId           String @map("dek_id")

  record        DomainRecord  @relation(fields: [recordId], references: [id], onDelete: Cascade)
  visit         MedicalVisit? @relation(fields: [visitId],  references: [recordId], onDelete: SetNull)

  @@index([userId, isActive, endsOn])
  @@index([visitId])
  @@map("prescriptions")
}

/// High-frequency time series: NOT a DomainRecord.
/// A wearable writing every 5 minutes must not create projectable records.
model VitalSignReading {
  id          BigInt   @id @default(autoincrement())
  userId      String   @map("user_id")
  kind        String                       // "hr" | "spo2" | "weight" | "bp_sys" | "bp_dia"
  measuredAt  DateTime @map("measured_at")
  /// Numeric values are low-entropy; encrypting them column-wise costs the ability
  /// to chart without decryption. Sensitivity here comes from the SERIES, not the
  /// single value, so protection is row-level access control + no projection.
  value       Decimal  @db.Decimal(10, 3)
  unit        String   @db.VarChar(12)
  source      String                       // "manual" | "health-connect" | "import"

  @@index([userId, kind, measuredAt(sort: Desc)])
  @@map("vital_sign_readings")
}

/// The projectable aggregate. THIS is the DomainRecord, not the readings.
model VitalSignSummary {
  recordId    String   @id @map("record_id")
  userId      String   @map("user_id")
  localDate   DateTime @db.Date @map("local_date")
  kind        String
  min         Decimal? @db.Decimal(10, 3)
  max         Decimal? @db.Decimal(10, 3)
  avg         Decimal? @db.Decimal(10, 3)
  samples     Int      @default(0)

  record      DomainRecord @relation(fields: [recordId], references: [id], onDelete: Cascade)

  @@unique([userId, localDate, kind])
  @@map("vital_sign_summaries")
}
```

Política sembrada para estos tipos:

```ts
// packages/database/prisma/seed-policies.ts (shape)
{ recordType: 'MEDICAL_VISIT', category: 'C4_SPECIAL',
  toUserDevice: 'CONSENT_REQUIRED', toKiboServer: 'ALLOWED', toLlmProcessor: 'FORBIDDEN',
  requiresColumnEncryption: true, projectionShape: 'POINTER', allowOutgoingLinks: false },

{ recordType: 'PRESCRIPTION', category: 'C4_SPECIAL',
  toUserDevice: 'CONSENT_REQUIRED', toKiboServer: 'ALLOWED', toLlmProcessor: 'FORBIDDEN',
  requiresColumnEncryption: true, projectionShape: 'POINTER', allowOutgoingLinks: false },
```

`allowOutgoingLinks: false` es **KS-30 codificado en datos**, no confiado a que alguien recuerde la regla.

### 6.4 Ejemplo 2 — Finanzas

```prisma
model FinancialAccount {
  recordId       String   @id @map("record_id")
  userId         String   @map("user_id")

  kind           String                    // "checking" | "credit" | "investment" | "cash"
  currency       String   @db.VarChar(3)
  isActive       Boolean  @default(true) @map("is_active")

  /// Display label chosen by the user. C3, not C4: "Tarjeta principal" is not exploitable.
  label          String

  // --- Exploitable identifiers: encrypted AND flagged never-project (D-17) ---
  institutionEnc     Bytes? @map("institution_enc")
  accountNumberEnc   Bytes? @map("account_number_enc")
  clabeEnc           Bytes? @map("clabe_enc")
  panLast4Enc        Bytes? @map("pan_last4_enc")

  // --- Balances: C4, encrypted, and excluded from projection by default ---
  currentBalanceEnc  Bytes? @map("current_balance_enc")
  creditLimitEnc     Bytes? @map("credit_limit_enc")
  dekId              String @map("dek_id")

  record         DomainRecord  @relation(fields: [recordId], references: [id], onDelete: Cascade)
  transactions   Transaction[]

  @@index([userId, isActive])
  @@map("financial_accounts")
}

model Transaction {
  recordId     String   @id @map("record_id")
  userId       String   @map("user_id")
  accountId    String   @map("account_id")

  occurredAt   DateTime @map("occurred_at")
  categoryKey  String?  @map("category_key")   // "food" | "transport" — C3, safe to aggregate
  direction    String   @db.VarChar(6)         // "in" | "out"

  amountEnc      Bytes  @map("amount_enc")
  descriptionEnc Bytes? @map("description_enc")
  counterpartyEnc Bytes? @map("counterparty_enc")
  dekId          String @map("dek_id")

  record       DomainRecord     @relation(fields: [recordId], references: [id], onDelete: Cascade)
  account      FinancialAccount @relation(fields: [accountId], references: [recordId], onDelete: Cascade)

  @@index([userId, occurredAt(sort: Desc)])
  @@index([accountId, occurredAt(sort: Desc)])
  @@map("transactions")
}
```

```ts
{ recordType: 'FINANCIAL_ACCOUNT', category: 'C4_SPECIAL',
  toUserDevice: 'FORBIDDEN',          // D-17: exploitable identifiers never reach disk
  toKiboServer: 'ALLOWED', toLlmProcessor: 'FORBIDDEN',
  requiresColumnEncryption: true, projectionShape: 'NONE', allowOutgoingLinks: false },

{ recordType: 'TRANSACTION', category: 'C4_SPECIAL',
  toUserDevice: 'CONSENT_REQUIRED',   // an expense log MAY be projected without identifiers
  toKiboServer: 'ALLOWED', toLlmProcessor: 'FORBIDDEN',
  requiresColumnEncryption: true, projectionShape: 'MINIMAL', allowOutgoingLinks: false },
```

Nótese la asimetría deliberada: **la cuenta nunca sale; el movimiento puede salir sin identificadores.** Un registro de gastos por categoría en la bóveda es útil y no habilita fraude; un número de cuenta o una CLABE sí. Es D-17 expresado como datos.

**Advertencia sobre el cifrado por columna, para que nadie se sorprenda después:** una columna cifrada **no se puede indexar, ni ordenar, ni buscar, ni agregar en SQL**. "Suma mis gastos de agosto" obliga a descifrar en la aplicación. Por eso los campos que sostienen consultas —fecha, dirección, categoría, moneda, cuenta— se quedan **en claro**, y solo se cifra la carga (importe, descripción, contraparte). Elegir mal ese reparto es lo que convierte un módulo de finanzas en un módulo que no puede mostrar un gráfico.

### 6.5 Frontera de credenciales — arquitectura, no un `if`

`security-auditor` pidió que la prohibición de C4 → LLM se exprese como arquitectura. Concreto:

```sql
-- Two Postgres roles. The AI service physically cannot read C4 tables.
CREATE ROLE kibo_app        LOGIN;   -- full domain access
CREATE ROLE kibo_ai_service LOGIN;   -- prompt composition only

GRANT SELECT ON habits, tasks, projects, areas, notes, note_links TO kibo_ai_service;
REVOKE ALL ON medical_visits, prescriptions, vital_sign_readings, vital_sign_summaries,
              financial_accounts, transactions, debts, journal_entries
       FROM kibo_ai_service;

-- Defence in depth: default-deny on future tables in the schema.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM kibo_ai_service;
```

En la aplicación, dos instancias distintas de `PrismaClient` con dos `DATABASE_URL` distintas, y el servicio de IA recibe por inyección **solo** la restringida. Si mañana alguien añade una consulta a `medical_visits` desde ese servicio, **falla en tiempo de ejecución con un error de permisos de Postgres**, no pasa la revisión y no llega a producción. Un `if` se borra en un refactor; un `REVOKE` no.

### 6.6 Consentimiento, exportación y borrado — Art. 12 como esquema

```prisma
model ConsentGrant {
  id            String        @id @default(uuid())
  userId        String        @map("user_id")

  /// The unit of consent is the triple (category × destination × direction) —
  /// never "connect vault". See docs/analysis/obsidian/15-r2 §4.
  category      DataCategory
  recordType    RecordType?   @map("record_type")
  destination   String                                  // "vault" | "llm" | "export" | "third_party"
  direction     String                                  // "out" | "in"

  granted       Boolean       @default(false)
  grantedAt     DateTime?     @map("granted_at")
  revokedAt     DateTime?     @map("revoked_at")
  expiresAt     DateTime?     @map("expires_at")        // KS-31: 180 days for C4

  @@unique([userId, category, recordType, destination, direction])
  @@index([userId, granted])
  @@map("consent_grants")
}

/// Immutable evidence of what was shown and accepted. Append-only; never updated.
model ConsentReceipt {
  id                String   @id @default(uuid())
  userId            String   @map("user_id")
  grantId           String   @map("grant_id")

  copyVersion       String   @map("copy_version")       // exact version of the text displayed
  copyHash          String   @map("copy_hash")          // sha256 of the rendered text
  locale            String
  decidedAt         DateTime @map("decided_at")
  decision          String                              // "granted" | "revoked"
  /// Sync surface detected at the moment of consent (KS-27). Nullable on mobile,
  /// where no absolute path exists (see §4.5).
  detectedSyncSurface Json?  @map("detected_sync_surface")
  clientKind        String   @map("client_kind")        // "web" | "android" | "plugin"

  @@index([userId, decidedAt(sort: Desc)])
  @@map("consent_receipts")
}

model DataSubjectRequest {
  id           String    @id @default(uuid())
  userId       String    @map("user_id")
  kind         String                          // "export" | "erasure"
  status       String    @default("PENDING")   // PENDING | RUNNING | DONE | FAILED
  requestedAt  DateTime  @default(now()) @map("requested_at")
  completedAt  DateTime? @map("completed_at")
  artifactUrl  String?   @map("artifact_url")  // short-lived signed URL
  /// Erasure must cascade to processors; this records which ones acknowledged.
  processorAcks Json?    @map("processor_acks")

  @@index([userId, requestedAt(sort: Desc)])
  @@map("data_subject_requests")
}
```

---

## 7 · Orden de construcción revisado

### 7.1 La pregunta correcta cambió

R2 optimizó el orden para **demostrar la tesis de Obsidian** (vertical de proyección primero). Con el nuevo encuadre la pregunta es otra: *¿cuál es el camino más corto a algo que Sergio use él mismo todos los días?*

Y esa pregunta tiene una respuesta incómoda para el plan de R2: **Sergio no usa Obsidian.** El brief de la ronda 1 lo dice: no lo tiene instalado y no tiene bóveda. Si la primera fase es la proyección a la bóveda, la primera fase construye una función que su autor **no puede usar a diario**. Eso es lo contrario del uso propio como validación.

Lo que hace que alguien abra un SO Personal todos los días no es la interoperabilidad: es **capturar en menos de cinco segundos y no romper la racha**. Eso es hábitos + tareas + racha, en el teléfono.

**Por tanto: la vertical de proyección baja de la fase 1 a la fase 3.** No se cancela —sigue siendo valiosa y todo el diseño de R2 sigue en pie— pero deja de ser el primer entregable, porque ahora hay un cliente Android y hay un usuario cero que no usa el sistema al que se proyecta.

### 7.2 El orden

**Fase 0 · Cimientos y decisión de stack — 2–3 semanas.**
ADR de stack (este documento es su insumo) y **ADR de la matriz de residencia**, que el Art. 12 exige *antes del código*. Migraciones Prisma en vez de `db push`. CI mínima. Borrar `packages/ui` y la basura de la raíz. `apps/api` real: prefijo, versionado, validación, CORS, errores. **Autenticación de móvil** (OAuth+PKCE, refresh rotatorio, `expo-secure-store`). `packages/api-contract`, `packages/core`, `packages/tokens`. Esqueleto de Expo con navegación, sesión y una pantalla real. **Spike de dos días de KIBO animado en Skia/Reanimated** — decide si la marca sobrevive al cambio de plataforma, y hay que saberlo ya.

**Fase 1 · El bucle diario en Android — 4–6 semanas. ⭐ El camino más corto al uso propio.**
Hábitos, tareas, racha global, `XpGrant` con idempotencia, Áreas (que ya existen como `Attribute`/`UserAttribute`), caché local + outbox (§3.3), notificaciones. Cierre de racha por zona horaria y fin de día configurable (R1 §4.3). **Al final de esta fase Sergio abre Kibo todos los días.** Nada de bóveda, nada de Markdown, nada de salud.

**Fase 2 · Diario — 3–4 semanas.**
El primer módulo tipado más allá del bucle. Elijo Diario y no Salud, coincidiendo con lo que UX argumentó en la ronda 2: **frecuencia diaria frente a dos eventos al año**. Además es C4 con una carga de riesgo mucho menor que salud o finanzas, lo que lo convierte en el terreno correcto para estrenar cifrado por columna, consentimiento por categoría y acuses **antes** de tocar un expediente médico.

**Fase 3 · Proyección + conector de Obsidian — 4–5 semanas.**
La vertical de R2 §6.3, ahora con entidades reales que proyectar (hábitos, tareas, diario) y **solo en escritorio** (§4.6). Es también el momento de que Sergio instale Obsidian y sea usuario de lo que está construyendo.

**Fase 4 · Web: centro de privacidad y tableros — 3–4 semanas.**
Exportación, borrado, consentimientos, facturación, y las vistas amplias donde el móvil es peor. Art. 12 convierte la primera mitad en obligatoria antes de tener usuarios reales.

**Fase 5 · Salud — 3–4 semanas.**
Con el aparato C4 ya probado en Diario. Requiere la **DPIA** completada y archivada (Art. 12) y el cierre de `[P]`-8 (validez del consentimiento "por escrito" digital bajo LFPDPPP) antes de habilitar proyección.

**Fase 6 · Finanzas · Fase 7 · Recursos y notas libres.**
Finanzas al final del bloque C4 por D-17 y por el reparto claro/cifrado de §6.4. Recursos donde R2 lo dejó: prioridad de producto, no dependencia de la integración.

### 7.3 Un aviso de secuencia que no es técnico

La maqueta —~40 pantallas— **es de escritorio a 1280 px, con un design system web y una mascota animada en CSS.** Nada de eso se transporta a 390 px de ancho ni a `StyleSheet`. Con Android primero, **la maqueta pasa de ser especificación a ser insumo.**

Esto no bloquea la fase 0, pero **bloquea la fase 1** si nadie lo empieza ya. Recomendación: que el rediseño móvil del bucle diario (Hoy, Hábitos, Tareas, KIBO, racha) arranque en paralelo con la fase 0, y que se acuerde explícitamente qué se conserva de la identidad visual y qué se rehace. La alternativa —que ingeniería improvise la UI móvil sobre la marcha— es cómo Kibo pierde exactamente aquello que lo diferencia.

---

## Recomendación

**El stack actual sobrevive casi entero, pero cambia de forma.** Postgres + Prisma + NestJS + Next.js siguen siendo correctos. Lo que cambia es la **topología**: `apps/api` deja de ser un cascarón huérfano y pasa a ser el backend único del que web y Android son clientes por igual; `apps/web` baja de producto a superficie de escritorio y de cumplimiento; `packages/ui` se borra; y entran `apps/mobile` (Expo), `packages/api-contract`, `packages/core` y `packages/tokens`. **Se comparten contratos, dominio puro y valores de diseño; no se comparten componentes.** La base local del móvil es `expo-sqlite` + Drizzle como caché más un **outbox de intenciones**, porque Kibo es de un solo escritor y la economía tiene que ser autoritativa en el servidor: no hace falta un motor de replicación, y PowerSync queda anotado como la escalada correcta con disparadores explícitos.

**Y hay un hallazgo que cambia el producto, no solo la implementación:** la bóveda **no se puede escribir desde Android de forma fiable**. SAF permite escribir, sí, pero las nubes mayoristas en Android no espejan carpetas locales —lo dice la propia documentación de Obsidian—, la concesión persistente muere justo cuando un sincronizador mueve la carpeta, el recorrido es lento y no hay ruta absoluta que inspeccionar. **La bóveda tiene un solo escritor y corre en escritorio.** Eso resuelve de paso la pregunta de la app de Windows: su única razón de existir sería escribir la bóveda para quien no usa Obsidian, y mientras eso no sea un segmento real, **no la construyas**.

### Las tres cosas que más me preocupan

**1 · No existe diseño para el producto que se va a construir, y es el riesgo dominante.** La maqueta es de escritorio a 1280 px con un design system web; el producto ahora es una app Android. No se transporta una sola pantalla. El riesgo no es técnico: es que ingeniería quede bloqueada esperando diseño, o —peor— que improvise la UI móvil y Kibo pierda el acabado, que es literalmente su tesis diferenciadora frente a Notion y Todoist. Dentro de esto va un sub-riesgo concreto y verificable en dos días: **la mascota KIBO y la ceremonia de cofres son la pieza de mayor riesgo técnico del cambio de plataforma**, y hay que prototiparlas en la fase 0, no descubrirlas en la fase 3.

**2 · "`apps/api` ya existe" es la mentira más peligrosa del repositorio.** Existe como andamio generado, sin autenticación, sin validación, con CORS abierto y con su único controlador roto (`findOne(+id)` sobre un id UUID). Android lo convierte en obligatorio y le añade trabajo que no estaba en ningún plan: un tercer esquema de credenciales, una economía autoritativa en servidor con idempotencia, cifrado por columna, frontera de credenciales por rol de Postgres, y las tablas de consentimiento/exportación/borrado que el Art. 12 vuelve requisitos. Es el mayor bloque de trabajo invisible del plan y es fácil subestimarlo precisamente porque la carpeta ya está ahí.

**3 · La promesa "tu bóveda, en todos lados" se va a incumplir si no se acota ahora.** El usuario de un SO Personal con Android primero va a asumir que lo que registra en el teléfono aparece en su carpeta. Y aparecerá — pero por la vía del servidor y del conector de escritorio, la próxima vez que abra Obsidian en su PC. Eso es defendible y explicable en una frase, **siempre que se diga desde el principio**. Si el material de producto insinúa escritura directa desde el móvil, el producto va a fallar en el punto donde más confianza se necesita. Y hay un corolario que hay que vigilar: la salida fácil —que el servidor de Kibo escriba en el Drive del usuario vía OAuth— **reabre KS-06b y destruye el argumento legal completo sobre el que se levantó la prohibición de salud**. No es un atajo de implementación; es un cambio de naturaleza jurídica.

---

## Fuentes (todas consultadas 2026-08-08)

- [Access documents and other files from shared storage — Android Developers](https://developer.android.com/training/data-storage/shared/documents-files) — `ACTION_OPEN_DOCUMENT_TREE` desde API 21; restricciones de Android 11 (raíz de almacenamiento interno, raíz de SD fiables, `Download`, `Android/data`, `Android/obb`); `takePersistableUriPermission` y su pérdida si el documento se mueve o borra; advertencia de rendimiento al iterar muchos archivos
- [Storage updates in Android 11 — Android Developers](https://developer.android.com/about/versions/11/privacy/storage) — cambios de almacenamiento con alcance
- [Use of All files access (MANAGE_EXTERNAL_STORAGE) permission — Play Console Help](https://support.google.com/googleplay/android-developer/answer/10467955) — restricción a funcionalidad principal; usos permitidos (gestores de archivos, respaldo, antivirus, gestión documental); Formulario de Declaración de Permisos obligatorio; posible retirada de Google Play
- [FileSystem — Expo Docs](https://docs.expo.dev/versions/latest/sdk/filesystem/) y [FileSystem (legacy) — Expo Docs](https://docs.expo.dev/versions/latest/sdk/filesystem-legacy/) — soporte de URIs `content://` de SAF y sus límites; `StorageAccessFramework.requestDirectoryPermissionsAsync()`, `createFileAsync`, `readDirectoryAsync`, `moveAsync`
- [Sync your notes across devices — Obsidian Help](https://help.obsidian.md/Getting+started/Sync+your+notes+across+devices) — OneDrive "limited functionality on Android" y recomendación de Dropsync/FolderSync; Google Drive "not officially supported for syncing Obsidian vaults"
- [`obsidian.d.ts` — obsidianmd/obsidian-api, rama `master`](https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts) — `MetadataCache.getCache/getFileCache`, `CachedMetadata.frontmatter`, `FrontMatterCache { [key: string]: any }`, `resolvedLinks`/`unresolvedLinks`, evento `changed` con el cuerpo completo, `Vault.getMarkdownFiles()`, `FileSystemAdapter.getBasePath()`, `Platform.isAndroidApp`; **cero ocurrencias de `permission` en toda la API pública**
- [Writes — Electric Sync Docs](https://electric-sql.com/docs/guides/writes) — *"Electric does read-path sync... Electric does not do write-path sync"*
- [PowerSync Docs — Overview](https://docs.powersync.com/intro/powersync-overview) — motor de sincronización que mantiene la base del backend en sincronía con SQLite en la app; Postgres entre las fuentes soportadas
- `constitution.md` v1.7 (2026-08-08), Art. 3 acotado y Art. 12 nuevo — matriz de residencia previa al código, DPIA previa al lanzamiento, consentimiento granular, exportación y borrado como funciones
