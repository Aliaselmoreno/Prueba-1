# Flujo Make: Retell AI → Telegram (evento `call_ended`)

Automatización en **Make (Integromat)** que recibe el webhook de **Retell AI** cuando
una llamada termina (`call_ended`) y envía la **transcripción completa** y los datos
básicos de la llamada a un chat de **Telegram**.

```
Retell AI ──(POST call_ended)──► Make (Custom Webhook) ──► Webhook Response 200 ──► Filtro event=call_ended ──► Telegram (Send a Message)
```

> **Requisito HTTP de Retell:** el webhook es un `POST` y **el endpoint debe responder
> `HTTP 200` de inmediato**. Si no responde 200 (o tarda demasiado porque primero
> ejecuta Telegram), Retell da el webhook por fallido y reintenta → "no funciona".
> Por eso el flujo incluye un módulo **Webhook Response (200)** justo después de
> recibir el evento, para acusar recibo a Retell al instante y enviar el mensaje a
> Telegram después.

## Contenido

- `retell-to-telegram.blueprint.json` — Blueprint importable en Make.

---

## 1. Requisitos previos

1. **Cuenta de Make** (la zona del blueprint es `eu2.make.com`; si tu cuenta está en
   otra zona —`us1`, `us2`, `eu1`…— Make lo ajusta solo al importar).
