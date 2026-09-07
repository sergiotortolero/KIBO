# Salud — expediente médico

- **Artboard:** `SaludScreen.dc.html`
- **Módulo:** Salud (área Vigor)
- **Origen:** `salud-screen.jsx` líneas 214-377
- **Propósito:** Sección Salud ligada al área Vigor. Su corazón es el EXPEDIENTE MÉDICO: fácil de alimentar, buscable y compartible en solo-lectura con el médico. Los signos vitales llegan de una plataforma externa (sync real solo con la app móvil) y las METAS de salud no se crean aquí: son retos que viven en la sección Retos y aquí solo se miden contra los datos.

## Secciones, de arriba abajo

- Page head — eyebrow 'Vigor · Cuerpo y salud', h1 'Salud.' + InfoDot explicativo, acciones 'Compartir con mi médico' (ghost) y 'Agregar al expediente' (primary) [239-252]
- Banner de sincronización de dispositivos: icono phone, tag 'con la app móvil · próximamente', copy de que en web solo se elige la fuente, y chips de plataforma Apple Health / Google Fit / Samsung Health / Garmin con tooltip de métricas [255-268]
- SectionHead 'Signos vitales y biométricos' con meta 'Vía {plataforma} · hoy 08:14' [271]
- Grid de 6 vitales: FC en reposo 62 ppm, Sueño prom 7.1 h, Pasos hoy 8,240, SpO₂ 98%, Peso 74.2 kg, Presión 118/76 — cada uno con icono, color, valor, unidad, etiqueta y tendencia [272-281]
- SectionHead 'Expediente médico' ('lo crónico va primero') con link 'Compartir' [284-286]
- Toolbar del expediente: caja de búsqueda con placeholder de ejemplos («penicilina», «lípidos», «Dra. Robles») + botón limpiar, y filtros por tipo con conteos: Todos (n), Consulta médica (n), Receta / medicación (n), Estudio / laboratorio (n), Condición / alergia (n), Vacuna (n) [287-300]
- Lista de registros del expediente: tarjeta clickable por registro con icono de tipo, pill de tipo, pill 'Crónica', fecha, título, detalle, médico, adjunto (miniatura de imagen o icono de doc) y ojo de 'ver detalle'; crónicas primero, luego por fecha descendente [301-326]
- SectionHead 'Metas de salud' con meta 'Son retos — se miden solas con tus datos de {plataforma}' y acción 'Gestionar en Retos' [329]
- Grid de metas como reto-cards: pill de tipo (Sueño/Peso/Actividad), 'se mide sola', nombre, kind-strip (Vigor · continua · plataforma), barra de progreso con %, stats Ahora / Meta / +XP; más la card 'Nueva meta de salud' que envía a Retos [330-369]
- Capa de overlays: SaludRecordModal, SaludRecordDetail, ShareExpedienteModal y toast de confirmación [371-374]

## Estados que debe mostrar

- Filled (demo: 4 registros, 3 metas, 6 vitales)
- Empty del expediente — EmptyState icono 'book' 'Sin registros' / 'Agrega consultas, recetas y estudios para tenerlos a la mano.' [302-303]
- Sin coincidencias de búsqueda — EmptyState icono 'search' 'Sin coincidencias' / 'Nada en tu expediente para «{query}».' [303]
- Sincronización de dispositivos NO disponible en web: banner permanente 'próximamente · con la app móvil' (los vitales mostrados son de demo) [255-260]
- Plataforma seleccionada (chip 'on' con check) vs no seleccionada; la elección re-rotula vitales y metas [261-267, 271, 329, 348]
- Registro crónico vs normal (pill 'Crónica' y prioridad de orden) [232, 312]
- Registro con adjunto imagen / adjunto documento / sin adjunto [318-320]
- Toast efímero de confirmación (2.6 s) tras guardar, eliminar, copiar enlace o cambiar de plataforma [225, 374]
- Filtro por tipo activo ('all' o uno de los 5 tipos) [293-299]

## Comportamientos que hay que representar

- Elegir la plataforma que alimenta los datos (Apple Health / Google Fit / Samsung Health / Garmin) → flash '{nombre} será tu fuente de datos' y re-rotula 'Vía X' en vitales y metas [263]
- Buscar en todo el expediente: matchea contra título + detalle + médico + etiqueta del tipo, case-insensitive [228-231]
- Limpiar la búsqueda con el botón X [291]
- Filtrar registros por tipo con conteos vivos [293-299]
- Abrir el detalle de cualquier registro (click en la tarjeta) → SaludRecordDetail [307]
- Agregar un registro al expediente → SaludRecordModal; al guardar se antepone a la lista y dispara toast 'Registro guardado en tu expediente' [248-250, 371]
- Eliminar un registro desde su detalle → toast 'Registro eliminado' [372]
- Compartir el expediente con el médico desde el head o desde el SectionHead → ShareExpedienteModal; al copiar, toast 'Enlace copiado — caduca solo y es de solo lectura' [245-247, 285, 373]
- Orden garantizado: condiciones crónicas primero, después por fecha descendente — para que el médico vea antes lo permanente [232]
- Navegar a Retos para gestionar metas ('Gestionar en Retos') vía evento kibo:navigate {screen:'retos'} + callback onNavigate [234, 329]
- Crear una nueva meta de salud → NO se crea aquí: dispara kibo:navigate {screen:'retos', action:'create'} [235, 364-368]
- Calcular el % de cada meta: normal cur/target; invertido (g.down, p. ej. bajar de peso) con la fórmula 1-(cur-target)/cur [332-334]

## Lee de

