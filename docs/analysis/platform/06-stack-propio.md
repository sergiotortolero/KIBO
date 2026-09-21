# 06 · Stack propio — comprar vs construir con el aprendizaje como requisito

**Fecha:** 2026-08-08 · **Autor:** solution-architect · **Estado:** delta de alcance acotado
**Corrige:** `docs/analysis/platform/01-arquitectura-plataforma.md` §1.4, §2.4, §3.2 · `docs/adr/0002-kibo-platform-architecture.md` componentes 1 y 4
**Alcance duro:** solo stack y comprar-vs-construir. No toca transporte de bóveda, IA, seguridad ni roadmap.

> **Leyenda:** **[V]** hecho verificado (fuente y fecha en §6) · **[I]** inferencia · **[S]** supuesto mío.

---

## 0 · Qué cambió y qué no

| Premisa anterior | Corrección de Sergio |
|---|---|
| "Android primero" = antes que la web | **"Android primero" = no habrá iOS.** Web y Android son objetivos iguales |
| Comprar auth y replicación libera al dev solo | **Aprender es un requisito declarado**, no un residuo: *"sé que Supabase me puede ayudar a eliminar la capa del backend, pero justo por eso quiero aprender"* |
| — | **Control absoluto del código**, y stack **reutilizable** al máximo posible |

**Lo que NO cambia:** escribir un motor de replicación offline-first siendo un desarrollador solo sigue siendo la vía rápida a corrupción silenciosa de datos. Ese argumento era correcto y sigue siéndolo. Lo que cambia es que ahora hay un criterio que antes no estaba, y ese criterio reordena las respuestas — no las invierte todas.

---

## 1 · El criterio nuevo

Claude propone la pregunta correcta: *¿construirla enseña algo que Sergio necesita saber, o solo cuesta meses sin enseñar nada transferible?* Le añado un segundo eje, porque sin él la respuesta es temeraria:

> **¿Qué pasa si sale mal?** Hay piezas donde fallar **enseña** (se rompe, lo arreglas, aprendiste) y piezas donde fallar es **silencioso e irreversible** (fuga de credenciales, datos corrompidos que nadie ve hasta que un usuario pierde tres meses de diario).

| | **Fallo recuperable** | **Fallo irreversible o silencioso** |
|---|---|---|
| **Aprendizaje alto y transferible** | ✅ **CONSTRUIR** — cuadrante de oro | ⚠️ **CONSTRUIR CON RED** — construir, pero con una red explícita, y preferiblemente *después* de tener criterio |
| **Aprendizaje bajo o poco transferible** | 🛒 **ALQUILAR** — cuesta meses y no enseña | 🛒 **ALQUILAR SIN DUDAR** |

"Transferible" aquí tiene un significado concreto: Sergio es PM en una consultora de datos. **Modelado de datos, SQL, migraciones, colas e idempotencia le sirven el lunes en TIBS.** Relojes lógicos y convergencia CRDT, no.

---

## 2 · Pieza por pieza

| Pieza | Qué se aprende construyéndola | Coste del fallo | **Veredicto** |
|---|---|---|---|
| **Autenticación** | Conceptos sí (sesiones, JWT, refresh, OAuth), pero se aprenden **igual leyendo e integrando** | **Catastrófico y sutil** | ⚠️ **Librería self-hosted** — ni servicio externo ni artesanal |
| **Esquema y migraciones** | Muchísimo, y **es lo más transferible del stack** | Recuperable con respaldos | ✅ **CONSTRUIR** |
| **Operación de Postgres** (respaldos, parches, alta disponibilidad) | Casi nada de producto | Alto | 🛒 **ALQUILAR** |
| **Replicación offline** | Mucho, pero **poco transferible** | **Corrupción silenciosa** | ⚠️ **CONSTRUIR CON RED** (ver §3) |
| **Almacenamiento de archivos** | Poco: subir a S3 con URLs prefirmadas se aprende en una tarde | Moderado | 🛒 **ALQUILAR** el almacén, escribir él la lógica de subida |
| **Notificaciones push** | El registro de tokens, poco más | Moderado | 🛒 **FCM** — no hay decisión: Google controla el canal en Android |
| **Trabajos en segundo plano** | Mucho y **transferible**: colas, reintentos, idempotencia, cron | Recuperable (un job falla, se reintenta) | ✅ **CONSTRUIR** con librería |
| **Observabilidad** | Construirla enseña poco; **usarla enseña muchísimo** (leer un stack trace en producción) | Sin ella no ves los fallos → indirectamente grave | 🛒 **ALQUILAR** |

