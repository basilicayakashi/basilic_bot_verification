import type { MessagesIn, MessagesOut, MessagesServer, MessagesInternal } from "./messages.types.js";

const es_in: MessagesIn = {
  helpMessage: `
# 🤖 Guía de configuración del bot

Este bot proporciona funciones de **verificación de miembros**, **detección de spam**, **análisis de miembros** y **notificaciones de juegos gratuitos** para tu servidor de Discord.

---

## 🔐 Verificación de miembros

### Activar la verificación

Usa:

\`/setup-verification\`

para configurar la verificación de nuevos miembros.

Puedes definir:

- el rol verificado asignado tras la aprobación
- el rol de moderación
- la categoría de moderación
- el tiempo máximo de verificación

### Gestionar preguntas de verificación

Después de activar la verificación, puedes personalizar las preguntas mostradas a los nuevos miembros:

- \`/add-verification-question\` → añadir una pregunta
- \`/edit-verification-question\` → editar una pregunta existente
- \`/delete-verification-question\` → eliminar una pregunta

Todas las preguntas configuradas pueden consultarse mediante:

\`/view-settings\`

### Cómo funciona la verificación

1. El bot publica un botón de verificación en el canal configurado.
2. Un nuevo miembro hace clic y responde las preguntas.
3. Se crea automáticamente un canal de verificación para moderación.
4. El equipo de moderación puede:
   - aprobar la solicitud de verificación
   - rechazar la solicitud de verificación
   - incluir al miembro en la lista negra
   - abrir un canal privado de conversación con el miembro para solicitar información adicional

5. Si es aprobado, el rol verificado se asigna automáticamente.

---

## 🛡️ Detección de spam

El bot puede supervisar actividad sospechosa.

Usa:

\`/setup-spam-detection\`

para configurar:

- activación de la detección
- canal de alertas
- mención del rol de moderación
- umbrales de detección

Cuando se detecta actividad sospechosa, las alertas se envían automáticamente al equipo de moderación.

---

## 👤 Verificación manual de miembros

Puedes verificar manualmente a un miembro, esté o no actualmente en el servidor.

Usa:

\`/verify-member\`

con el ID de Discord del miembro.

El bot:

- asignará inmediatamente el rol verificado si el miembro ya está en el servidor
- lo verificará automáticamente cuando se una más tarde

---

## 🔎 Análisis de miembros

Usa:

\`/check-member\`

para analizar una cuenta de Discord.

Este comando permite:

* ver en qué servidores está presente el usuario (solo servidores donde el bot está instalado)
* identificar si el usuario ha sido incluido en una lista negra
* consultar los motivos de lista negra registrados en cada servidor
* ayudar a los moderadores a identificar usuarios potencialmente problemáticos en varias comunidades

---

# 🎭 Reaction Roles — Guía de uso

## 📂 Paso 1 — Crear una categoría

Antes de añadir roles, hay que crear una categoría que los agrupe.

\`\`\`
/role-category action:create name:animal
\`\`\`

Una categoría representa un grupo temático de roles (ej: animales, idiomas, intereses...).

## ➕ Paso 2 — Añadir roles a la categoría

Por cada rol que quieras ofrecer a los miembros, usa:

\`\`\`
/role-manage action:add categorie:animal role:@zorro description:Zorro emoji:🦊
/role-manage action:add categorie:animal role:@perro description:Perro emoji:🐕
/role-manage action:add categorie:animal role:@gato description:Gato emoji:🐈
\`\`\`

> **Nota:** Los emojis personalizados del servidor también son compatibles. Copia su identificador desde Discord con el formato \`<:nombreemoji:123456789>\`.

## 📢 Paso 3 — Publicar el panel

Una vez configurados tus roles, publica el panel en el canal que prefieras:

\`\`\`
/role-create categorie:animal channel:#roles
\`\`\`

El bot entonces:

1. Creará un mensaje embed en el canal indicado
2. Listará los roles configurados con sus emojis y descripciones
3. Añadirá automáticamente las reacciones correspondientes bajo el mensaje

El resultado se verá así:

> **Roles — animal**
> 🦊 — Zorro
> 🐕 — Perro
> 🐈 — Gato

Los miembros solo tienen que hacer clic en una reacción para obtener el rol asociado, y volver a hacer clic para quitárselo.

## ✏️ Modificar un rol existente

Para cambiar la descripción o el emoji de un rol ya configurado:

\`\`\`
/role-manage action:update categorie:animal role:@zorro description:Zorro ártico emoji:🦊
\`\`\`

Para reemplazar un rol por otro:

\`\`\`
/role-manage action:update categorie:animal role:@rolviejo new_role:@rolnuevo
\`\`\`

El panel publicado se actualiza automáticamente.

## 🗑️ Eliminar un rol del panel

\`\`\`
/role-manage action:delete categorie:animal role:@perro
\`\`\`

El panel se actualiza automáticamente. Si era el último rol de la categoría, el mensaje se elimina.

## 📋 Renombrar una categoría

\`\`\`
/role-category action:update name:animal new_name:animales
\`\`\`

## ❌ Eliminar una categoría

\`\`\`
/role-category action:delete name:animal
\`\`\`

Esto elimina la categoría, todos sus roles configurados y el mensaje del panel publicado.

## 🔍 Ver las categorías existentes

\`\`\`
/role-category-list
\`\`\`

Muestra todas las categorías del servidor, los roles que contienen y si su panel está publicado.

---

## 🎮 Notificaciones de juegos gratuitos

El bot puede publicar automáticamente promociones de **juegos gratuitos** de:

- Steam
- Epic Games

Usa el comando de configuración de juegos gratuitos para:

- activar o desactivar las notificaciones
- elegir un canal de publicación
- activar o desactivar plataformas

Los juegos se:

- publican automáticamente
- ordenan por fecha de finalización de la promoción
- eliminan cuando la promoción expira

---

## ⚙️ Resumen de la configuración del servidor

Usa:

\`/view-settings\`

para mostrar la configuración completa del bot para el servidor, incluyendo:

- configuración de verificación
- preguntas de verificación
- configuración de juegos gratuitos

Este comando proporciona una vista centralizada de toda la configuración específica del servidor gestionada por el bot.

---

\`/role-used-msg-delete\` — Elimina automáticamente cualquier mensaje nuevo que mencione uno de los roles configurados. Solo el propietario del servidor está exento. Útil para evitar el abuso de menciones masivas como @everyone.

---

## 🔒 Permisos

La mayoría de los comandos de configuración requieren permisos de **Administrador**.
`,

  helpAbout: `
# 🤖 Acerca del bot

Este bot proporciona funciones de **verificación de miembros**, **detección de spam**, **análisis de miembros** y **notificaciones de juegos gratuitos** para tu servidor de Discord.

---

## ⚙️ Resumen de la configuración del servidor

Usa:

\`/view-settings\`

para mostrar la configuración completa del bot en el servidor, incluyendo:

* la configuración de verificación
* las preguntas de verificación
* la configuración de juegos gratuitos

Este comando proporciona una vista centralizada de todos los ajustes específicos del servidor.

---

\`/role-used-msg-delete\` — Elimina automáticamente cualquier mensaje nuevo que mencione uno de los roles configurados. El propietario del servidor es el único que no se ve afectado. Resulta útil para evitar abusos de menciones masivas como @everyone.

🔔 Notificaciones de Miembros en Lista Negra

Mediante el comando \`/setup-blacklist-alerts\`, el bot puede enviar alertas a un canal dedicado cuando un miembro que se une al servidor ya ha sido incluido en la lista negra de otro servidor que utiliza el bot.

La notificación muestra los servidores afectados y el motivo registrado de la inclusión en la lista negra, permitiendo al equipo de moderación actuar rápidamente si es necesario.
`,

  helpVerification: `
## 🔐 Verificación de miembros

### Activar la verificación

Usa:

\`/setup-verification\`

para configurar la verificación de nuevos miembros.

Puedes definir:

* el rol verificado asignado tras la aprobación
* el rol de moderación
* la categoría de moderación
* el tiempo máximo de verificación

### Gestionar las preguntas de verificación

Después de activar la verificación, puedes personalizar las preguntas mostradas a los nuevos miembros:

* \`/add-verification-question\` → añadir una pregunta
* \`/edit-verification-question\` → editar una pregunta existente
* \`/delete-verification-question\` → eliminar una pregunta

Todas las preguntas configuradas pueden consultarse mediante:

\`/view-settings\`

### Funcionamiento de la verificación

1. El bot publica un botón de verificación en el canal configurado.
2. Un nuevo miembro hace clic en el botón y responde a las preguntas configuradas.
3. Se crea automáticamente un canal de verificación destinado a la moderación.
4. El equipo de moderación puede:
   * aprobar la solicitud de verificación
   * rechazar la solicitud de verificación
   * incluir al miembro en la lista negra
   * abrir un canal privado de conversación con el miembro para obtener información adicional
5. Si la solicitud es aprobada, el rol verificado se asigna automáticamente.

---

## 👤 Verificación manual de un miembro

Puedes verificar manualmente a un miembro, esté o no presente actualmente en el servidor.

Usa:

\`/verify-member\`

con el identificador de Discord del miembro.

El bot:

* asignará inmediatamente el rol verificado si el miembro ya está presente
* lo verificará automáticamente cuando se una al servidor más adelante

---

## 🔎 Análisis de un miembro

Usa:

\`/check-member\`

para analizar una cuenta de Discord.

Este comando permite:

* ver en qué servidores está presente el miembro (solo aquellos donde el bot está instalado)
* identificar si el miembro ha sido incluido en una lista negra
* consultar los motivos de la lista negra registrados en cada servidor
* ayudar a los moderadores a identificar usuarios potencialmente problemáticos en varias comunidades
`,

  helpWelcomeMessage: `
## 👋 Mensajes de bienvenida

El bot puede enviar un mensaje de bienvenida personalizado a los nuevos miembros de un servidor.

Para configurar este mensaje:

1. Primero escribe el mensaje de bienvenida en un canal del servidor.
2. Copia el ID de ese mensaje.
3. Usa el comando:

\`\`\`
/set-welcome-message message_id:<ID_DEL_MENSAJE>
\`\`\`

El bot copiará el contenido de ese mensaje y lo usará para enviarlo a los nuevos miembros.

Puedes escribir \`{{mention}}\` en el mensaje: el bot lo reemplazará por la mención del nuevo miembro para hacerle ping.

Para probar cómo se verá el mensaje configurado, usa:

\`\`\`
/view-welcome-message
\`\`\`

Para eliminar el mensaje de bienvenida configurado, usa:

\`\`\`
/delete-welcome-message
\`\`\`
`,

  helpSpam: `
## 🛡️ Detección de spam

El bot puede supervisar actividades sospechosas.

Usa:

\`/setup-spam-detection\`

para configurar:

* la activación o desactivación de la detección
* el canal de alertas
* la mención del rol de moderación
* los umbrales de detección

Cuando se detecta una actividad sospechosa, las alertas se envían automáticamente al equipo de moderación.
`,

  helpFreeGames: `
## 🎮 Notificaciones de juegos gratuitos

El bot puede publicar automáticamente promociones de juegos gratuitos procedentes de:

* Steam
* Epic Games

Los comandos dedicados permiten:

* activar o desactivar las notificaciones
* elegir un canal de publicación
* activar o desactivar las plataformas

Los juegos se:

* publican automáticamente en el canal configurado
* se ordenan según la fecha de finalización de la promoción
* se eliminan cuando la promoción expira
`,

  helpPermissions: `
## 🔒 Permisos

La mayoría de los comandos de configuración requieren permisos de **Administrador**.
`,

  helpHiddenCommands: `
  🔎 Comandos ocultos
Escribe estos comandos así:
\`!basi jail <id>\` : permite poner en prisión al miembro con id \`<id>\` (adapta \`<id>\` según el miembro)
\`!basi hornyjail <id>\` : permite poner en horny jail al miembro con id \`<id>\` (adapta \`<id>\` según el miembro)
\`!basi bellyjail <id>\` : permite poner en belly jail al miembro con id \`<id>\` (adapta \`<id>\` según el miembro)
\`!basi basijail <id>\` : permite poner en basi jail al miembro con id \`<id>\` (adapta \`<id>\` según el miembro)
\`!basi bonk <id>\` : permite bonkear al miembro con id \`<id>\` (adapta \`<id>\` según el miembro)
  `,

  helpReactionRoles: `
# 🎭 Reaction Roles — Guía de uso

Los reaction roles permiten que los miembros se asignen o eliminen roles por sí mismos haciendo clic en una reacción con emoji debajo de un mensaje.

---

## 📂 Paso 1 — Crear una categoría

Antes de añadir roles, es necesario crear una categoría que los agrupe.

\`\`\`
/role-category action:create name:animal
\`\`\`

Una categoría representa un grupo temático de roles (por ejemplo: animales, idiomas o centros de interés).

---

## ➕ Paso 2 — Añadir roles a la categoría

Para cada rol que desees ofrecer a los miembros, utiliza:

\`\`\`
/role-manage action:add category:animal role:@zorro description:Zorro emoji:🦊
/role-manage action:add category:animal role:@perro description:Perro emoji:🐕
/role-manage action:add category:animal role:@gato description:Gato emoji:🐈
\`\`\`

> **Nota:** Los emojis personalizados del servidor también son compatibles. Copia su identificador desde Discord con el formato \`<:nombreemoji:123456789>\`.

---

## 📢 Paso 3 — Publicar el panel

Una vez configurados los roles, publica el panel en el canal que prefieras:

\`\`\`
/role-create category:animal channel:#roles
\`\`\`

El bot hará lo siguiente:

1. Crear un mensaje embed en el canal indicado
2. Mostrar los roles configurados con sus emojis y descripciones
3. Añadir automáticamente las reacciones correspondientes al mensaje

El resultado será similar a:

> **Roles — animal**
> 🦊 — Zorro
> 🐕 — Perro
> 🐈 — Gato

Los miembros solo tendrán que hacer clic en una reacción para obtener el rol asociado y volver a hacer clic para eliminarlo.

---

## ✏️ Modificar un rol existente

Para cambiar la descripción o el emoji de un rol ya configurado:

\`\`\`
/role-manage action:update category:animal role:@zorro description:Zorro ártico emoji:🦊
\`\`\`

Para reemplazar un rol por otro:

\`\`\`
/role-manage action:update category:animal role:@rolantiguo new_role:@rolnuevo
\`\`\`

El panel publicado se actualiza automáticamente.

---

## 🗑️ Eliminar un rol del panel

\`\`\`
/role-manage action:delete category:animal role:@perro
\`\`\`

El panel se actualiza automáticamente. Si era el último rol de la categoría, el mensaje se elimina.

---

## 📋 Cambiar el nombre de una categoría

\`\`\`
/role-category action:update name:animal new_name:animales
\`\`\`

---

## ❌ Eliminar una categoría

\`\`\`
/role-category action:delete name:animal
\`\`\`

Esto elimina la categoría, todos sus roles configurados y el mensaje del panel publicado.

---

## 🔍 Ver las categorías existentes

\`\`\`
/role-category-list
\`\`\`

Muestra todas las categorías del servidor, los roles que contienen y si su panel está publicado.
`,

  commandMustBeUsedInServer: "Este comando debe usarse dentro de un servidor",
  actionMustBeUsedInServer: "Esta acción debe usarse dentro de un servidor",
  commandMustBeUsedInTextChannel: "Este comando debe usarse en un canal de texto",
  onlyStaffCanUseCommand: "Solo los miembros del staff pueden usar este comando",
  onlyStaffCanUseButtons: "Solo los miembros del staff pueden usar estos botones",
  verificationNotConfigured: "La verificación no está configurada para este servidor",
  verificationSettingsSaved: "Los ajustes de verificación se han guardado para este servidor",
  verificationSettingsSavedAndPanelPosted:
    "Los ajustes de verificación se han guardado y el panel se ha publicado correctamente",
  verificationRequestSent:
    "Tu solicitud de verificación ha sido enviada al equipo de staff",
  configuredStaffCategoryNotFound:
    "No se pudo encontrar la categoría de staff configurada",
  configuredPanelChannelInvalid:
    "El canal actual no es un canal de texto válido para el panel de verificación",
  notAllowedConfigureVerification:
    "No tienes permiso para configurar la verificación en este servidor",
  notAllowedManageQuestions:
    "No tienes permiso para gestionar las preguntas de verificación en este servidor",
  noVerificationQuestions:
    "No hay preguntas de verificación configuradas para este servidor",
  tooManyVerificationQuestions:
    "Hay demasiadas preguntas de verificación configuradas para este servidor. Los modales de Discord admiten un máximo de 5 componentes",
  blacklistedCannotAccess:
    "Estás en la lista negra y no puedes acceder a este servidor",
  alreadyVerifiedRoleRestored:
    "Ya habías sido verificado anteriormente. El rol de verificado se ha restaurado automáticamente",
  targetMemberNoLongerInServer:
    "El miembro afectado ya no está en el servidor",
  imageRequired: "Se requiere una imagen",
  errorOccurred: "Ha ocurrido un error",
  noQuestionFound: (index: number) => `No se encontró ninguna pregunta en el índice ${index}`,
  questionUpdatedSuccessfully: (index: number) => `La pregunta ${index} se actualizó correctamente`,
  questionDeletedSuccessfully: (index: number) => `La pregunta ${index} se eliminó correctamente`,
  alreadyBeenVerifiedBefore: "Ya has sido verificado anteriormente. El rol @verified ha sido restaurado automáticamente",
  userUnknownToTheBot: (targetUserId: string) => `El usuario ${targetUserId} es desconocido para el bot`,
  NoAuthorizedServerFoundInSetupVerificationPermissions: "No se encontraron servidores autorizados en setup_verification_permissions",
  CommandReservedByBasilic: "Este comando solo puede ser utilizado por \@basilicayakashifr",
  YouCannotConfigureMoreThanFiveQuestions: "No puedes configurar más de 5 preguntas de verificación porque los modales de Discord están limitados a 5 componentes",
  QuestionAddedAtIndex: (index: number) => `Pregunta añadida en el índice ${index}`,
  YouAreNotAllowedToViewVerificationQuestionsOnThisServer: "No tienes permiso para ver las preguntas de verificación en este servidor",
  YouAreNotAllowedtoEditVerificationQuestionsOnThisServer: "No tienes permiso para editar las preguntas de verificación en este servidor",
  VerifiedUserFound: (user_id: string, username: string, verified_at: string, verified_by: string) => `
            **Usuario verificado encontrado**

            **ID de usuario:** ${user_id}
            **Nombre de usuario:** ${username}
            **Verificado el** ${verified_at}
            **Verificado por:** ${verified_by}
            `,
  globalKickHeader: (userId: string) => `**Resultados del kick global para** \`${userId}\``,
  permissionAdded: (guildId: string) => `Permiso añadido.\n\n**ID del servidor:** ${guildId}`,
  verificationQuestionsTitle: "**Preguntas de verificación para este servidor**",
  typeLabel: "Tipo",
  requiredLabel: "Requerido",
  yes: "sí",
  no: "no",
  setupVerificationDescription: "Configurar la verificación para este servidor",
  checkVerifiedDescription: "Comprobar la verificación, el estado de lista negra y los servidores compartidos de un usuario",
  globalKickDescription: "Expulsar a un usuario de todos los servidores autorizados para el bot",
  allowSetupVerificationDescription: "Permitir a un usuario configurar la verificación para un servidor específico",
  addVerificationQuestionDescription: "Añadir una pregunta de verificación para este servidor",
  listVerificationQuestionsDescription: "Listar las preguntas de verificación para este servidor",
  editVerificationQuestionDescription: "Editar una pregunta de verificación por su índice",
  deleteVerificationQuestionDescription: "Eliminar una pregunta de verificación por su índice",
  botHelpDescription: "Mostrar la guía de configuración del bot y los comandos útiles",
  verifiedRoleIdDescription: "Rol que se asignará tras la aprobación",
  staffCategoryIdDescription: "ID de la categoría donde se crearán los canales del staff",
  staffRoleIdDescription: "Rol del staff a notificar",
  userIdLookupDescription: "ID del usuario que se debe buscar",
  userIdKickDescription: "ID de Discord del usuario que se debe expulsar",
  guildIdDescription: "ID del servidor de Discord donde se permite el comando",
  questionLabelDescription: "Etiqueta de la pregunta mostrada al usuario",
  questionTypeDescription: "Tipo de pregunta",
  questionRequiredDescription: "Indica si la pregunta es obligatoria",
  questionIndexDescription: "Índice de la pregunta mostrado por /view-settings",
  newQuestionLabelDescription: "Nueva etiqueta de la pregunta",
  newQuestionTypeDescription: "Nuevo tipo de pregunta",
  newQuestionRequiredDescription: "Indica si la pregunta es obligatoria",
  choiceShortText: "Texto corto",
  choiceParagraph: "Párrafo",
  choiceImageUpload: "Subida de imagen",
  guildNotFound: (guildId: string) => `❌ ${guildId} — servidor no encontrado o el bot no está presente`,
  userNotPresent: (name: string, id: string) => `ℹ️ ${name} (${id}) — usuario no presente`,
  userNotKickable: (name: string, id: string) => `❌ ${name} (${id}) — el usuario no puede ser expulsado`,
  userKicked: (name: string, id: string) => `✅ ${name} (${id}) — expulsado`,
  unexpectedError: (guildId: string) => `❌ ${guildId} — error inesperado`,

  BlacklistedUserFound: (
    userId: string,
    username: string,
    blacklistedAt: string,
    blacklistedBy: string,
    reason: string
  ) => `⚠️ Usuario en lista negra encontrado

	ID de usuario: ${userId}
	Nombre de usuario: ${username}
	Incluido en lista negra el: ${blacklistedAt}
	Incluido por: ${blacklistedBy}
	Razón: ${reason}`,

  noReasonProvided: "Sin razón proporcionada",

  blacklistReasonDescription: "Añadir una razón (opcional)",
  blacklistMemberDescription: "Poner un usuario en la lista negra en este servidor",
  unblacklistMemberDescription: "Eliminar a un usuario de la lista negra y desbanearlo",
  userNotBlacklisted: (userId: string) => `ℹ️ ${userId} — el usuario no está en la lista negra`,
  userRemovedFromBlacklist: (userId: string) => `✅ ${userId} — eliminado de la lista negra y desbaneado`,
  blacklistReasonSaved: "Motivo de la lista negra guardado correctamente",
  refusalReasonSaved: "Motivo guardado correctamente",
  setupSpamDetectionDescription: "Configurar la detección de alertas de spam para este servidor",
  spamDetectionEnabledOptionDescription: "Activar o desactivar la detección de spam",
  spamAlertChannelDescription: "Canal donde se enviarán las alertas de moderación",
  spamStaffRoleDescription: "Rol del staff que se mencionará en las alertas de spam",
  spamAlertChannelRequired: "Debes proporcionar un canal de alertas para activar la detección de spam",
  spamDetectionEnabled: (channelId: string, staffRoleId: string | null) => `✅ Detección de spam activada.\nCanal de alertas: <#${channelId}>${staffRoleId ? `\nRol del staff: <@&${staffRoleId}>` : ""
    }`,
  spamDetectionDisabled: "✅ Detección de spam desactivada",
  memberPresentOnServers: (servers: string) => `📡 Miembro presente en los siguientes servidores:\n${servers}`,
  memberBlacklistedOnServers: (servers: string) => `⚠️ El usuario está en la lista negra en los siguientes servidores:\n${servers}`,
  blacklistMemberSavedButKickFailed: (userId: string, username: string) => `⚠️ ${username} (${userId}) fue añadido a la lista negra, pero no pudo ser expulsado del servidor`,
  blacklistMemberSuccess: (userId: string, username: string) => `✅ ${username} (${userId}) fue añadido a la lista negra y expulsado del servidor`,
  spamInfoNombre: "Número de mensajes a partir del cual se activa una alerta",
  spamInfoDuree: "Duración en segundos de la ventana de detección",
  DelaiDescriptionCommande: "Tiempo en horas para enviar las respuestas de verificación",
  ViewSettings: (
    questionsText: string,
    verifiedRoleDisplay: string,
    staffRoleDisplay: string,
    verificationTimeoutHours: number,
    freeGamesEnabled: boolean,
    freeGamesChannel: string,
    includeSteam: boolean,
    includeEpicGames: boolean,
    roleMsgDeleteText: string,
    BlcklistAlertChannel: string,
    autokickSettings_days: number
  ) => `**Configuración actual del bot**

## Verificación

1) Rol verificado: ${verifiedRoleDisplay}
2) Rol de moderación: ${staffRoleDisplay}
3) Tiempo de verificación: ${verificationTimeoutHours} hora(s)
4) ${BlcklistAlertChannel}

## Auto-kick
${autokickSettings_days < 1 ? "Ningún miembro será expulsado automáticamente al unirse al servidor" : `Los miembros que se unan con una cuenta creada en los últimos ${autokickSettings_days} días serán expulsados automáticamente`}

${questionsText}

${roleMsgDeleteText}
  
## Juegos gratuitos

1) Activado: ${freeGamesEnabled ? "sí" : "no"}
2) Canal de publicación: ${freeGamesChannel}
3) Steam: ${includeSteam ? "sí" : "no"}
4) Epic Games: ${includeEpicGames ? "sí" : "no"}`,
  NotAuthorizedServer: "El servidor no ha sido autorizado, es imposible usar ningún comando",
  ManualVerificationProcessed: (
    targetUserId: string,
    existingVerification: boolean,
    targetMember: boolean,
    roleAdded: boolean
  ) =>
    `✅ Verificación manual procesada para \`${targetUserId}\`.\n` +
    `- Eliminación de verificación pendiente: completada\n` +
    `- Entrada en verified_users: ${existingVerification ? "ya existente" : "añadida"
    }\n` +
    `- Rol verificado: ${targetMember
      ? roleAdded
        ? "añadido"
        : "ya presente"
      : "no añadido, miembro ausente del servidor"
    }`,

  NoMembersFoundWithRoleCount: (count: number) => `No se encontraron miembros con exactamente ${count} rol(es)`,
  MembersWithRoleCountTitle: (count: number) => `**Miembros con exactamente ${count} rol(es)**`,
  freeGamesManualPublishSettingsDeleted: "Configuración de publicación eliminada",
  freeGamesManualPublishSettingsSaved: "Configuración de publicación guardada",
  none: "Ninguno",
  SuppressionAutomatiqueMessageMentionRoleActivee: (rolesDisplay: string) => `✅ Eliminación activada para los mensajes que mencionan: ${rolesDisplay}`,
  SuppressionAutomatiqueMessageMentionRoleDesctivee: `✅ Eliminación desactivada`,
  FournirAuMoinsUnRole: "Debe proporcionar al menos un rol para mencionar y habilitar la eliminación automática",
  AucunRole: "No rol",
  RoleIntrouvable: (roleDisplay: string) => `Rol no encontrado (\`${roleDisplay}\`)`,
  AffichageParametrageSuppressionMessageRolesUtilises: (enabled: boolean, rolesDisplay: string) => `## 🚫 Eliminación de mensajes por rol
      
      **Activado   :** ${enabled ? "sí" : "no"}
      **Roles supervisados :** ${rolesDisplay}
      `,
  unknownServer: "Servidor desconocido",
  Serveur: "Servidor",
  by: "Por",
  reason: "Razón",
  verificationAlreadyInProgress: "⏳ Tu verificación ya está siendo procesada por el staff",
  allowManageQuestionsDescription: "Permitir a un usuario gestionar las preguntas de verificación de un servidor",
  choiceLongText: "Texto largo",
  verificationTimeoutHoursDescription: "Tiempo límite en horas para enviar las respuestas de verificación",
  spamDetectionDisabledOptionDescription: "Desactivar la detección de spam",
  spamAlertRoleDescription: "Rol de staff a mencionar en las alertas de spam",
  questionAdded: "Pregunta añadida",
  questionDeleted: "Pregunta eliminada",
  questionUpdated: "Pregunta actualizada",
  noQuestionsToDelete: "No hay preguntas para eliminar",
  noQuestionsToEdit: "No hay preguntas para editar",
  invalidQuestionIndex: "Índice de pregunta inválido",
  verificationSettingsNotConfigured: "La configuración de verificación no está configurada",
  blacklistReasonRequired: "Se requiere un motivo para la lista negra",
  memberNotFound: "Miembro no encontrado",
  memberAlreadyBlacklisted: "Este miembro ya está en la lista negra",
  memberBlacklistRemoved: "Miembro eliminado de la lista negra",
  memberNotBlacklisted: "Este miembro no está en la lista negra",
  spamDetectionSaved: "Configuración de detección de spam guardada",
  reactionRoleCategoryCreated: (name: string) => `Categoría **${name}** creada`,
  reactionRoleCategoryAlreadyExists: (name: string) => `Categoría **${name}** ya existe`,
  reactionRoleCategoryNotFound: (name: string) => `Categoría **${name}** no encontrada`,
  reactionRoleNewNameRequired: "El parámetro `new_name` es obligatorio para update",
  reactionRoleCategoryRenamed: (oldName: string, newName: string) => `Categoría renombrada **${oldName}** → **${newName}**`,
  reactionRoleCategoryDeleted: (name: string) => `La categoría **${name}** y todos sus roles han sido eliminados`,
  reactionRoleDescriptionAndEmojiRequired: "`description` y `emoji` son obligatorios para add",
  reactionRoleAlreadyInCategory: (role: string, category: string) => `El rol ${role} ya está en la categoría **${category}**. Usa \`action:update\` para modificarlo`,
  reactionRoleAdded: (role: string, category: string, emoji: string) => `Rol ${role} añadido a **${category}** con el emoji ${emoji}`,
  reactionRoleUpdated: (role: string, category: string) => `Rol ${role} actualizado en **${category}**`,
  reactionRoleRemoved: (role: string, category: string) => `Rol ${role} eliminado de **${category}**`,
  reactionRolePanelPublished: (category: string, channel: string) => `Panel **${category}** publicado en ${channel}`,
  reactionRoleNoCategoryConfigured: "No hay ninguna categoría configurada en este servidor",
  reactionRoleCategoriesTitle: "Categorías de reaction roles",
  reactionRoleNoRole: "*Ningún rol*",
  reactionRolePanelPublishedIn: (channelId: string) => `\n📌 Panel publicado en <#${channelId}>`,
  reactionRolePanelNotPublished: "*(panel no publicado)*",
  welcomeMessageSaved: "✅ Mensaje de bienvenida guardado",
  welcomeMessageDeleted: "✅ Mensaje de bienvenida eliminado",
  welcomeMessageNoneConfigured: "❌ No hay mensaje de bienvenida configurado en este servidor",
  welcomeMessageNotFound: "❌ Mensaje no encontrado. Verifica que el ID del mensaje sea correcto y que el bot tenga acceso a la sala",
  blacklistJoinNotificationsEnabled: (channelId: string) => `Notificaciones activadas en <#${channelId}>`,
  ChannelMustBeTextChannel: "El canal debe ser un canal de texto",
  viewSettingsBlacklistNotificationChannel: (channel: string) => `Canal de notificación de miembros en lista negra: ${channel}`,
  AutokickSettingsUpdated: "Registro realizado",
  helpAutokick: `La función de auto kick supervisa la llegada de nuevos miembros al servidor.
El comando \`/autokick-newmembers\` te permite configurar un valor entero: el número de días. Cada vez que alguien se une, el bot comprueba la antigüedad de su cuenta (la fecha de creación de la cuenta). Si la antigüedad es menor que el número de días configurado, el miembro será expulsado automáticamente.
Si estableces 0 días, la función de auto kick está desactivada`,
};

