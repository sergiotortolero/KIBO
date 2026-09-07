# Kibo — Personal OS

Un sistema de gestión de vida gamificado: la plataforma que transforma tareas, hábitos, finanzas y salud en una aventura.

**Para quién es:** Cualquiera que quiera entender qué es Kibo y para quién se construye. No requiere conocimiento técnico.
**Versión:** 1.0-alpha

## Registro de modificaciones

| Versión | Fecha | Editó | Qué cambió | Por qué |
|---|---|---|---|---|
| 1.0-alpha | 2026-09-06 | technical-writer | Primera versión del resumen ejecutivo | El portafolio documenta cada solución en cinco documentos numerados |

## Contenido

- [1. Qué es Kibo](#1-qué-es-kibo)
- [2. El problema que resuelve](#2-el-problema-que-resuelve)
- [3. Cómo funciona](#3-cómo-funciona)
- [4. La economía del juego](#4-la-economía-del-juego)
- [5. Los 14 módulos](#5-los-14-módulos)
- [6. Éxito](#6-éxito)

---

## 1. Qué es Kibo

Kibo es un sistema de gestión de vida. En el mismo espacio conviven hábitos, tareas, proyectos, finanzas, salud, lectura, diario y notas — todo bajo un único login, accesible desde el teléfono (Android), la web y una bóveda Obsidian que sincroniza automáticamente.

La singularidad: **toda la gestión está envuelta en mecánicas de juego RPG.** El usuario crea un personaje, ve cómo suben cinco áreas de la vida (Vigor, Sabiduría, Riqueza, Comunidad, Voluntad), mantiene rachas, enfrenta jefes que ponen en riesgo sus puntos de vida, y gasta moneda y experiencia en recompensas autodefinidas, cosméticos y capacidades especiales.

**Plataformas en v1:** Android (Expo/React Native), web (Next.js), y bóveda de Markdown (exportada automáticamente a Obsidian).

## 2. El problema que resuelve

Notion, Obsidian y Todoist tienen el modelo de datos correcto pero generan una retención frágil. El usuario entra, captura, se olvida. Kibo agrega la capa de UX/UI gamificada que genera hábito: identidad (el personaje), pérdida potencial (puntos de vida y rachas), recompensas variables (cofres), presión social suave (círculo de amigos) y expresión (cosméticos, vitrina).

El resultado: no es un gestor más. Es la razón para volver.

## 3. Cómo funciona

El usuario entra a Kibo y ve un **cuadro de mando personalizable** con widgets de sus módulos activos. En el centro está **KIBO** — un ente gelatinoso que respira, parpadea, juega, y expresa su estado emocional a través de su cara (ojos, pupilas, boca). KIBO cambia de expresión según la salud del usuario: más feliz cuando va bien, triste o sorprendido cuando falla.

Cada acción en Kibo alimenta el juego:
- **Completar un hábito** gana Divisa y experiencia, y sube la racha.
- **Fallar un reto** cuesta puntos de vida, pero si el usuario es consistente los recupera.
- **Escribir en el diario** suma experiencia a Sabiduría.
- **Abrir un cofre** es una ceremonia completa: cae, rebota, explota en recompensas.

Todo sincroniza automáticamente. El teléfono trabaja sin conexión y se sincroniza cuando hay señal. Si el usuario vincula su bóveda Obsidian, Kibo proyecta sus datos como notas de Markdown — hechos y relaciones que Obsidian puede consultar, todo sin perder el control de su información.

## 4. La economía del juego

Dos monedas. **El nombre es la unidad; la piel es solo la apariencia** — las pieles nunca compiten con el nombre de la categoría.

| Moneda | Se gana por | Se gasta en | Cómo se ve |
|---|---|---|---|
| **Divisa** — la cotidiana | Hábitos, tareas, retos completados | Recompensas personales, cofres, cosméticos base | Moneda de oro |
| **Elemento** — la rara | Cofres, retos difíciles, cuota Premium, **o dinero real** | Funcionalidades, cosméticos premium, protectores | Gota facetada |
| **Experiencia (XP)** | Toda acción productiva | No se gasta. Sube el nivel global y por área | — |
| **Puntos de vida (HP)** | Se pierden en retos/hábitos fallidos | Se recuperan por consistencia | Corazón |

**La regla fundamental: Elemento nunca compra ventaja.** No compra experiencia, no compra racha, no compra puntos de vida, no compra rango ni poder de ningún tipo. Solo compra cosméticos y acceso a funcionalidades. Esto es lo que hace seguro que el dinero real sea una forma de conseguir Elemento.

## 5. Los 14 módulos

El alcance completo que Kibo puede entregar. La lista de v1 se decide en el backlog.

| # | Módulo | Qué hace |
|---|---|---|
| 1 | **Hoy** | Cuadro de mando personalizable. Widgets gratis y premium. Galerías. Racha global siempre visible |
| 2 | **KIBO** | El gel animado que es la identidad de marca. Respira, parpadea, juega. Su expresión cambia según la salud |
| 3 | **Hábitos** | Esfuerzo (1–5), prioridad, periodicidad. Recompensa = prioridad × esfuerzo. Rachas, protectores, niveles |
| 4 | **Retos** (jefes) | Compromiso con fecha límite, dificultad 1–5. Fallar cuesta HP. 20 % de fallos tolerados. Solo o con amigos |
| 5 | **Tareas y Proyectos** | Kanban, subtareas, fechas, esfuerzo, prioridad. Línea de tiempo escalable (1 semana a 12 meses) |
| 6 | **Áreas** | Cinco ejes de vida. Cada una acumula XP y muestra rangos militares (20 tiers × 9 materiales) |
| 7 | **Logros y Personaje** | Galería de trofeos mensuales, banners de retos, catálogo (públicos, secretos, escondidos; 4 raridades) |
| 8 | **Vitrina** | Lo que la comunidad ve: perfil, foto, título honorífico, lema, logros destacados, KIBO companion |
| 9 | **Amigos** | Sin transferencias de dinero. Regalos de ítems. Contribuciones a listas de deseos. Rachas. Retos compartidos |
| 10 | **Finanzas** | Cuentas, tarjetas de crédito, deudas, metas de ahorro, presupuestos, importar movimientos, portafolio |
| 11 | **Salud, Estudio, Lectura, Entretenimiento, Diario** | Signos vitales, workouts, registros médicos. Cursos con rúbricas. Libros con sesiones de lectura. Películas/series. Entradas con ánimo |
| 12 | **Recursos** | Notas de Markdown con `[[double links]]`, tags, carpetas. Se gana XP escribiendo. Notas huérfanas generan misiones |
| 13 | **Tienda** | Módulos premium · mis recompensas · cofres · widgets · funcionalidades · cosméticos de KIBO · Vitrina |
| 14 | **Cuenta y Configuración** | Perfil, contraseña, cuentas conectadas. Premium con facturación. **Exportar todo. Borrar cuenta.** Configuración, privacidad, integraciones |

## 6. Éxito

Kibo gana si:
- Más del 40 % de usuarios vuelven después de 30 días (retención D30). El driver: racha + círculo.
- Al menos 1 reto activo por usuario semanal activo.
- Al menos 3 widgets personalizados y 1 cosmético equipado en el primer mes. La expresión = retención.

---

## Glosario

| Término | Qué es |
|---|---|
| **Áreas** | Los cinco ejes de vida: Vigor, Sabiduría, Riqueza, Comunidad, Voluntad |
| **Cofre** | Recompensa aleatoria ganada por dinero en juego. La ceremonia: cae, rebota, explota |
| **Divisa** | Moneda cotidiana. Se gana por hábitos y tareas. Se gasta en recompensas personales |
| **Elemento** | Moneda rara. Se gana en cofres o dinero real. Se gasta en cosméticos y funcionalidades |
| **Gamificación** | Mecánicas de RPG (XP, HP, niveles, retos, cosméticos) envueltas alrededor de la gestión de vida |
| **KIBO** | La mascota animada. Es la identidad de marca. Su expresión refuerza la retroalimentación del usuario |
| **Racha** | Contador de días consecutivos cumpliendo un hábito o reto. Se pierde con un fallo |
| **Reto** | Un compromiso a plazo fijo con dificultad variable. Fallar cuesta HP. Solo o con amigos |
| **RPG** | Role-Playing Game — un juego donde el jugador controla un personaje que sube de nivel |

---

`*` Pendiente: capturas de pantalla de la experiencia del usuario. Este documento se entrega sin ellas porque Kibo no tiene aún un producto en funcionamiento que fotografiar.