**Neto: construye 3 de 8** — y son exactamente las tres que más le enseñan y más se transfieren a su trabajo. Eso respeta el objetivo sin complacencia.

### Las tres decisiones que merecen explicación

**Autenticación — la tercera vía que no consideré en R3.** Yo recomendé Supabase Auth, que es un servicio externo: control cero, usuarios en base ajena. Sergio quiere lo contrario. Pero la alternativa **no** es escribir criptografía a mano. Existe el punto medio: **una librería self-hosted que guarda los usuarios en TU Postgres**. Control absoluto de datos y de código, sin escribir lo peligroso.

**Better Auth** es la recomendación: se convirtió en **el sucesor de Auth.js a principios de 2026** y es donde continúa el desarrollo activo; llegó a v1.6 en mayo de 2026; corre en tu app y guarda usuarios en tu base; y trae `@better-auth/expo`, que resuelve los problemas específicos de móvil (no hay `document.cookie`, flujos OAuth por el navegador del sistema, almacenamiento seguro) **[V §6.1]**. El repo ya tiene Auth.js scaffolded con tablas `Account`/`Session`/`VerificationToken`; migrar ahora es barato, y **no se recomienda empezar un proyecto nuevo sobre NextAuth en 2026** **[V §6.1]**.

Y un detalle que resuelve la tensión de forma elegante: **Lucia fue deprecada como librería en marzo de 2025 y reconvertida en un recurso de aprendizaje para implementar sesiones desde cero** **[V §6.1]**. Es decir, existe material hecho a medida para el objetivo exacto de Sergio: **aprender autenticación leyendo Lucia, y enviar a producción con Better Auth.** Aprende el concepto sin apostar las cuentas de sus usuarios a su primera implementación.

**Trabajos en segundo plano — `pg-boss`, no BullMQ.** Rachas que expiran a medianoche, recordatorios, proyección de bóveda, conectores: todo eso son jobs. `pg-boss` usa el Postgres que ya tienes con `LISTEN/NOTIFY` y **no requiere Redis**; su techo de rendimiento está por debajo de una cola sobre Redis, pero para decenas o cientos de jobs por segundo elimina una pieza entera de infraestructura **[V §6.2]**. Para alguien aprendiendo, esto es doblemente correcto: **enseña exactamente lo mismo** (reintentos, cron, dead-letter, idempotencia) con **una pieza menos que mantener**. BullMQ gana en pipelines de miles de eventos por minuto con grafos de dependencias **[V §6.2]** — no es el caso.

**Postgres: alquilar la operación, construir el esquema.** Es una distinción que en R3 no separé bien y por eso sonó a "usa Supabase para todo". Alquilar respaldos, parches y disponibilidad **no le quita un gramo de aprendizaje**; escribir el esquema, los índices, las transacciones y las migraciones es donde está *todo* el aprendizaje. Y la consecuencia práctica: **no hace falta Supabase.** Cualquier Postgres gestionado sirve igual (Neon, Railway, Fly, RDS), y así no se acopla a la plataforma de nadie. Con Better Auth encima, el argumento principal para Supabase —que era su Auth— desaparece.

---

## 3 · Replicación offline: mi argumento sigue en pie, mi conclusión cambia

En R3 planteé la disyuntiva mal: "PowerSync o escribir un motor de replicación". Hay un punto medio, y el análisis del problema real lo hace defendible. **Kibo tiene tres propiedades que eliminan la parte difícil:**

