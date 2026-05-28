import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "missing");
}

export const FROM_ADDRESS = "Haven <hello@fellow-travellers.com>";

export async function sendMagicLinkEmail(
  to: string,
  magicUrl: string
): Promise<SendResult> {
  try {
    await getResend().emails.send({
      from: FROM_ADDRESS,
      to,
      subject: "Je Haven inloglink — geldig 15 minuten",
      html: `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#F7F5F0;font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;">
  <div style="max-width:480px;margin:0 auto;">

    <div style="text-align:center;padding:40px 0 28px;">
      <div style="display:inline-flex;align-items:center;gap:10px;">
        <div style="width:40px;height:40px;background:#C8EBD4;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;">
          <span style="font-size:20px;">🛡</span>
        </div>
        <span style="font-size:22px;font-weight:700;color:#476553;letter-spacing:-0.02em;">Haven</span>
      </div>
    </div>

    <div style="background:#ffffff;border-radius:28px;padding:40px 36px;box-shadow:0 2px 12px rgba(71,101,83,0.08);">
      <h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1B1C19;letter-spacing:-0.02em;">
        Je inloglink is klaar.
      </h1>
      <p style="margin:0 0 32px;font-size:15px;color:#424843;line-height:1.65;">
        Klik op de knop hieronder om in te loggen bij Haven.
        De link is <strong>15 minuten</strong> geldig en kan maar één keer worden gebruikt.
      </p>

      <div style="text-align:center;margin-bottom:32px;">
        <a href="${magicUrl}"
           style="display:inline-block;background:#476553;color:#ffffff;padding:16px 44px;
                  border-radius:100px;font-size:16px;font-weight:600;text-decoration:none;
                  letter-spacing:0.01em;box-shadow:0 4px 16px rgba(71,101,83,0.25);">
          Open Haven &rarr;
        </a>
      </div>

      <div style="background:#F7F5F0;border-radius:14px;padding:16px 18px;">
        <p style="margin:0;font-size:12px;color:#727973;line-height:1.6;">
          <strong>🔒 Veiligheidsinfo:</strong> Haven vraagt nooit om je wachtwoord.
          Als je dit niet hebt aangevraagd, kun je deze e-mail veilig negeren —
          er is geen account aangemaakt.
        </p>
      </div>
    </div>

    <div style="text-align:center;padding:28px 0 0;">
      <p style="margin:0;font-size:12px;color:#9E9E9E;">
        Haven &middot; Privacy is your right
      </p>
      <p style="margin:4px 0 0;font-size:12px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://fellow-travellers.com"}"
           style="color:#476553;text-decoration:none;">fellow-travellers.com</a>
      </p>
    </div>

  </div>
</body>
</html>
      `.trim(),
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export interface SendResult {
  ok: boolean;
  error?: string;
}

export async function sendBackupKeyEmail(
  to: string,
  encryptedKey: string
): Promise<SendResult> {
  try {
    await getResend().emails.send({
      from: FROM_ADDRESS,
      to,
      subject: "Haven — Je herstelsleutel",
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; color: #1b1c19;">
          <div style="background: #c8ebd4; border-radius: 16px; padding: 32px; margin-bottom: 24px; text-align: center;">
            <h1 style="color: #476553; font-size: 24px; margin: 0;">Haven</h1>
          </div>
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">Je herstelsleutel</h2>
          <p style="color: #424843; line-height: 1.6; margin-bottom: 24px;">
            Bewaar deze sleutel op een veilige plek. Je hebt hem nodig om je versleutelde
            notities te herstellen op een nieuw apparaat. Wij kunnen deze sleutel
            <strong>niet</strong> opnieuw aanmaken.
          </p>
          <div style="background: #f0eee9; border-radius: 12px; padding: 20px; font-family: monospace; font-size: 14px; word-break: break-all; color: #1b1c19; margin-bottom: 24px;">
            ${encryptedKey}
          </div>
          <p style="color: #727973; font-size: 13px; line-height: 1.5;">
            Heb je dit niet aangevraagd? Negeer dan deze e-mail. Je account blijft veilig.<br/><br/>
            Haven · Privacy is your right · <a href="https://fellow-travellers.com" style="color: #476553;">fellow-travellers.com</a>
          </p>
        </div>
      `,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function sendCrisisResourcesEmail(to: string): Promise<SendResult> {
  try {
    await getResend().emails.send({
      from: FROM_ADDRESS,
      to,
      subject: "Haven — Crisis hulpbronnen",
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; color: #1b1c19;">
          <div style="background: #c8ebd4; border-radius: 16px; padding: 32px; margin-bottom: 24px; text-align: center;">
            <h1 style="color: #476553; font-size: 24px; margin: 0;">Haven</h1>
          </div>
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">Je bent niet alleen.</h2>
          <p style="color: #424843; line-height: 1.6; margin-bottom: 24px;">
            Je kunt altijd contact opnemen met een van de onderstaande hulplijnen.
            Ze zijn dag en nacht bereikbaar.
          </p>
          <div style="background: #f0eee9; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
            <strong>113 Zelfmoordpreventie (NL)</strong><br/>
            <a href="tel:113" style="color: #476553; font-size: 20px; font-weight: 700;">113</a><br/>
            <span style="color: #727973; font-size: 13px;">of chat op www.113.nl · 24/7</span>
          </div>
          <div style="background: #f0eee9; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
            <strong>Zelfmoordlijn (BE)</strong><br/>
            <a href="tel:080032123" style="color: #476553; font-size: 20px; font-weight: 700;">0800 32 123</a><br/>
            <span style="color: #727973; font-size: 13px;">of chat op www.zelfmoordlijn.be · 24/7</span>
          </div>
          <div style="background: #ffdad6; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <strong>Direct gevaar?</strong><br/>
            <a href="tel:112" style="color: #ba1a1a; font-size: 20px; font-weight: 700;">112</a>
          </div>
          <p style="color: #727973; font-size: 13px;">
            Haven · <a href="https://fellow-travellers.com" style="color: #476553;">fellow-travellers.com</a>
          </p>
        </div>
      `,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
