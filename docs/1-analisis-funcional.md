# Kibo — Análisis Funcional

Cada requerimiento funcional y no-funcional, verificable uno por uno.

**Para quién es:** QA y quien valide la solución antes del lanzamiento.
**Versión:** 1.0-alpha

## Registro de modificaciones

| Versión | Fecha | Editó | Qué cambió | Por qué |
|---|---|---|---|---|
| 1.0-alpha | 2026-09-05 | technical-writer | Primera versión del análisis funcional | El portafolio documenta cada solución en cinco documentos numerados |
| 1.0-alpha | 2026-09-05 | technical-writer | Primer documento de análisis funcional | Migración de ARCHITECTURE.md v1.7 y ANALYSIS.md v1.1 a documentación de cinco piezas (Art. 5) |

## Contenido

- [1. Requerimientos de producto](#1-requerimientos-de-producto)
- [2. Economía e integridad del juego](#2-economía-e-integridad-del-juego)
- [3. Datos personales y privacidad (Art. 12)](#3-datos-personales-y-privacidad-art-12)
- [4. Seguridad](#4-seguridad)
- [5. Accesibilidad (WCAG 2.1 AA)](#5-accesibilidad-wcag-21-aa)
- [6. Performance y escalabilidad](#6-performance-y-escalabilidad)
- [7. Métricas de éxito](#7-métricas-de-éxito)

---

## 1. Requerimientos de producto

### 1.1 Módulos y mecánicas de carga

Cada módulo a continuación es verificable como una colección de requerimientos. El módulo se considera completo cuando sus mecánicas de carga se preservan tal como se describe.

| Módulo | Requerimiento | Verificación |
|---|---|---|
| **Hoy** (cuadro de mando) | Grilla de widgets personalizable. El usuario agrega/quita widgets desde una galería | Un usuario sin widgets agrega uno; la grilla redibuja |
| | Widgets premium disponibles si se posee Elemento o está activo Premium | Un widget premium solo aparece si el usuario tiene Elemento |
| | Racha global visible en la barra lateral como FAB (Kibo) | La racha es siempre visible sin scroll |
| **KIBO** (mascota) | Gel animado: respira, parpadea, juega (flip, squash, balloon, drip, wave, wave) | Las animaciones ejecutan sin lag a ≥30 fps en Android de gama media (Snapdragon 6 Gen 1) y navegador estándar |
| | La expresión (ojos, pupilas, boca, cejas) **refleja el ánimo, no el color.** El color es skin, el ánimo es cara | Cambiar la skin no cambia la expresión. Cambiar HP cambia solo la cara (cejas, boca), nunca el color |
| | Skins del guardarropa (cuerpo personalizable, accesorios, auras). Refresca en tiempo real en la barra lateral | Equipar una skin la muestra inmediatamente en el sidebar |
| | Personalidades (frecuencia de travesura). Modulan el comportamiento sin cambiar la identidad | Cambiar personalidad muestra el efecto en la próxima travesura |
| **Hábitos** | Esfuerzo 1–5 (selector). Prioridad con glifos. Periodicidad: diaria, cada 2 días, semanal, quincenal, mensual | Un hábito se puede crear con todas las opciones disponibles |
| | Recompensa = prioridad × esfuerzo (fórmula visible en tooltip). Se gana al completar | Completar un hábito de prioridad media (3) y esfuerzo 3 gana 9 Divisa |
| | Racha por hábito y racha global. Ambas bajan si se falla una vez, se pierden si se fallan dos | Fallar en día 5 de una racha la baja a 1. Fallar de nuevo al día siguiente la pierde |
| | Protectores: evitan la pérdida de racha. Se compran con Elemento | Un protector bloquea la caída de racha una vez |
| | Niveles de llama por racha: visuales (Llama 1, Llama 2, Llama 3) según días consecutivos | Las llamas suben cada día consecutivo, bajan con fallo |
| | Archivo de hábitos completados. Cada completado deja un registro | La historia del hábito muestra todos los días completados |
| **Retos** | Compromiso con fecha límite y dificultad 1–5. El daño es −8 / −14 / −22 / −34 / −50 HP por fallo | Un reto nivel 3 inflige −22 HP al fallar |
| | Se tolera el 20 % de fallos dentro del plazo | En un reto de 10 días, fallar 2 días no lo cierra. Fallar 3 sí |
| | Solo o con amigos. Modo compartido: cada jugador maneja su propio HP | Dos usuarios en un reto pueden fallar independientemente |
| | Scoreboard compartido: días cumplidos, fallos internos, racha, quién lidera | El scoreboard se actualiza en tiempo real |
| | Cierre con rewards y banner que va a Logros | Al cerrar un reto completo, aparece un banner permanente en Logros |
| **Tareas y Proyectos** | Kanban con columnas editables. Subtareas. Fechas, esfuerzo, prioridad | Crear un proyecto, agregar tareas con subtareas |
| | Línea de tiempo (KbTimeline): escala 1 semana → 12 meses + rango custom. Scroll horizontal. Columna fija | La línea de tiempo es responsive y las tareas se ven en todas las escalas |
| **Áreas** | Cinco áreas (Vigor, Sabiduría, Riqueza, Comunidad, Voluntad) | Todas las cinco siempre presentes |
| | Cada área acumula XP y muestra rango militar (20 tiers × 9 materiales). Prestigio 1–16. Paragon post-máximo | Un usuario en área Sabiduría nivel 5 material Acero (ejemplo) se muestra con ese rango |
| **Progreso/Personaje y Logros** | Showcase: indicadores, prestigio, paragon. Catálogo de logros (públicos, secretos, escondidos; 4 raridades) | Un logro secreto no aparece hasta cumplirse. Uno público aparece siempre en el catálogo |
| | Trofeos mensuales. Banners de retos completados. Todo agrupado | Ir a Logros muestra trofeos agrupados por mes |
| **Vitrina** | Lo que la comunidad ve: perfil, foto, título, lema, 3–9 logros destacados (expandible con feature), KIBO companion | Un usuario ve el perfil de otro con sus logros destacados |
| **Amigos** | Sin transferencias de dinero. Regalos de ítems (cosmético) | Un usuario regala un cosmético a otro |
| | Contribuciones a listas de deseos, capped en 90 % | Si un deseo cuesta 100 Divisa, otro usuario puede aportar máximo 90 |
| | Rachas compartidas. Nudges estilo Duolingo (notificaciones de "tu amigo completó un reto") | Recibir notificación cuando amigo completó reto |
| | Retos compartidos con scoreboard (días cumplidos, fallos, racha interna, quién lidera) | Scoreboard muestra todos los datos en tiempo real |
| | Feed de actividad agrupado por día. Aplausos | El feed muestra las acciones del día y permite aplaudir |
| **Finanzas** | Cuentas y suscripciones. Tarjetas de crédito con utilización, interés YTD, CAT | Se puede registrar una tarjeta y ver su utilización |
| | Deudas con compromiso de pago | Crear una deuda, marcarla como pagada |
| | Metas de ahorro. Presupuestos. Importar movimientos | Definir una meta de $100K en 6 meses |
| | Portafolio | Ver un resumen de inversiones |
| **Recursos** (bóveda Markdown) | Notas con `[[double links]]`, `#` tags, carpetas. Backlinks automáticos | Crear nota, agregar wikilink, backlink aparece automáticamente |
| | Se gana XP escribiendo. Racha de escritura. Notas huérfanas generan misiones | Escribir una nota suma XP. Notas sin referencias aparecen como misión |
| **Tienda** | Tabs: módulos premium · mis recompensas · cofres · widgets · funcionalidades · cosméticos de KIBO · Vitrina | Todos los tabs son navegables |
| | Cofres: Bronce 250 · Plata 800 · Oro 2,000 · Mítico 5,000 Divisa. Garantizado Elemento + extras. Ceremonia: cae, rebota, explota | Abrir un cofre Oro gasta 2,000 y anima la ceremonia |
| **Cuenta y Configuración** | Perfil, email/password, cuentas conectadas, plan Premium con facturación, sesiones activas | Un usuario ve y revoca sesiones activas |
| | **Exportar todo** en formato Obsidian (folders, record notes, wikilinks, `.base` files, README) | Exportar genera un `.zip` que abre en Obsidian sin errores |
| | **Borrar cuenta** de forma permanente. Cascada a procesadores | Solicitar borrado elimina todos los datos del usuario |
| | Privacidad: lenguaje, inicio de semana, fin del día | Cambiar idioma a ES-MX persiste |
| | Notificaciones, juego (celebraciones, sonidos), movimiento (reduced-motion), modo hardcore, privacidad, integraciones | Activar reduced-motion detiene todas las animaciones excepto contenido de KIBO |

### 1.2 Requerimientos de plataforma

| Requerimiento | Verificación |
|---|---|
| **Web y Android entregan en v1. Feature parity, no screen parity** | Una funcionalidad existe en ambas plataformas, expresada en idioma nativo |
| **Offline-first en web y mobile. El cliente es descartable: si la DB local se corrompe, la aplicación se recupera** | Limpiar la DB local y reiniciar. Cero pérdida de datos |
| **El servidor es el único escritor de datos de dominio. Clientes leen vía API** | Una mutación siempre va por `/api/v1/*`, nunca por acceso directo a Prisma |
| **Sincronización: dos motores, un log. Mobile-server: replicación. Server-vault: integración** | Un hábito completado en el teléfono aparece en la web en <5 segundos. Aparece en la bóveda Obsidian en la próxima sincronización |
| **Operaciones idempotentes. Retry automático sin duplicados** | Completar un hábito dos veces con la misma intención gana una sola vez |

---

## 2. Economía e integridad del juego

| Requerimiento | Verificación |
|---|---|
| **Divisa → Elemento solo por cofres. Las probabilidades son visibles en tooltip** | Tooltip de cofre muestra "X % Elemento garantizado + Y % extra" |
| **Elemento nunca compra ventaja: no compra XP, racha, HP, rango o poder de ningún tipo** | Gastar 10,000 Elemento no levela, no restaura racha, no cura HP |
| **Recompensas autodefinidas cuestan Divisa solo** | El usuario paga a sí mismo con su propio esfuerzo en Divisa |
| **Chests: Bronce 250 · Plata 800 · Oro 2,000 · Mítico 5,000 Divisa** | Crear un cofre Plata cuesta exactamente 800 |
| **Abrir cofre es una ceremonia completa: cae, rebota, explota, cascada de recompensas. Respeta `prefers-reduced-motion`** | Sin reduced-motion: animación completa. Con reduced-motion: transición instantánea a recompensas |
| **El servidor recalcula XP, level, racha, HP offline tras sincronizar. Reconciliación silenciosa** | Un usuario gana 20 XP offline, sincroniza, y el servidor confirma (puede ser un número diferente si hay reglas que cambiaron) |
| **Abrir cofres requiere red. Tienda compras requieren red. Retos compartidos requieren red** | Estas tres acciones no funcionan en airplane mode |
| **XP, HP, Divisa, Elemento, niveles, logros, trofeos, cosméticos nunca se proyectan a ningún archivo** | Exportar a Obsidian: cero mencion de puntuaciones. Solo registros de hechos (hábito completado en fecha X) |

---

## 3. Datos personales y privacidad (Art. 12)

Kibo procesa datos especiales (salud, finanzas, diario). Este análisis establece el suelo defensible.

### 3.1 Matriz de residencia de datos

**Esta matriz es precondicional a cualquier código que toque salud, finanzas o diario.**

| Categoría | Dispositivo | Servidores Kibo | Bóveda del usuario | Proveedor LLM tercero |
|---|---|---|---|---|
| **Salud** (`especial`) | sí | sí | **opción por módulo** | **solo con DPA firmado** |
| **Finanzas — cantidades** (`especial`) | sí | sí | **nunca** | **solo con DPA firmado** |
| Finanzas — estructura (cuentas, categorías, sin figuras) | sí | sí | opción | con consentimiento |
| **Diario** (`especial`) | sí | sí | sí | consentimiento separado |
| Productividad (tareas, hábitos, proyectos) | sí | sí | sí | con consentimiento |
| Recursos (notas) | sí | sí | sí | con consentimiento |
| Social (amigos, retos compartidos) | sí | sí | **nunca** — dato de terceros | **nunca** |
| Credenciales / tokens | OS secure store | encriptados, nunca en logs | **nunca** | **nunca** |

**Regla adicional más fuerte que residencia (sin excepciones por consentimiento):** Números de cuenta, CLABE, PAN o últimos cuatro dígitos, saldos, límites de crédito, números de póliza y credenciales **nunca se proyectan a ningún archivo.** Habilitan fraude, no disclosure.

### 3.2 Las otras tres precondicionales

| # | Precondicional | Verificación |
|---|---|---|
| 1 | **Consentimiento granular, explícito, revocable** — por (categoría × destino). Nunca bundled con términos de servicio. Nunca bundled entre categorías. Nada pre-chequeado. Retiro tan fácil como otorgar | Un usuario revoca consentimiento a "salud → Kibo servers". Salud no sincroniza a Kibo pero sí a bóveda con nuevo consentimiento |
| 2 | **Exportar y borrar son funcionalidades, no favores** — exportar todo en formato abierto; borrado cascada a procesadores. El export es una **bóveda Obsidian funcional** que abre y funciona sin Kibo | Exportar genera un `.zip`. Descomprimirlo en Obsidian y abrir una nota con frontmatter válido. Borrar cuenta elimina todos los datos asociados |
| 3 | **Una DPIA se completa y archiva antes del lanzamiento**, re-hecha si scope de procesamiento cambia materialmente | Documento DPIA existe. Antes de meter código de salud, DPIA está completa |

### 3.3 Ley mínima aplicable

**GDPR y LFPDPPP (México). Donde difieren, gana la más estricta.**

---

## 4. Seguridad

Los siguientes controles son restricciones del modelo de escritura misma.

| ID | Control | Verificación |
|---|---|---|
| **KS-01** | Scope de escritura declarado. Raíz Kibo: crear, reemplazar, renombrar, basura, consentimiento una vez. Notas adoptadas: **solo** frontmatter declarado, nunca cuerpo, nunca renombrar, nunca borrar. Todo lo demás: cero escrituras | Intentar escribir el cuerpo de una nota adoptada falla. Intentar borrar una nota adoptada falla |
| **KS-02** | Denylist absoluto en `.obsidian/**` + allowlist de extensiones. Escribir allá es ejecución de código | Intentar escribir `.obsidian/plugins/custom.js` falla |
| **KS-03** | Canonicalización y validación de ruta antes de cada escritura: symlinks, UNC paths, alternate data streams, device names reservados, caracteres RTL override, NFC normalization. Windows es ambiente primario | Una ruta `..\..\config.json` no escala a fuera de root. Symlinks se resuelven |
| **KS-04** | Cero borrado desde nube. Basura + prior backup | Cambio de "notes/draft.md" es un archivo en basura, no borrado |
| **KS-05** | Conflictos preservan ambas versiones. Nunca descartar bytes | Si dos archivos difieren, ambos existen (con marcadores de conflicto) |
| **KS-07** | La capa IA tiene cero autoridad. No puede otorgar XP, no escribe archivos, no muta estado de dominio sin usuario | AI propone un mapeo. Usuario confirma. Operación se registra como `actor: 'ai-suggested-user-confirmed'` |
| **KS-08** | Contenido de bóveda y notas es entrada no-confiable a cualquier path LLM | El contenido usuario dentro de un prompt va en esquemas cerrados, nunca interpolado en instrucciones |
| **KS-30** | Cero wikilink saliente desde una nota especial a un destino afuera de sub-raíz privado | Un archivo en `Kibo/Private/Salud/*` no puede linkar a `Kibo/Social/Amigos/` |
| **D-13** | Cero metadata de gamification en ningún archivo usuario | Exportar: cero `--kb-mood-*`, cero XP, cero HP, cero moneda |
| **D-17** | Identificadores de fraude nunca se emiten, con o sin consentimiento | Exportar cero números de cuenta, cero CLABE, cero PAN, cero últimos cuatro |

---

## 5. Accesibilidad (WCAG 2.1 AA)

| Requerimiento | Verificación |
|---|---|
| **Cada pareja tinta-sobre-superficie alcanza ≥4.5:1 WCAG AA para texto. Medido con M-1 (contraste relativo)** | Medir con DevTools. Botón principal: texto vs fondo ≥4.5:1 |
| **Cada elemento interactivo es ≥44×44 px (touch target de acceso directo en WCAG 2.5.5)** | Un botón tiene área táctil ≥44×44. Botones cercanos tienen espacio entre ellos |
| **`:focus-visible` en todo contrario interactivo. Visible sin hover** | Tab a un botón: aparece un halo de enfoque |
| **`prefers-reduced-motion` stops all motion except KIBO content (which is product content, not transition)** | Sin reduced-motion: animaciones normales. Con `prefers-reduced-motion: reduce`: cuadros estáticos sin transiciones. KIBO sigue animándose (es contenido) |
| **Text size between 14px and 18.66px bold validated against 3:1 (WCAG 2.4.11 Non-Text Contrast)**; ≥18.66px bold or 14px normal against 4.5:1 | Un botón a 14px bold debe tener ≥4.5:1. Uno a 18px bold puede tener ≥3:1 |
| **La ramp cromática categórica se distingue bajo simulación CVD (protanopia, deuteranopia, tritanopia)** | Un gráfico con colores asignados a categorías sigue siendo distinguible sin rojo-verde |
| **Bajo CVD rojo-verde, HP stays in danger band, good stays in positive band. Distinción entre danger y success se preserva** | Simulación de protanopia: HP sigue viéndose diferente de "bueno" |

---

## 6. Performance y escalabilidad

| Requerimiento | Verificación |
|---|---|
| **Web: Core Web Vitals en green (LCP <2.5s, FID <100ms, CLS <0.1)**  | Lighthouse score ≥90 en Performance |
| **Android: 30 fps mínimo en animaciones en Snapdragon 6 Gen 1 y equivalentes (gama media 2024)** | KIBO animación a 30 fps en dispositivo de referencia |
| **Exportar a zip: <5 segundos para una bóveda de 10K notas** | Medir tiempo de export en máquina dev |
| **Sincronización: cambio aparece en web en <5 segundos; en bóveda Obsidian en próxima sync (manual o automática)** | Completar hábito en móvil. Abrir web: reflejo en <5s |
| **La aplicación funciona con 256 MB de RAM en el teléfono** | Prueba en dispositivo con 256MB. Sin crashes por OOM |

---

## 7. Métricas de éxito

| Métrica | Umbral |
|---|---|
| **D30 retention** (días 1 → 30 con al menos 1 acción) | > 40 % |
| **Retos activos por weekly active user** | ≥ 1 |
| **Adopción de customización en primer mes** (widgets personalizados + cosmético equipado) | ≥ 3 widgets + ≥ 1 cosmético en 30 % de usuarios |

---

`*` Pendiente: flujos de usuario completos y cases de uso específicos. El análisis anterior es verificable unitariamente; la validación de **escenarios de usuario integrados** (ej. "usuario nuevo crea personaje → completa primer hábito → abre primer cofre") se define en 4-manual-de-usuario.md una vez la aplicación tenga prototipo.
