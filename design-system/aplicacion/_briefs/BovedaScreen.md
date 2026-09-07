# Bóveda — el archivo de tu vida en Markdown plano

- **Artboard:** `BovedaScreen.dc.html`
- **Módulo:** Recursos
- **Origen:** `recursos-screen.jsx` líneas 104-276 (registro window 278)
- **Propósito:** Explorador del archivo .md que Kibo escribe solo por cada acción registrada en cualquier módulo: carpetas espejo de los módulos, frontmatter, tags, [[enlaces]] y backlinks, sincronizado con Drive/OneDrive/carpeta local. Ruta del shell: case 'resources' en dashboard-v2.jsx:1611-1613.

## Secciones, de arriba abajo

- kbv-page-head: eyebrow crumb('resources','Tu archivo de vida') + h1 «Bóveda.» + InfoDot + botón «Nueva nota» (125-134)
- kbv-obsidian-strip: estado de sincronización con destino y ruta, cuántas notas escribió Kibo, y acciones «Cambiar destino» / sincronizar ahora (137-147)
- kbv-social-band: 4 celdas de pulso — archivos .md, escritos por Kibo, carpetas (una por módulo), última sincronización (150-171)
- Tarjeta «Estructura»: segmentos de carpeta con contador (Todas + las 7 carpetas) y caja de búsqueda con limpiar (174-190)
- kbv-vault a dos paneles: lista de notas (icono de carpeta, título.md, pin de favorita, carpeta·fecha·palabras, marca 'auto' o nº de enlaces) y visor de la nota (212-242)
- Visor: cabecera con tags y marca «escrita por Kibo», bloque de frontmatter entre --- , cuerpo renderizado por NoteBody, y pie de Backlinks (213-241)
- Modal de destino de sincronización (246-271)
- Toast flotante (273)

## Estados que debe mostrar

- Nota seleccionada por defecto 'n1'; si el id no existe cae a la primera (114)
- Filtro de carpeta 'todas' o una de las 7
- Búsqueda por título, tags o carpeta; lista vacía → EmptyState «Nada por aquí» (194)
- Sin backlinks → mensaje «Nadie enlaza aquí todavía…» (233)
- syncOpen → modal abierto
- toast visible 2.6 s (112)
- Wikilink deshabilitado si la nota destino no existe (95-96)

## Comportamientos que hay que representar

- Crear nota: abre el prompt de texto y lanza el toast ««X.md» creada · +15 XP a Sabiduría» (131)
- Cambiar de carpeta y buscar/limpiar
- Seleccionar una nota de la lista
- Saltar por [[enlace]] dentro del cuerpo (onJump=setSel, 229)
- Saltar por backlink (236)
- «Cambiar destino» abre el modal; el botón de subir lanza «Sincronizando… 6 archivos al día» (144-145)

## Lee de

- VAULT_NOTES (27-52) con frontmatter, tags, links, auto y cuerpo Markdown
- VAULT_FOLDERS (17-25): Hábitos, Retos, Diario, Finanzas, Lectura, Estudio, Notas — con patrón de nombre de archivo y bandera auto
- VAULT_DEST (10-14): Google Drive, OneDrive, carpeta local

## Escribe

- Nada al bus ni a almacenamiento; el prototipo solo muestra toasts. La creación de nota se anuncia como +15 XP a Sabiduría (131)

## Conceptos del núcleo que toca

- fact record (una nota .md por acción registrada)
- habit
- reto
- economy/ledger (resumen mensual de finanzas)
- progression engine (+15 XP)
- identity
- shell
- KIBO (Kibo escribe las notas)

## Modales que se dibujan sobre esta pantalla

### Nueva nota
- Se abre desde: BovedaScreen → botón «Nueva nota» de la cabecera (recursos-screen.jsx:130-133)
- Propósito: Crear un archivo .md en la carpeta que elijas dentro de la Bóveda.
- Campos: Título (texto) — placeholder «p. ej. Retro del sprint, Ideas del capítulo 4…»
- Acciones: Crear (confirmLabel='Crear') → toast ««X.md» creada · +15 XP a Sabiduría» · Cancelar/cerrar
- Estados: Abierto/cerrado; el resultado solo produce un toast (no crea la nota en VAULT_NOTES)
- Origen: `recursos-screen.jsx` 131 (componente en kbv-shared.jsx:459-464)

### ¿Dónde vive tu bóveda? (KBVModal inline, size md)
- Se abre desde: BovedaScreen → botón «Cambiar destino» de la tira de sincronización (recursos-screen.jsx:144)
- Propósito: Elegir el destino de sincronización de la carpeta Markdown y explicar el contrato: Kibo escribe por ti, una carpeta por módulo, Obsidian la abre tal cual.
- Campos: Lista de destinos como SettingRow: Google Drive (Kibo/Bóveda), OneDrive (Documentos/Kibo), Carpeta local (~/Kibo/Bóveda) (255-264) · Bloque explicativo de 3 pasos numerados (265-269)
- Acciones: Elegir un destino (marca «Elegida») · Después → cierra sin vincular · Vincular carpeta → cierra y lanza toast «Bóveda vinculada a X · sincronizando…» (251)
- Estados: Destino seleccionado = pill «Elegida»; el resto muestra «Elegir» · Destino por defecto 'drive' (109)
- Origen: `recursos-screen.jsx` 246-271