const es_out: MessagesOut = {
  YourVerifiedStatusRestored: (guild_name: string) => `Hola, tu estado verificado en **${guild_name}** ha sido restaurado automáticamente`,
  YourVerifiedStatusAccepted: (guild_name: string) => `Hola, tu verificación en **${guild_name}** ha sido aceptada. El rol @verified te ha sido asignado`,
  YourVerifiedStatusDenied: (guild_name: string) => `Hola, tu solicitud de verificación en **${guild_name}** ha sido rechazada`,
  YourVerifiedStatusDeniedAndBlackedListed: (guild_name: string) => `Hola, tu solicitud de verificación en **${guild_name}** ha sido rechazada y tu cuenta ha sido incluida en la lista negra`,
  MsgBlacklisted: (guild_name: string) => `Hola, estás en la lista negra y no puedes unirte a **${guild_name}**`,
  YourVerifiedStatusDeniedAndBlackedListedWithReason: (guildName: string, reason: string) => `❌ Tu solicitud de verificación para ${guildName} fue rechazada y has sido incluido en la lista negra.\nMotivo: ${reason}`,
  YourVerifiedStatusDeniedWithReason: (guildName: string, reason: string) => `❌ Tu solicitud de verificación para ${guildName} fue rechazada.\nMotivo: ${reason}`,
  verificationTimeoutDM: (guildName: string) => `Has sido expulsado de **${guildName}** porque no completaste la verificación a tiempo`,
};

