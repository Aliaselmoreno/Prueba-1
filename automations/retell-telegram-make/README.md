# Flujo Make: Retell AI → Telegram (evento `call_ended`)

Automatización en **Make (Integromat)** que recibe el webhook de **Retell AI** cuando
una llamada termina (`call_ended`) y envía la **transcripción completa** y los datos
básicos de la llamada a un chat de **Telegram**.

```
Retell AI  ──(webhook call_ended)──►  Make (Custom Webhook)  ──►  Filtro event=call_ended  ──►  Telegram (Send a Message)
```

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
4. Verás dos módulos: **Custom webhook** y **Telegram → Send a Text Message or Reply**.

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
  un módulo previo que verifique la cabecera `X-Retell-Signature` antes del envío.
- **Zona:** si al importar aparece un aviso de zona, ábrelo desde la zona correcta de
  tu cuenta de Make; el flujo es idéntico.
