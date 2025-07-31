const fs = require("fs");
const path = require("path");
const matchCommand = require("../lib/matchCommand");

const quotes = [
  "La mayor gloria de vivir no radica en nunca caer, sino en levantarse cada vez que caemos. — Nelson Mandela",
  "La forma de empezar es dejar de hablar y empezar a hacer. — Walt Disney",
  "Tu tiempo es limitado, así que no lo malgastes viviendo la vida de otra persona. — Steve Jobs",
  "La vida es una aventura atrevida o no es nada en absoluto. — Helen Keller",
  "Extiende el amor por donde quiera que vayas. — Madre Teresa",
  "El éxito no es definitivo; el fracaso no es fatal: es el coraje de continuar lo que cuenta. — Winston Churchill",
  "Motivar es algo que cualquiera puede hacer, pero llevarlo a cabo es lo difícil. — Zara 🧜‍♀️",
  "El futuro pertenece a aquellos que creen en la belleza de sus sueños. — Eleanor Roosevelt",
  "Sigue sonriendo, porque la vida es algo hermoso. — Marilyn Monroe",
  "Solo pasas por esta vida una vez, no vuelves para un bis. — Elvis Presley"
];

function formatUptime(ms) {
  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((ms % (1000 * 60)) / 1000);
  return `${h}h ${m}m ${s}s`;
}

let startTime = Date.now();

module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
  if (!matchCommand(text, "alive")) return;

  try {
    const imagePath = path.join(__dirname, "../media/menu3.jpg");
    const image = fs.existsSync(imagePath)
      ? fs.readFileSync(imagePath)
      : "https://telegra.ph/file/265c672094dfa87caea19.jpg";

    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const uptime = formatUptime(Date.now() - startTime);

    const caption = `╭── *🤖 ZERO BOT IS ONLINE* ──╮

🧠 *Status:* 𝙊𝙉𝙇𝙄𝙉𝙀 ✅
⏱️ *Uptime:* ${uptime}
🧑‍💻 *Owner:* The Devil
⚙️ *Mode:* Public
📌 *Prefix:*  / ! #
📎 *Version:* 1.1

🗨️ *Quote:*
_${quote}_

╰────────────────────────╯`;

    await sock.sendMessage(from, {
      image: typeof image === "string" ? { url: image } : image,
      caption,
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Alive plugin error:", err);
    await sock.sendMessage(from, { text: "❌ Bot alive check failed." }, { quoted: msg });
  }
};
