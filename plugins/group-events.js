const fs = require("fs");
const path = require("path");

// Prevent multiple listeners from being attached
let groupEventsRegistered = false;

module.exports = async (sock) => {
  if (groupEventsRegistered) return;
  groupEventsRegistered = true;

  sock.ev.on("group-participants.update", async (update) => {
    try {
      const metadata = await sock.groupMetadata(update.id);
      const participants = update.participants;

      for (const participant of participants) {
        const user = participant.split("@")[0];
        let ppImage;

        try {
          const url = await sock.profilePictureUrl(participant, "image");
          ppImage = { url };
        } catch {
          ppImage = fs.readFileSync("./media/avatar.jpg"); // fallback to local image
        }

        if (update.action === "add") {
          const welcomeCaption = `👋 Bienvenido/a @${user} Al Grupo *${metadata.subject}*! 😄\n\nRecuerda usar El comando "menu" para ver mis comandos.`;
          await sock.sendMessage(update.id, {
            image: ppImage,
            caption: welcomeCaption,
            mentions: [participant],
          });
        }

        if (update.action === "remove") {
          const putoCaption = `👋 @${user} Se Fue Echado De Aca *${metadata.subject}*.\nPor Gai`;
          await sock.sendMessage(update.id, {
            image: ppImage,
            caption: putoCaption,
            mentions: [participant],
          });
        }
        
        if (update.action === "leave") {
          const adiosCaption = `👋 @${user} Se Fue De *${metadata.subject}*.\nSe Le Va A Extrañar.`;
          await sock.sendMessage(update.id, {
            image: ppImage,
            caption: adiosCaption,
            mentions: [participant],
          });
        }
      }
    } catch (err) {
      console.error("❌ group-participants.update error:", err);
    }
  });
};