2. **Bot de Telegram**: créalo con [@BotFather](https://t.me/BotFather) → `/newbot` y
   guarda el **token**.
3. **Chat ID** de destino (dónde llegarán los mensajes):
   - Chat personal: escribe algo a tu bot y luego abre
     `https://api.telegram.org/bot<TOKEN>/getUpdates` → busca `chat.id`.
   - Grupo: añade el bot al grupo, envía un mensaje y usa `getUpdates` (los grupos
     tienen ID negativo, p. ej. `-1001234567890`).
4. **Cuenta de Retell AI** con un agente configurado.

---

## 2. Importar el blueprint en Make

1. Make → **Scenarios** → **Create a new scenario**.
2. Menú `···` (abajo o arriba a la derecha) → **Import Blueprint**.
3. Sube `retell-to-telegram.blueprint.json`.
4. Verás tres módulos: **Custom webhook**, **Webhook response (200)** y
   **Telegram → Send a Text Message or Reply**.

---

## 3. Configurar el módulo Telegram

1. Haz clic en el módulo **Telegram**.
2. En **Connection** → **Add**, pega el **token** de tu bot y guarda.
3. Sustituye `PON_AQUI_TU_CHAT_ID` en el campo **Chat ID** por tu chat ID real.
4. Deja **Parse mode** vacío (texto plano). Ver nota sobre formato más abajo.

---

## 4. Obtener la URL del webhook y darla de alta en Retell AI

1. Haz clic en el módulo **Custom webhook** → **Add** → dale un nombre
   (p. ej. `Retell AI Webhook`) → **Save**.
2. Copia la **URL** que genera Make (algo como
   `https://hook.eu2.make.com/xxxxxxxxxxxxxxxx`).
3. En Retell AI, pega esa URL como webhook:
   - **A nivel de agente**: Dashboard → tu agente → **Webhook settings** →
     *Webhook URL*.
   - **O a nivel de cuenta**: Settings → Webhook.
4. Asegúrate de que el evento **`call_ended`** esté activado.

> **Registrar la estructura de datos:** con el escenario en modo de escucha
> (**Run once** en Make), haz una llamada de prueba real con el agente. Retell
> enviará el webhook, Make capturará el ejemplo y los mapeos `{{1.call.transcript}}`,
> `{{1.call.from_number}}`, etc. quedarán resueltos correctamente.

---

## 5. Activar el escenario

- Pon el escenario en **ON** (scheduling). Al ser un webhook *instant*, se ejecuta en
  cuanto Retell envía el evento.

---

## Payload esperado de Retell AI (`call_ended`)

El módulo webhook mapea estos campos (dentro de `call`):

| Campo Make | Descripción |
|---|---|
| `{{1.event}}` | Tipo de evento (`call_ended`) — usado por el filtro |
| `{{1.call.call_id}}` | ID de la llamada |
| `{{1.call.agent_id}}` | ID del agente |
| `{{1.call.direction}}` | `inbound` / `outbound` |
| `{{1.call.from_number}}` / `{{1.call.to_number}}` | Números origen/destino |
| `{{1.call.call_status}}` | Estado de la llamada |
| `{{1.call.disconnection_reason}}` | Motivo de fin de la llamada |
| `{{1.call.start_timestamp}}` / `{{1.call.end_timestamp}}` | Marcas de tiempo (ms) — se usan para calcular la duración |
| `{{1.call.transcript}}` | Transcripción completa (texto) |
| `{{1.call.recording_url}}` | URL de la grabación (si está disponible) |

El filtro **`Solo call_ended`** garantiza que otros eventos de Retell
(`call_started`, `call_analyzed`) no disparen el mensaje.

---

## Notas y límites

- **Longitud del mensaje:** Telegram limita cada mensaje a **4096 caracteres**. La
  transcripción se recorta a 3500 con `substring(...; 0; 3500)` para dejar margen a
  los metadatos. Si necesitas la transcripción íntegra en llamadas largas, añade un
  módulo *Text aggregator* / *Iterator* para trocearla en varios mensajes.
- **Formato (parse mode):** se envía en **texto plano** a propósito. Si usas
  `HTML`/`Markdown`, los caracteres especiales de la transcripción (`<`, `>`, `_`,
  `*`) pueden romper el envío con el error *"can't parse entities"*.
- **Seguridad (opcional):** puedes validar la firma del webhook de Retell añadiendo
  un módulo previo que verifique la cabecera `x-retell-signature` (HMAC SHA256 de la
  API key) antes del envío.
- **Zona:** si al importar aparece un aviso de zona, ábrelo desde la zona correcta de
  tu cuenta de Make; el flujo es idéntico.

---

## Troubleshooting HTTP ("no me llega nada")

1. **Retell dice que el webhook falla / no llega a Telegram.**
   Casi siempre es porque el endpoint no devolvió `200` a tiempo. Verifica que el
   módulo **Webhook Response** está presente y que su *Status* es `200`. Es lo primero
   que se ejecuta tras recibir el evento.

2. **El escenario tiene que estar en ON.** Un Custom Webhook solo procesa datos si el
   scheduling del escenario está activado. Con OFF, Make encola pero no ejecuta.

3. **Comprobar qué envía Retell realmente.** En Make abre el módulo webhook →
   **Redetermine data structure** → *Run once* y lanza una llamada real. Mira el
   *bundle* recibido: debe tener `event` y `call`. Si los campos van en otra ruta
   (p. ej. `data` en lugar de `call`), ajusta los mapeos `{{1.call.X}}`.

4. **Probar el endpoint a mano.** Puedes simular a Retell con curl contra la URL del
   webhook de Make y confirmar que responde `200`:

   ```bash
   curl -i -X POST "https://hook.eu2.make.com/TU_HOOK" \
     -H "Content-Type: application/json" \
     -d '{"event":"call_ended","call":{"call_id":"test_123","agent_id":"ag_1","direction":"inbound","from_number":"+34600000000","to_number":"+34911111111","call_status":"ended","disconnection_reason":"user_hangup","duration_ms":42000,"transcript":"Agent: Hola\nUser: Hola, gracias"}}'
   ```

   Debes recibir `HTTP/1.1 200` y, con el escenario en ON, un mensaje en Telegram.

5. **URL/zona correcta.** La URL del webhook debe ser la que genera *tu* cuenta de
   Make (`hook.eu2…`, `hook.us1…`, etc.). Si copiaste la del ejemplo, no funcionará.

6. **Mensaje vacío en Telegram.** Si llega el mensaje pero sin transcripción, es que
   la estructura de datos no estaba registrada al mapear: repite el paso 3.