const es_server: MessagesServer = {
  startVerificationButton: "Iniciar verificación",
  startVerificationMessage: "Haz clic en el botón de abajo para comenzar tu verificación",

  approveButton: "Aprobar",
  rejectButton: "Rechazar",
  blacklistButton: "Lista negra",

  approvedDoneButton: "Aprobado",
  rejectedDoneButton: "Rechazado",
  blacklistedDoneButton: "En lista negra",

  verificationModalTitle: "Verificación",
  answerPlaceholder: "Escribe tu respuesta aquí",
  uploadOneImage: "Subir una imagen",
  noFileProvided: "Ningún archivo proporcionado",

  newVerificationRequest: "Nueva solicitud de verificación",
  memberLabel: "Miembro",
  tagLabel: "Etiqueta",
  accountCreatedOnLabel: "Cuenta creada el",
  accountAgeLabel: "Antigüedad de la cuenta",

  verificationWaiting: (staffRoleId: string) => `<@&${staffRoleId}> hay una solicitud de verificación en espera`,
  verificationAcceptedBy: (staffId: string, targetId: string) => `✅ Verificación aceptada por <@${staffId}> para <@${targetId}>`,
  verificationDeniedBy: (staffId: string, targetId: string) => `❌ Verificación rechazada por <@${staffId}> para <@${targetId}>`,
  userBlacklistedBy: (staffId: string, targetId: string) => `⛔ El usuario <@${targetId}> ha sido puesto en la lista negra por <@${staffId}>`,

  lessThanOneDay: "menos de un día",
  oneDay: "1 día",
  days: (n: number) => `${n} días`,
  oneMonth: "1 mes",
  months: (n: number) => `${n} meses`,
  oneYear: "1 año",
  years: (n: number) => `${n} años`,

  rejectModalTitle: "Rechazar solicitud de verificación",
  rejectReasonLabel: "Motivo del rechazo",
  rejectReasonPlaceholder: "Opcional: explica por qué se rechaza la solicitud",
  reasonLabel: "Motivo",
  noReasonProvided: "No se proporcionó motivo",

  blacklistModalTitle: "Poner al miembro en la lista negra",
  blacklistReasonLabel: "Motivo de la lista negra",
  blacklistReasonPlaceholder: "Explica por qué este miembro está en la lista negra",
  spamDuplicateText: "Mensajes repetidos detectados",
  spamChannelsTouched: "Canales afectados",
  spamDuplicateFile: (n: number) => `Mismo archivo/imagen reenviado ${n} veces`,
  spamHighVolume: (n: number) => `Alto volumen: ${n} mensajes en la ventana`,
  spamAlertTitle: "⚠️ Sospecha de spam",
  spamNoContent: "(sin texto, probablemente archivo adjunto)",
  spamFalsePositive: "Falso positivo",
  spamBan: "Banear",
  spamUserLabel: "Usuario",
  spamScoreLabel: "Puntuación",
  spamOccurrencesLabel: "Ocurrencias",
  spamChannelsLabel: "Canales afectados",
  spamReasonsLabel: "Indicadores",
  spamSampleLabel: "Ejemplo",
  spamLinksLabel: "Enlaces de mensajes",
  spamUnknown: "desconocido",
  spamModerationFallback: "Moderación",
  spamAlertMessage: "actividad sospechosa detectada, se recomienda revisión manual",
  discussMemberButton: "Hablar con el miembro",
  discussionChannelIntro: (targetId: string) => `Este canal privado permite al staff comunicarse con <@${targetId}> sobre su solicitud de verificación`,
  discussionChannelAlreadyExists: (channelId: string) => `Ya existe un canal de discusión: <#${channelId}>`,
  discussionChannelCreated: (channelId: string) => `Canal de discusión creado: <#${channelId}>`,
  discussionChannelNamePrefix: "verification-discussion",
  verificationTimeoutKickReason: "Tiempo de verificación excedido",
  verificationTimeoutDM: (guildName: string) => `Has sido expulsado de **${guildName}** porque no completaste la verificación a tiempo`,
  verificationTimeoutDisabled: "No hay tiempo de verificación configurado",
  verificationTimeoutSet: (hours: number) => `Tiempo de verificación configurado a ${hours} hora(s)`,
  spamFalsePositiveConfirmed: "✅ Falso positivo confirmado",
  spamUserBanned: "🔨 Usuario baneado",
  checkMemberBlacklistedOn: (lines: string) => `⛔ Usuario en lista negra en:\n\n${lines}`,
  by: "Por",
  reason: "Razón",
  reactionRolePanelTitle: (category: string) => `Roles — ${category}`,
  reactionRolePanelEmpty: "No hay roles configurados para esta categoría",
  blacklistServerMessage: (guildName: string, timestamp: string, blacklisted_by: string, reason: string) => `• Servidor : ${guildName}
  Fecha : ${timestamp}
  Por : ${blacklisted_by}
  Motivo : ${reason}`,

  blackListedMemberFound: (memberTag: string, memberId: string, msgLines: string) => `⚠️ **Nuevo miembro ya en la lista negra en otros lugares**
  
  Miembro : ${memberTag} (${memberId} - <@${memberId}>)

  ${msgLines}
  `,

  masterPet: {
    alreadyDeclared: (role) => `Ya estás registrado como ${role}`,
    declaredSuccess: (role) => `Ahora estás registrado como ${role}`,
    undeclaredSuccess: (role) => `Ya no estás registrado como ${role}`,
    cannotTargetSelf: "No puedes seleccionarte a ti mismo",
    cannotTargetBot: "Los bots no pueden participar en relaciones master/pet",
    mustDeclareMasterFirst: "Debes registrarte primero como master antes de enviar esta solicitud",
    mustDeclarePetFirst: "Debes registrarte primero como pet antes de enviar esta solicitud",
    alreadyLinked: "Ya tienes una relación con este miembro",
    noLinkFound: "No existe ninguna relación master/pet con este miembro",
    unlinkSuccess: (targetId) => `Tu relación con <@${targetId}> ha sido eliminada`,
    accept: "Aceptar",
    decline: "Rechazar",
    requestPetSent: (requesterId, targetId) => `<@${targetId}>, <@${requesterId}> quiere que seas su pet`,
    requestMasterSent: (requesterId, targetId) => `<@${targetId}>, <@${requesterId}> quiere que seas su master`,
    requestExpired: "Esta solicitud ya no existe",
    notYourRequest: "Esta solicitud no está dirigida a ti",
    requestAccepted: (requesterId, targetId) => `La relación entre <@${requesterId}> y <@${targetId}> se ha creado correctamente`,
    requestDeclined: (requesterId, targetId) => `<@${targetId}> rechazó la solicitud de <@${requesterId}>`,
    memberNotFound: 'No se encontró el miembro',
    targetDmClosed: 'Este miembro tiene los mensajes privados desactivados, no se pudo enviar la solicitud',
    requestSentConfirmation: 'Tu solicitud se ha enviado por mensaje privado',
    roleMaster: 'Maestro',
    rolePet: 'Mascota',
    noRoleDeclared: 'No se ha declarado ningún rol',
    noneLabel: 'Ninguno',
    profileSummary: (userId, roles, masters, pets) =>
      `**Ficha de <@${userId}>**
    Rol(es) declarado(s): ${roles}
    Maestro(s): ${masters}
    Mascota(s): ${pets}`,

    invalidSymbol: 'Este símbolo no es válido. Usa un emoji Unicode o un emoji del servidor.',
    symbolAlreadyTaken: 'Este símbolo ya lo ha reclamado otro maestro.',
    symbolClaimed: (symbol) => `Has reclamado el símbolo ${symbol}.`,
    symbolRemoved: 'Tu símbolo ha sido liberado.',
    invalidChannel: 'Este canal no admite la lectura de mensajes.',
    referenceMessageNotFound: 'No se encontró el mensaje en este canal.',
    referenceMessageSet: 'El mensaje de referencia se ha configurado correctamente.',
    noSymbolsClaimed: 'Todavía no se ha reclamado ningún símbolo.',
    masterSymbolsTableTitle: '📋 Símbolos de maestro',
    symbolColumnHeader: 'Símbolo',
    masterColumnHeader: 'Maestro',
    masterDeclaredWithSymbol: (symbol) => `Ahora estás declarado como **maestro**, con el símbolo ${symbol}.`,
    symbolChanged: (symbol) => `Tu símbolo se ha actualizado: ${symbol}.`,

  }
};

