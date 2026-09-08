# Reconstrucción por segmentos

64 pantallas de producto sobre el armazón. Se construyen en segmentos pequeños,
ordenados por lo que el producto necesita primero, no por el archivo del que salen.
Cada segmento cierra con validación y commit: un corte cuesta un segmento, no la corrida.

Cada pantalla se compone llenando el hueco de su andamio. El andamio se genera
mecánicamente desde el armazón, así que un agente interrumpido deja un artboard
válido con el hueco vacío, nunca un archivo roto.

| # | Segmento | Pantallas | Por qué va aquí |
|---|---|---|---|
| 1 | **Lazo diario · captura y hábitos** | 12 | Es lo que se usa todos los días. Hecho salvo Retos |
| 2 | **Tareas y Proyectos** | 4 | La otra mitad del lazo diario. El proyecto agrupa; la tarea produce |
| 3 | **Progreso y personaje** | 3 | Lo que convierte la gestión en juego: rango, prestigio, logros |
| 4 | **Áreas** | 6 | El eje que cruza todo hecho. No es un módulo: es una vista |
| 5 | **Economía y tienda** | 4 | Divisa y Elemento, guardarropa y vitrina |
| 6 | **Personalización** | 4 | Lo que el jugador cambia de su propia interfaz |
| 7 | **Acceso y alta** | 5 | Primera impresión: entrada, alta y los tres pasos de identidad |
| 8 | **Bitácora ligera** | 4 | Diario, lectura y la bóveda de Markdown |
| 9 | **Finanzas** | 9 | El módulo más grande; se parte en dos si hace falta |
| 10 | **Salud** | 1 | Expediente médico |
| 11 | **Estudio** | 8 | Centro académico con sus pestañas y detalles |
| 12 | **Social y cuenta** | 4 | Círculo, familia, cuenta y configuración |

## Segmento 1 · Lazo diario — captura y hábitos
`TodayDashboard` · `DashboardScreenV2` · `HabitsScreen` · `RetosScreen` · `TaskDetailScreen`
`KiboQuickWheel` · `KiboChat` · `TutorialOverlay` · `ModuleLocked` · `ComingSoon`
`EntretenimientoScreen` · `ShowDetail`

## Segmento 2 · Tareas y Proyectos
`TareasScreen` · `ProjectsScreen` · `ProjectDetail` · `ProjectConfig`

## Segmento 3 · Progreso y personaje
`CharacterScreen` · `ProgressPanel` · `AchievementsPanel`

## Segmento 4 · Áreas
`AreasScreenV3` · `AreasGeneralV3` · `AreaDetailV3` · `AreaProjectsV3` · `AreaWillTab` · `AreaConfigV3`

## Segmento 5 · Economía y tienda
`StoreScreen` · `WishlistTab` · `KiboStyleTab` · `VitrinaStoreTab`

## Segmento 6 · Personalización
`PersonalizacionScreen` · `PersPrestigio` · `PersDivisas` · `PersInterfaz`

## Segmento 7 · Acceso y alta
`LoginScreenV2` · `RegisterScreenV2` · `WelcomeScreenV2` · `IdentityScreenV2` · `IntentScreenV2`

## Segmento 8 · Bitácora ligera
`DiarioScreen` · `LecturaScreen` · `BookDetail` · `BovedaScreen`

## Segmento 9 · Finanzas
`FinanzasScreen` · `OverviewTab` · `AccountsTab` · `CreditsTab` · `SavingsTab` · `ImportTab`
`AccountDetailScreen` · `CreditDetailScreen` · `ProjectDetailScreen`

## Segmento 10 · Salud
`SaludScreen`

## Segmento 11 · Estudio
`EstudioScreenV2` · `EstudioFoco` · `EstudioCursos` · `EstudioEscuelaV2` · `SubjectDetail`
`EstudioAgendaV2` · `EstudioTrayectoriaV2` · `CourseDetail`

## Segmento 12 · Social y cuenta
`SocialScreen` · `FamiliaScreen` · `CuentaScreen` · `ConfigScreen`
