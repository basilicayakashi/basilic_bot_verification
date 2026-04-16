const es_in = {
  helpMessage: `
**Guía de inicio del bot**

**Cómo empezar**
1. Primero, solicita a **basilic** autorización para usar el bot en tu servidor.
2. En tu solicitud, proporciona el **ID del servidor** donde se usará el bot.
3. Una vez autorizada, el **propietario del servidor** puede usar \`/setup-verification\` para activar la verificación de nuevos miembros.

**Configurar la verificación**
Después de activar la verificación con \`/setup-verification\`, el propietario puede personalizar las preguntas:

- \`/add-verification-question\` → añade una pregunta
- \`/edit-verification-question\` → modifica una pregunta existente
- \`/delete-verification-question\` → elimina una pregunta existente
- \`/list-verification-questions\` → muestra las preguntas configuradas

**Funcionamiento para nuevos miembros**
1. El bot publica un botón de verificación en el canal elegido.
2. Un nuevo miembro hace clic y responde a las preguntas.
3. El bot crea un canal de verificación para el staff.
4. El staff puede aprobar, rechazar o poner en lista negra al usuario.
5. Si es aprobado, el rol se asigna automáticamente.

**Detección de spam**
El bot también puede detectar comportamientos sospechosos mediante:

- \`/setup-spam-detection\` → activa y configura la detección de spam en el servidor

Esta función envía alertas al staff cuando un usuario envía muchos mensajes en poco tiempo.
`,
    commandMustBeUsedInServer: "Este comando debe usarse dentro de un servidor.",
    actionMustBeUsedInServer: "Esta acción debe usarse dentro de un servidor.",
    commandMustBeUsedInTextChannel: "Este comando debe usarse en un canal de texto",
    onlyStaffCanUseCommand: "Solo los miembros del staff pueden usar este comando.",
    onlyStaffCanUseButtons: "Solo los miembros del staff pueden usar estos botones.",
    verificationNotConfigured: "La verificación no está configurada para este servidor.",
    verificationSettingsSaved: "Los ajustes de verificación se han guardado para este servidor.",
    verificationSettingsSavedAndPanelPosted:
      "Los ajustes de verificación se han guardado y el panel se ha publicado correctamente.",
    verificationRequestSent:
      "Tu solicitud de verificación ha sido enviada al equipo de staff.",
    configuredStaffCategoryNotFound:
      "No se pudo encontrar la categoría de staff configurada.",
    configuredPanelChannelInvalid:
      "El canal actual no es un canal de texto válido para el panel de verificación.",
    notAllowedConfigureVerification:
      "No tienes permiso para configurar la verificación en este servidor.",
    notAllowedManageQuestions:
      "No tienes permiso para gestionar las preguntas de verificación en este servidor.",
    noVerificationQuestions:
      "No hay preguntas de verificación configuradas para este servidor.",
    tooManyVerificationQuestions:
      "Hay demasiadas preguntas de verificación configuradas para este servidor. Los modales de Discord admiten un máximo de 5 componentes.",
    blacklistedCannotAccess:
      "Estás en la lista negra y no puedes acceder a este servidor.",
    alreadyVerifiedRoleRestored:
      "Ya habías sido verificado anteriormente. El rol de verificado se ha restaurado automáticamente.",
    targetMemberNoLongerInServer:
      "El miembro afectado ya no está en el servidor.",
    imageRequired: "Se requiere una imagen.",
    errorOccurred: "Ha ocurrido un error.",
    noQuestionFound: (index: number) => `No se encontró ninguna pregunta en el índice ${index}.`,
    questionUpdatedSuccessfully: (index: number) => `La pregunta ${index} se actualizó correctamente.`,
    questionDeletedSuccessfully: (index: number) => `La pregunta ${index} se eliminó correctamente.`,
    alreadyBeenVerifiedBefore : "Ya has sido verificado anteriormente. El rol @verified ha sido restaurado automáticamente.",
    userUnknownToTheBot : (targetUserId: string) => `El usuario ${targetUserId} es desconocido para el bot.`,
    NoAuthorizedServerFoundInSetupVerificationPermissions : "No se encontraron servidores autorizados en setup_verification_permissions.",
    CommandReservedByBasilic : "Este comando solo puede ser utilizado por \@basilicayakashifr",
    YouCannotConfigureMoreThanFiveQuestions : "No puedes configurar más de 5 preguntas de verificación porque los modales de Discord están limitados a 5 componentes.",
    QuestionAddedAtIndex : (index: number) => `Pregunta añadida en el índice ${index}.`,
    YouAreNotAllowedToViewVerificationQuestionsOnThisServer : "No tienes permiso para ver las preguntas de verificación en este servidor.",
    YouAreNotAllowedtoEditVerificationQuestionsOnThisServer : "No tienes permiso para editar las preguntas de verificación en este servidor",
    VerifiedUserFound: (user_id:string, username : string, verified_at : string, verified_by : string) => `
            **Usuario verificado encontrado**

            **ID de usuario:** ${user_id}
            **Nombre de usuario:** ${username}
            **Verificado el** ${verified_at}
            **Verificado por:** ${verified_by}
            `,
    globalKickHeader: (userId: string) =>`**Resultados del kick global para** \`${userId}\``,
    permissionAdded: (guildId: string) => `Permiso añadido.\n\n**ID del servidor:** ${guildId}`,
    verificationQuestionsTitle: "**Preguntas de verificación para este servidor**",
    typeLabel: "Tipo",
    requiredLabel: "Requerido",
    yes: "sí",
    no: "no",
	setupVerificationDescription: "Configurar la verificación para este servidor",
	checkVerifiedDescription: "Comprobar si un usuario está registrado en la tabla verified_users",
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
	questionIndexDescription: "Índice de la pregunta mostrado por /list-verification-questions",
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
	spamAlertChannelRequired: "Debes proporcionar un canal de alertas para activar la detección de spam.",
	spamDetectionEnabled: (channelId: string, staffRoleId: string | null) => `✅ Detección de spam activada.\nCanal de alertas: <#${channelId}>${
		staffRoleId ? `\nRol del staff: <@&${staffRoleId}>` : ""
	  }`,
	spamDetectionDisabled: "✅ Detección de spam desactivada.",
	memberPresentOnServers: (servers: string) => `📡 Miembro presente en los siguientes servidores:\n${servers}`,
	memberBlacklistedOnServers: (servers: string) => `⚠️ El usuario está en la lista negra en los siguientes servidores:\n${servers}`,
	blacklistMemberSavedButKickFailed: (userId: string, username: string) => `⚠️ ${username} (${userId}) fue añadido a la lista negra, pero no pudo ser expulsado del servidor.`,
  blacklistMemberSuccess: (userId: string, username: string) => `✅ ${username} (${userId}) fue añadido a la lista negra y expulsado del servidor.`,
  spamInfoNombre : "Número de mensajes a partir del cual se activa una alerta",
  spamInfoDuree : "Duración en segundos de la ventana de detección",
  DelaiDescriptionCommande : "Tiempo en horas para enviar las respuestas de verificación",
  ViewVeriicationsetup: (verifiedRoleDisplay : string, staffRoleDisplay : string, verification_timeout_hours : number) =>  `**Configuración actual de la verificación**

1) Rol utilizado para verificar a los miembros : ${verifiedRoleDisplay}
2) Rol utilizado para notificar al equipo de moderación : ${staffRoleDisplay}
3) Tiempo máximo permitido para iniciar la verificación : ${verification_timeout_hours} hora(s)`,
NotAuthorizedServer: "El servidor no ha sido autorizado, es imposible usar ningún comando",
};