const es_internal: MessagesInternal = {
  kickReasonBlacklistedStart: "Usuario en lista negra intentó iniciar la verificación",
  kickReasonAuto: "Usuario en lista negra expulsado automáticamente al entrar",
  kickReasonDenied: "Verificación rechazada por el staff",
  kickReasonBlacklisted: "User blacklisted by staff during verification",
  memberAlreadyVerifiedPreviously: "Miembro ya verificado anteriormente",
  blacklistedDuringVerification: "Puesto en lista negra durante la verificación",
  verifiedBy: (staffTag: string) => `Verificado por ${staffTag}`,
  globalKickRequestedBy: (staffTag: string) => `Expulsión global solicitada por ${staffTag}`,
  kickReasonBlacklistedWithReason: (reason: string) => `Incluido en la lista negra durante la verificación: ${reason}`,
  kickReasonDeniedWithReason: (reason: string) => `Verificación rechazada: ${reason}`,
  //spamDuplicateText: (n: number) => `Texto idéntico enviado ${n} veces`,
  //spamChannelsTouched: (n: number) => `Canales afectados: ${n}`,
  verificationTimeoutKickReason: "Tiempo de verificación excedido",
  verificationChannelClosed: "Decisión de verificación finalizada",
  blacklistKickReason: (moderatorTag: string, reason?: string) => `Incluido en la lista negra por ${moderatorTag}${reason ? ` | Motivo: ${reason}` : ""}`,
  spamBanReason: (moderatorTag: string) => `Spam confirmado por ${moderatorTag}`,
};

export default { es_in, es_out, es_server, es_internal };