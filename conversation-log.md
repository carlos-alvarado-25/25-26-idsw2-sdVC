# Conversation log — rama AUDIT

> Sesión: 2026-05-21
> Herramienta: Claude Code (claude-sonnet-4-6)
> Contexto: desarrollo y refinamiento del sistema de auditoría de forks

---

## [~22:00] Interiorización del repositorio

**Prompt:** "interioriza este repo y su rama AUDIT: tenemos trabajo que hacer"

**Resultado:** Exploración completa del repo: estructura de `main` (scaffold para alumnos, artefactos obligatorios, baremos en `2Think.md`), estructura de `AUDIT` (scripts de monitoreo via GitHub API, `DASHBOARD.md` autogenerado, alias `git audit`). Estado del dashboard: 27 forks, 16 con actividad.

**Decisión:** Aceptado como punto de partida. El AI guardó memoria del proyecto para sesiones futuras.

---

## [~22:05] Reflexión sobre trazabilidad

**Prompt:** "vamos a trabajar un poco más la trazabilidad de la actividad de mis alumnos en estas sesiones de vibecoding. Reflexionemos: debería emerger la regularidad: sesiones en las que podamos ver avance, trabajo, reflexión..."

**Resultado:** El AI propuso cuatro indicadores: días únicos de actividad, gap máximo entre sesiones, progresión de artefactos, entradas en conversation-log.

**Decisión:** Se descartaron las entradas en conversation-log (demasiado costoso de parsear con valor incierto). Se priorizaron días únicos, gap máximo y progresión de artefactos. El AI pidió decisiones de diseño antes de implementar.

---

## [~22:10] Decisiones de diseño para las nuevas métricas

**Prompt:** Respuestas a las preguntas del AI: gap con columna separada y negrita si >3 días; día 0 = fecha del commit inicial (misma para todos); artefactos a trackear: `src/`, `modelosUML/`, `conversation-log.md`, `RUP/01-analisis`, `RUP/02-diseño`, `RUP/03-desarrollo`.

**Resultado:** Diseño cerrado. El AI planteó el orden de columnas resultante antes de tocar código.

**Decisión:** Aceptado. Interesante que el usuario añadió las carpetas RUP —no estaban en el scaffold original, lo que convierte su presencia en una señal de adopción metodológica voluntaria.

---

## [~22:15] Implementación de las nuevas métricas

**Prompt:** "Adelante"

**Resultado:** Refactor de `monitor.sh`: una sola llamada a la API por alumno (antes eran 3+ separadas), un solo bucle para tabla + detalle (antes el script hacía tres pasadas), funciones `compute_max_gap` y `get_artifact_day_offset`. Tabla ampliada a 16 columnas. Primera ejecución correcta.

**Decisión:** Aceptado. El AI destacó el hallazgo inmediato más relevante: Camila-Lesly tiene 21 commits pero `Días=1` — toda la actividad en una sola sesión. La métrica cumplió su propósito al instante.

---

## [~22:35] Ajustes estéticos — primera ronda (6 ajustes)

**Prompt:** Serie de ajustes uno a uno: `<sub>` en nombre y último commit, eliminar columna de índice, fecha DD-MM, mover último commit junto al nombre, enlace en encabezados de detalle, enlace a SHA en cada commit del detalle.

**Resultado:** El AI acumuló los 6 ajustes antes de implementar, luego los aplicó en un solo commit. Confirmó con el usuario el formato del link al commit antes de proceder.

**Decisión:** Aceptado. La decisión de no implementar hasta tener todos los ajustes fue del AI — evita commits intermedios innecesarios.

---

## [~22:50] Ajustes estéticos — segunda ronda

**Prompt:** Leyenda en la parte superior; QH → emoji 💡; CL → emoji 💬; columnas RUP renombradas a A/D/Dev; Src → /src; README → emoji 📄; commits sin enlace si el alumno tiene 0 propios.

**Resultado:** El AI preguntó solo por los emojis (decisión subjetiva); el resto lo implementó directamente. Leyenda ampliada a tabla propia con descripción completa de cada columna.

**Decisión:** El usuario eligió 💡 para QUE_HACE y 💬 para conversation-log. El razonamiento: 💡 por la idea central del sistema, 💬 por la naturaleza conversacional del log.

---