const es_out = {
  YourVerifiedStatusRestored: (guild_name : string) => `Hola, tu estado verificado en **${guild_name}** ha sido restaurado automáticamente.`,
  YourVerifiedStatusAccepted : (guild_name : string) => `Hola, tu verificación en **${guild_name}** ha sido aceptada. El rol @verified te ha sido asignado.`,
  YourVerifiedStatusDenied : (guild_name : string) => `Hola, tu solicitud de verificación en **${guild_name}** ha sido rechazada.`,
  YourVerifiedStatusDeniedAndBlackedListed : (guild_name : string) => `Hola, tu solicitud de verificación en **${guild_name}** ha sido rechazada y tu cuenta ha sido incluida en la lista negra.`,
  MsgBlacklisted : (guild_name : string) => `Hola, estás en la lista negra y no puedes unirte a **${guild_name}**.`,
  YourVerifiedStatusDeniedAndBlackedListedWithReason: (guildName: string, reason: string) => `❌ Tu solicitud de verificación para ${guildName} fue rechazada y has sido incluido en la lista negra.\nMotivo: ${reason}`,
  YourVerifiedStatusDeniedWithReason: (guildName: string, reason: string) => `❌ Tu solicitud de verificación para ${guildName} fue rechazada.\nMotivo: ${reason}`,
  verificationTimeoutDM: (guildName: string) => `Has sido expulsado de **${guildName}** porque no completaste la verificación a tiempo.`,
};

