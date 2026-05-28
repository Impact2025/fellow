import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "missing");
}

export const FROM_ADDRESS = "Haven <noreply@fellow-travellers.com>";

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
