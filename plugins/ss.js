const axios = require("axios");
const matchCommand = require("../lib/matchCommand");

module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
  if (!matchCommand(text, "ss")) return;

  const url = text.slice(text.indexOf("ss") + 2).trim();
  if (!url.startsWith("https")) {
    return sock.sendMessage(from, { text: "🖼️ *Usa:* .ss <url>" }, { quoted: msg });
  }

  try {
    const ssUrl = `https://image.thum.io/get/fullpage/${encodeURIComponent(url)}`;
    await sock.sendMessage(from, {
      image: { url: ssUrl },
      caption: `🖼️ Imagen De: ${url}`,
    }, { quoted: msg });
  } catch {
    await sock.sendMessage(from, { text: "❌ No Se Pudo Revisar El URL." }, { quoted: msg });
  }
};