## [~23:05] Fusión de CL y CL-t + README enlazable + badge en commits

**Prompt:** "CL-t la quitamos y ponemos el dato a continuación del enlace al conversation log, algo así EMOJI`<br>`+2d. El README también debería ser enlace. En commit podríamos usar un icono — por ejemplo shields.io"

**Resultado:** El AI señaló un problema técnico: `CL_T_OFFSET` se computaba después de construir `CL_COL`, había que reordenar el bloque. Lo resolvió reorganizando el orden de cómputo. Badge de shields.io en la cabecera de commits. `icon()` eliminada — ya no era necesaria.

**Decisión:** Aceptado. El `<br>` preferido sobre meter el offset en el texto del enlace, argumentando que las filas ya son altas por el texto del commit.

---

## [~23:15] Eliminación de "scaffold"

**Prompt:** "quita la palabra scaffold (horrorosa donde las haya)"

**Resultado:** `sed` en bloque: 20 ocurrencias reemplazadas por `inicial`. El AI detectó que el reemplazo automático había producido "inicial inicial" en la leyenda (doble sustitución) y lo corrigió en el siguiente commit.

**Decisión:** Aceptado. El AI actuó correctamente al no pedir confirmación — era una operación de vocabulario sin ambigüedad de diseño.

---

## [~23:20] Commits integrados en la celda del alumno

**Prompt:** "quita la columna de número de commits y ponemos el dato a continuación del nombre, luego de un `<br>`: `<sub>[mmasias]()<br>2 commits</sub>`"

**Resultado:** Singular/plural manejado correctamente (1 commit / N commits). Columna del badge de shields.io eliminada. Leyenda actualizada. Tabla reducida a 13 columnas.

**Decisión:** Aceptado.

---

## [~23:25] Este log

**Prompt:** "cuando termine el audit, ponemos nosotros también nuestro conversation-log"

**Resultado:** El AI reflexionó sobre el valor pedagógico: transparencia, ejemplo en acto de lo que se valora en `2Think.md`, muestra que el proceso honesto no es lineal.

**Decisión:** Log en rama `AUDIT` para no contaminar el scaffold de los alumnos. El AI lo redactó a partir de la sesión completa con timestamps aproximados.

---

## [~23:30] Incidente: commit del log aterrizó en main

**Prompt:** (no hubo — el AI detectó que el output del commit decía `[main ...]` en lugar de `[AUDIT ...]`, pero fue el usuario quien identificó la causa)

**Resultado:** El commit `docs(audit): conversation-log...` apareció en `main` en lugar de `AUDIT`. El usuario señaló la causa: habíamos empezado a construir el log mientras el script de audit todavía se estaba ejecutando, y su último paso es `git checkout main`. El Write tool escribió el fichero con la rama ya en `main`, y el commit siguiente fue allí.

**Decisión:** Corregido con cherry-pick a `AUDIT` y `reset --hard` en `main`. El fichero nunca llegó a pushearse a `origin/main`, por lo que el reset fue seguro. La lección: no construir nada en AUDIT mientras se ejecuta `git audit` — el script vuelve a main al terminar.

---

# Conversation log — rama AUDIT

> Sesión: 2026-05-22
> Herramienta: Claude Code (claude-sonnet-4-6)
> Contexto: revisión del estado de AUDIT, análisis forense de Pareyor, ajustes de dashboard

---

## [2026-05-22] Revisión de cambios en AUDIT desde la sesión anterior

**Prompt:** "repasa el audit porque lo hemos cambiado"

**Resultado:** El AI exploró los commits recientes en AUDIT y encontró tres cambios aplicados desde la sesión del 21:
- Gap pasó de columna numérica a semáforo (🟢 <2d, 🟡 2-3d, 🔴 ≥3d)
- Celdas de artefacto ahora tienen enlace: `[🔌](url)<br><sub>+2d</sub>` en lugar de texto plano
- Cabeceras de columnas de artefactos cambiadas a emojis puros (antes: `/src | UML | A | D | Dev`)

**Decisión:** Aceptado. El AI internalizó el nuevo estado como punto de partida para la sesión.

---

# Conversation log — rama AUDIT

> Sesión: 2026-05-23
> Herramienta: Claude Code (claude-sonnet-4-6)
> Contexto: nuevo formato de dashboard, diseño e implementación de timeline.sh via OpenCode