- SALUD_SOURCES (plataformas de sincronización)
- SALUD_VITALS (signos vitales / biométricos)
- SALUD_RECORD_TYPES (taxonomía de 5 tipos de registro)
- SALUD_RECORDS_DEMO (expediente)
- SALUD_GOALS_DEMO (metas = retos con XP)
- plataforma seleccionada (estado local)

## Escribe

- records: alta de registro (objeto {id,type,title,date,doctor,detail,chronic,file}) [371]
- records: baja de registro [372]
- platform: fuente de datos elegida [263]
- Evento de shell kibo:navigate {screen:'retos'} [234]
- Evento de shell kibo:navigate {screen:'retos', action:'create'} [235]
- (No escribe XP, ni ledger, ni vitales — los vitales son de solo lectura desde la plataforma)

## Conceptos del núcleo que toca

- fact record (el expediente médico es el registro de hechos de salud)
- identity (datos biométricos del usuario)
- reto (las metas de salud son retos que se miden solos)
- progression engine (XP asociado a cada meta: +120 / +150 / +100)
- shell (navegación por evento kibo:navigate)

## Modales que se dibujan sobre esta pantalla

### Agregar al expediente
- Se abre desde: SaludScreen — botón 'Agregar al expediente' del page head [248-250]
- Propósito: Alta rápida de un registro médico. La promesa explícita es 'con el título basta para guardar — el resto lo puedes completar después; desde la app móvil: una foto y listo'.
- Campos: Tipo de registro — 5 botones tipo chip: Consulta médica, Receta / medicación, Estudio / laboratorio, Condición / alergia, Vacuna (default 'consulta') [74-83] · Título * (autoFocus, placeholder 'p. ej. Chequeo general, Perfil tiroideo, Ibuprofeno 400…') [85-88] · Fecha (input date, default hoy) [89-92] · Médico / institución (texto, 'Dr(a). · clínica / lab') [93-96] · Detalle / indicaciones (textarea, opcional: diagnóstico, indicaciones, dosis, resultados) [97-100] · Condición crónica / permanente (checkbox — solo si tipo = 'condicion'): 'mostrarla primero cuando comparta mi expediente' [101-108] · Adjuntar receta / estudio (input file oculto, accept image/*,.pdf; las imágenes se leen a dataURL con FileReader) [109-123]
- Acciones: Cancelar (ghost, cierra) [67] · Guardar (primary, deshabilitado si el título está vacío; construye {id,type,title,date,doctor,detail,chronic,file} y cierra) [68-71] · Subir foto o PDF [119-121] · Quitar el archivo adjunto (X) [116]
- Estados: Tipo seleccionado (chip 'on' con su color) [78] · Guardar deshabilitado mientras no haya título [68] · Checkbox de crónica visible solo con tipo = condicion; si el tipo no es condicion, chronic se fuerza a false al guardar [101, 69] · Sin archivo (botón 'Subir foto o PDF') / con archivo imagen (miniatura) / con archivo no-imagen (icono de documento) [112-122]
- Origen: `salud-screen.jsx` 49-127

### Detalle de registro del expediente
- Se abre desde: SaludScreen — click en cualquier tarjeta de la lista del expediente [307]
- Propósito: Ver un registro completo — tipo, marca de crónica, detalle, adjunto y metadatos — con el recordatorio de que el médico puede encontrarlo buscando en el expediente.
- Campos: (Solo lectura) Título como encabezado y subtítulo '{tipo} · {fecha} · {médico}' [133] · Tags: tipo del registro y, si aplica, 'Crónica — visible primero para tu médico' [141-144] · Detalle del registro (o placeholder si está vacío) [145] · Adjunto: miniatura de imagen o icono de documento con nombre de archivo [146-151] · Metadatos: fecha, médico, y la nota 'Tu médico puede encontrar este registro al buscar en tu expediente' [152-156]
- Acciones: Eliminar (ghost — borra el registro y cierra) [136] · Cerrar (primary) [137]
- Estados: Con detalle vs sin detalle ('Sin detalle todavía — agrégalo cuando lo tengas a la mano.') [145] · Con adjunto imagen / adjunto documento / sin adjunto [146-151] · Registro crónico (tag adicional) vs normal [143] · Sin médico → la línea de médico no se pinta [154]
- Origen: `salud-screen.jsx` 130-160

### Comparte tu expediente con tu médico
- Se abre desde: SaludScreen — botón 'Compartir con mi médico' del page head [245-247], SaludScreen — link 'Compartir' del SectionHead del expediente [285]
- Propósito: Generar un acceso de solo lectura con caducidad para que el médico BUSQUE en el expediente (condiciones crónicas, alergias, medicación) en vez de depender de la memoria del paciente en consulta.
- Campos: Qué incluye el acceso — checkbox por tipo con el conteo de registros de ese tipo; defaults: condicion, receta, estudio y vacuna encendidos, consulta apagado [164, 180-189] · Nota fija: las condiciones crónicas y alergias se muestran PRIMERO [190] · El acceso caduca en — 24 horas / 7 días (default) / 30 días [192-199] · Enlace de solo lectura — código fijo 'kibo.health/exp/MTO-4K2F' [167, 200-209]
- Acciones: Cerrar (ghost) [172] · Copiar enlace (primary del footer — dispara onCopied y cierra) [173-175] · Copiar (botón inline junto al enlace — dispara onCopied sin cerrar) [205-207]
- Estados: Cada tipo incluido / excluido (clase 'on') [182] · Caducidad seleccionada de las tres opciones [196] · Tras copiar, la pantalla muestra el toast 'Enlace copiado — caduca solo y es de solo lectura' [373]
- Origen: `salud-screen.jsx` 163-212