const es_server = {
  startVerificationButton: "Iniciar verificación",
  startVerificationMessage: "Haz clic en el botón de abajo para comenzar tu verificación.",

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

  newVerificationRequest: "Nueva solicitud de verificación.",
  memberLabel: "Miembro",
  tagLabel: "Etiqueta",
  accountCreatedOnLabel: "Cuenta creada el",
  accountAgeLabel: "Antigüedad de la cuenta",

  verificationWaiting: (staffRoleId: string) => `<@&${staffRoleId}> hay una solicitud de verificación en espera.`,
  verificationAcceptedBy: (staffId: string, targetId: string) => `✅ Verificación aceptada por <@${staffId}> para <@${targetId}>.`,
  verificationDeniedBy: (staffId: string, targetId: string) => `❌ Verificación rechazada por <@${staffId}> para <@${targetId}>.`,
  userBlacklistedBy: (staffId: string, targetId: string) =>`⛔ El usuario <@${targetId}> ha sido puesto en la lista negra por <@${staffId}>.`,
  
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
  spamAlertMessage: "actividad sospechosa detectada, se recomienda revisión manual.",
  discussMemberButton: "Hablar con el miembro", 
  discussionChannelIntro: (targetId: string) => `Este canal privado permite al staff comunicarse con <@${targetId}> sobre su solicitud de verificación.`,
  discussionChannelAlreadyExists: (channelId: string) => `Ya existe un canal de discusión: <#${channelId}>`,
  discussionChannelCreated: (channelId: string) => `Canal de discusión creado: <#${channelId}>`,
  discussionChannelNamePrefix: "verification-discussion",
  verificationTimeoutKickReason: "Tiempo de verificación excedido",
  verificationTimeoutDM: (guildName: string) => `Has sido expulsado de **${guildName}** porque no completaste la verificación a tiempo.`,
  verificationTimeoutDisabled: "No hay tiempo de verificación configurado",
  verificationTimeoutSet: (hours: number) => `Tiempo de verificación configurado a ${hours} hora(s).`,
  spamFalsePositiveConfirmed: "✅ Falso positivo confirmado.",
  spamUserBanned: "🔨 Usuario baneado.",
};

const es_internal = {
  kickReasonBlacklistedStart : "Usuario en lista negra intentó iniciar la verificación",
  kickReasonAuto: "Usuario en lista negra expulsado automáticamente al entrar",
  kickReasonDenied: "Verificación rechazada por el staff",
  kickReasonBlacklisted: "User blacklisted by staff during verification",
  memberAlreadyVerifiedPreviously:"Miembro ya verificado anteriormente",
  blacklistedDuringVerification:"Puesto en lista negra durante la verificación",
  verifiedBy: (staffTag: string) =>`Verificado por ${staffTag}`,
  globalKickRequestedBy: (staffTag: string) =>`Expulsión global solicitada por ${staffTag}`,
  kickReasonBlacklistedWithReason: (reason: string) => `Incluido en la lista negra durante la verificación: ${reason}`,
  kickReasonDeniedWithReason: (reason: string) => `Verificación rechazada: ${reason}`,
  spamDuplicateText: (n: number) => `Texto idéntico enviado ${n} veces`,
  spamChannelsTouched: (n: number) => `Canales afectados: ${n}`,
  verificationTimeoutKickReason: "Tiempo de verificación excedido",
  verificationChannelClosed: "Decisión de verificación finalizada",
  blacklistKickReason: (moderatorTag: string, reason?: string) => `Incluido en la lista negra por ${moderatorTag}${reason ? ` | Motivo: ${reason}` : ""}`,
  spamBanReason: (moderatorTag: string) => `Spam confirmado por ${moderatorTag}`,
};

export default {es_in, es_out, es_server, es_internal};