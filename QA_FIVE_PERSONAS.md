# QA opcional con cinco usuarios simulados

Cuando un orquestador defina un plan de pruebas de este repositorio, debe preguntar una vez por ese alcance: **«¿Querés sumar una ronda de cinco usuarios simulados en navegador real, con capturas de los bloqueos, además de las pruebas habituales?»** No lanzar agentes por defecto. La respuesta aplica al alcance acordado; no repetir la pregunta si ya fue contestada. Seguir con los tests habituales mientras se espera si son independientes.

Si se acepta, leer `/home/bautista/.config/ai-agents/QA_FIVE_PERSONAS.md` y la política global `ROUTING.md`. Elegir únicamente modelos permitidos; el ejemplo viral con Opus no modifica esa selección.

Personas: impaciente; escéptico que revisa precio, términos y privacidad; móvil de 375 px con red lenta verificada; persona que interpreta literalmente la UI y no domina su idioma principal; usuario que prueba entradas inválidas, Atrás y doble clic.

Definir primer éxito y entorno seguro antes de empezar. Cada persona usa un contexto de navegador aislado, documenta pasos y captura las confusiones. Consolidar problemas con frecuencia sobre cinco, gravedad y evidencia; corregir dentro del alcance autorizado y repetir los cinco recorridos. Informar cualquier ejecución bloqueada o simulación de red no disponible. No reemplaza usuarios reales, tests unitarios, integración o E2E. No usar pagos, correo, scraping o datos de producción para probar sin autorización específica.