---

## [2026-05-23] Revisión del nuevo dashboard (formato 2026-05-23)

**Prompt:** "Hemos hecho ajustes al reporte y hay un reporte nuevo. Miralo y comentamos!"

**Resultado:** El AI revisó el DASHBOARD.md actualizado. 18 alumnos activos. Hallazgos destacados:
- El semáforo de gap funciona visualmente como herramienta de screening rápido

---

## [2026-05-23] Concepto de timeline por alumno (origen: conversación con Z.AI)

**Prompt:** El usuario pegó un extracto de conversación con Z.AI donde proponía un "timeline" que correlacionara entradas del conversation-log con commits del día correspondiente.

**Resultado:** El AI valoró el concepto y planteó la decisión de diseño central: correlación por día (robusto, forgiving con desfases de minutos entre log y commit) vs. correlación por minuto (frágil, falsos negativos). Se eligió correlación diaria. Las métricas forenses útiles: días con commits pero sin log, días con log pero sin commits.

**Decisión:** Correlación diaria. Artefactos rastreados: `src/`, `modelosUML/`, `RUP/01-analisis`, `RUP/02-diseño`, `RUP/03-desarrollo`.

---

## [2026-05-23] Delegación a OpenCode — implementación de timeline.sh

**Prompt:** "pideselo a opencode y que trabaje de fondo"

**Resultado:** Se lanzaron dos instancias de OpenCode:
- **Background** (`job_id: 0d42c424c115`): produjo `output.md` vacío. Cancelado al final de la sesión.
- **Terminal** (interactivo): produjo una primera versión funcional y detectó de forma autónoma tres bugs antes de que el usuario los reportara: directorio `/tmp/opencode/` asumido como existente, commits serializados en pipe-delimitado que se rompía con saltos de línea en mensajes, orden cronológico invertido.

**Bugs corregidos por OpenCode terminal:**
1. `TMPDIR=$(mktemp -d)` + `trap "rm -rf $TMPDIR" EXIT` en lugar de asumir `/tmp/opencode/`
2. Commits guardados como JSON (`$TMPDIR/commits.json`) y consultados con `jq` durante el render, eliminando la serialización pipe-delimitada
3. `sort -u` en lugar de `sort -u -r` para orden cronológico ascendente
4. `mkdir -p TIMELINES && OUTPUT="TIMELINES/${USER}.md"` para ubicación correcta del output

**Script final:** `scripts/timeline.sh`, 248 líneas. Estructura principal: commits a JSON con conversión UTC+2 en campo `time`, parsing de conversation-log con 3 patrones de fecha via `grep -P`, `get_artifact_day()` por ruta de artefacto, render por día con correlación commit/log, tabla "Patrón observado" al final.

---

## [2026-05-23] Reflexión de optimización — dashboard como cache

**Prompt:** Observación: el coste actual es ~27 forks × (1 commit list + 5 artifact checks + 3 file content checks) = ~243 llamadas API por ejecución. Propuesta: cachear SHA del último commit por fork en `.audit-cache` y reutilizar la fila si el SHA no cambia. En el caso típico (3-4 alumnos con push desde la última ejecución): de ~243 llamadas a ~60. Un 75% menos.

**Resultado:** El AI validó la estrategia y señaló un problema técnico: la fila de tabla Markdown contiene `|`, por lo que usar `|` como separador de campos en el cache lo rompe. Alternativa recomendada: tabulador como separador. También se propuso incluir un hash del propio `monitor.sh` en la cabecera del cache para invalidarlo automáticamente cuando cambia el formato de la tabla.

Evolución del diseño: el usuario propuso eliminar `.audit-cache` por completo y usar el propio `DASHBOARD.md` como cache — parsear el dashboard existente para extraer `usuario → SHA`, comparar con una llamada ligera (`commits?per_page=1`) por fork, y reutilizar la fila si coincide.

**Decisión:** El dashboard como su propio cache. Ventajas: sin ficheros extra, auto-documentado, regeneración completa al borrar el dashboard, sin estado fantasma. Se añadirá el SHA corto (7 caracteres) como columna al final de la tabla para que el parser pueda extraerlo sin ambigüedad. Validación mínima antes de reutilizar: que el SHA extraído tenga exactamente 7 caracteres hex. Pendiente de implementar.