1. **Un solo usuario por dato.** No hay dos personas editando el mismo registro. La colaboración concurrente —que es lo que hace difícil la replicación— **no existe aquí**.
2. **Un teléfono y una web**, rara vez tocando el mismo registro en el mismo minuto.
3. **Las operaciones son sobre todo aditivas** ("completé una tarea", "escribí una entrada"), no ediciones concurrentes de texto largo.

Un motor general resuelve un problema que Kibo casi no tiene. Lo que Kibo sí necesita es lo que ya está diseñado en el ADR-0002: **cola de operaciones con `opId` idempotente + servidor autoritativo**.

**La red de seguridad, que es lo que hace esto responsable:**

> **El cliente es descartable.** El estado local es una **caché**, nunca una fuente de verdad. Si se corrompe, se tira y se reconstruye pidiendo un refresco completo al servidor. Y una operación **no se borra de la cola hasta que el servidor la confirma**.

Con esas dos reglas, el peor fallo imaginable deja de ser "el usuario perdió tres meses de diario" y pasa a ser "la app tardó en arrancar una vez". Eso mueve la pieza del cuadrante irreversible al recuperable, y ahí sí se puede construir.

**Recomendación: construirla, y construirla al final** (§5). SQLite local con `expo-sqlite` + Drizzle, o WatermelonDB. **PowerSync queda como plan B documentado**, no como recomendación — y sigue siendo barato adoptarlo después, porque el estado autoritativo y el log son propios.

---

## 4 · La tecnología reutilizable

Sin iOS, la razón "cubre las dos tiendas" desaparece — y hay que decirlo, porque era uno de los argumentos de Expo en R3. Con esa pata fuera, **Kotlin/Compose es más defendible que antes**. Aun así no gana, y por la razón que el propio Sergio dio.

| Stack | Reutilización real | Curva desde React | Veredicto |
|---|---|---|---|
| **TypeScript de punta a punta** (Next.js + NestJS + Expo) | Dominio, contrato, validación, formato de bóveda | Ninguna | ✅ **Recomendado** |
| **Kotlin de punta a punta** (Ktor + Compose Multiplatform) | Alta en teoría | **Lenguaje nuevo completo** | ❌ Rompe la petición #3 de Sergio |
| **Python backend + TS clientes** | **Cero** entre servidor y clientes | Media; le sirve en TIBS | ❌ Pierde `packages/domain`, que es la mayor palanca |
| **Go backend + TS clientes** | Cero | Alta | ❌ |

El argumento decisivo es literalmente el suyo — *"una tecnología que podamos reutilizar en la medida de lo posible"*: **cualquier backend que no sea TypeScript destruye `packages/domain`**, que es el único lugar donde servidor, web y Android comparten código de verdad. Y para alguien aprendiendo, dos lenguajes es dos curvas.

### Qué se reutiliza y qué no — sin adornos

| ✅ Se comparte | ❌ No se comparte |
|---|---|
| `packages/domain` — entidades, reglas puras (XP = tiempo × factor × energía × prioridad, rachas, HP) | **Pantallas.** React Native y web son dos árboles de componentes distintos |
| `packages/sync-core` — tipos de `Operation`, cola, política | Navegación, estilos, gestos |
| `packages/markdown-vault-format` | Layout responsive vs layout móvil |
| Tipos del contrato, generados de OpenAPI | Accesibilidad y atajos de teclado |
| Validación — el **mismo esquema Zod** valida en cliente y en servidor | |
| El lenguaje y el modelo mental | |

**La lógica se comparte; la interfaz no.** Ese hecho no cambió con la corrección de alcance, y es la restricción real de esfuerzo — no la prioridad entre plataformas.

### NestJS: se mantiene, y por una razón pedagógica

NestJS tiene mucha ceremonia (módulos, providers, inyección de dependencias, decoradores) y para alguien que aprende eso suena a curva sobre curva. Pero **esa rigidez es andamiaje**: le impone una organización en vez de dejarlo inventar una, que es exactamente lo que un principiante necesita. Además ya está en el repo, y cambiar de framework no enseña nada nuevo.

**Señal de alarma para reconsiderar [S]:** si se atasca peleando con la ceremonia de Nest en vez de con su dominio, cambiar a Fastify + Zod o a Hono es legítimo. El andamio deja de servir cuando estorba.

---

## 5 · El orden de aprendizaje

No es roadmap de producto (eso es de `product-planner`): es el orden en que conviene construir **las piezas de infraestructura**, de modo que cada una se apoye en la anterior.

| # | Pieza | Qué enseña | Por qué va aquí |
|---|---|---|---|
| 1 | **Esquema, migraciones y CRUD sin gamificación** | Modelado, Prisma, Postgres, transacciones | Lo más transferible a TIBS, y todo lo demás se apoya en esto |
| 2 | **API REST + validación + Better Auth** | Contratos, autenticación, autorización | Necesita el esquema del paso 1 |
| 3 | **UN cliente, online-only** — web o Android, el que sea, pero uno | Consumo de API, estado, formularios | Terminar una plataforma enseña más que dejar dos a medias |
| 4 | **Reglas de dominio puras en `packages/domain`** | Separación lógica/presentación, testing | Aquí entra el XP. Necesita haber sufrido el paso 3 para entender por qué se separa |
| 5 | **Jobs en segundo plano (`pg-boss`)** | Idempotencia, reintentos, cron | Rachas que expiran a medianoche. Necesita el dominio del paso 4 |
| 6 | **El segundo cliente** | Reutilización real | Aquí **ve** el retorno de haber separado el dominio. Antes es un acto de fe |
| 7 | **Offline: cola de operaciones + SQLite** | Sincronización, conflictos, idempotencia | **Al final, a propósito.** Es la pieza que más criterio exige y peor sale sin él |
| 8 | **Proyector de bóveda y conectores** | Integración, mapeo | Sobre el log de operaciones que ya existe del paso 7 |

**El punto pedagógico central: el offline va al final, no al principio.** Y eso tiene una consecuencia práctica que conviene declarar: **la primera versión de la app Android puede ser online-only.** No rompe nada — pospone una capacidad. En R3 puse offline-first como consecuencia inevitable de "Android primero"; con "Android primero" significando "no habrá iOS", offline-first sigue siendo el destino pero **deja de ser el punto de partida**.

---

## 6 · Corrección: se retira la recomendación de acotar la web

Mi recomendación de R3 (§1.4 y componente 1 del ADR-0002) de reducir la web a landing, onboarding y dato ancho **se apoyaba en la premisa equivocada** de que Android iba temporalmente primero. Con web y Android como objetivos iguales, **se retira**.

Lo que **no** se retira es el hecho que la sostenía: las pantallas se escriben dos veces. Así que la recomendación correcta es distinta, no ausente:

> **Paridad de funciones, no paridad de pantallas.** Cada plataforma expresa las mismas capacidades con la forma que le corresponde — la web puede tener un cronograma ancho que en el teléfono es una lista; el teléfono puede tener captura rápida que en la web es un formulario.
>
> **Y en el tiempo: un módulo completo en un cliente antes de portarlo al otro.** No dos clientes al 50%.

Esto es una recomendación de secuencia de construcción, no de recorte de alcance. Nada queda fuera del producto.

---

## 7 · Fuentes nuevas

Consultadas el **2026-08-08**. Las anteriores siguen en `01-arquitectura-plataforma.md` §9.

| # | Fuente | Qué respalda |
|---|---|---|
| 6.1 | [better-auth vs NextAuth v5 vs Clerk 2026](https://www.pkgpulse.com/guides/better-auth-vs-nextauth-v5-vs-clerk-2026) · [Better Auth — Expo integration](https://better-auth.com/docs/integrations/expo) · [Lucia](https://lucia-auth.com/) · [Lucia — future plans](https://github.com/lucia-auth/lucia/discussions/1707) | Better Auth como sucesor de Auth.js a principios de 2026, v1.6 en mayo 2026, self-hosted con usuarios en tu base, `@better-auth/expo` para React Native; no iniciar proyectos nuevos sobre NextAuth en 2026; **Lucia deprecada en marzo 2025 y reconvertida en recurso de aprendizaje** |
| 6.2 | [BullMQ vs Bee-Queue vs pg-boss 2026](https://www.pkgpulse.com/guides/bullmq-vs-bee-queue-vs-pg-boss-job-queues-nodejs-2026) · [pg-boss tutorial (2026)](https://nerdleveltech.com/pg-boss-postgres-job-queue-node-typescript-production-tutorial) | pg-boss sobre Postgres con `LISTEN/NOTIFY`, sin Redis; techo por `SKIP LOCKED` menor que Redis; adecuado para decenas/cientos de jobs por segundo con reintentos, cron y dead-letter; BullMQ para pipelines de alto volumen con grafos de dependencias |

---

## 8 · Recomendación

1. **Construir 3 de 8 piezas**: esquema y migraciones, jobs en segundo plano, y sincronización offline. Son las tres que más enseñan y más se transfieren a su trabajo en TIBS.
2. **Alquilar 4**: operación de Postgres, almacenamiento de archivos, push (FCM), observabilidad. No enseñan nada que no se aprenda usándolas.
3. **Autenticación por la tercera vía**: **Better Auth self-hosted** sobre su propio Postgres — control absoluto de datos y código sin escribir criptografía. Y aprender el concepto leyendo Lucia, que existe para eso exactamente.
4. **Supabase deja de ser necesario.** Con Better Auth, su argumento principal desaparece; cualquier Postgres gestionado sirve y no acopla a nadie.
5. **PowerSync baja de recomendación a plan B.** El argumento de R3 seguía siendo cierto, pero el problema real de Kibo —un usuario, dos clientes, operaciones aditivas— es mucho más fácil que el caso general, y el cliente descartable convierte el fallo en recuperable.
6. **TypeScript de punta a punta**, NestJS incluido. Cualquier otro backend destruye `packages/domain`, que es la única reutilización real que existe.
7. **El offline se construye al final.** La primera Android puede ser online-only.
8. **Se retira acotar la web**; se sustituye por paridad de funciones y por construir un módulo completo en un cliente antes de portarlo.

### Lo que más me preocupa de este delta

**1 · Construir sincronización offline sigue siendo la apuesta más arriesgada, aunque ahora la recomiende.** Cambié de conclusión porque cambió el criterio y porque afiné el análisis —el problema de Kibo es más fácil que el caso general— pero no porque el riesgo haya desaparecido. **Todo el argumento depende de que la regla del cliente descartable se respete de verdad.** El día que algo viva solo en el SQLite del teléfono y no en el servidor, la red desaparece y volvemos al escenario que quería evitar. Recomiendo que eso sea una prueba automatizada, no una intención: borrar la base local en un test y verificar que no se perdió nada.

**2 · El orden de aprendizaje choca con la impaciencia natural de construir lo vistoso.** Los pasos 1 y 2 —esquema y API— no producen nada que se pueda enseñar a nadie, y son las semanas donde más gente abandona. Es un riesgo real de un proyecto personal, y es de `product-planner` decidir si se intercala algo visible antes para sostener el ánimo. Yo solo señalo que **cambiar ese orden tiene un costo técnico**: hacer el offline antes del paso 4 es exactamente cómo se corrompen datos.

**3 · Aprender y enviar a producción son objetivos que a veces se contradicen, y conviene decidir cuál gana de antemano.** Habrá un momento —probablemente en el paso 7— en que la opción que más enseña sea también la que retrasa dos meses. Este documento resuelve esa tensión pieza por pieza con un criterio explícito, pero el criterio hay que aplicarlo cada vez. Si en algún punto Kibo necesita existir antes que Sergio necesite entenderlo, **PowerSync sigue ahí y adoptarlo después es barato** — precisamente porque el estado autoritativo y el log de operaciones son suyos.
