import type { EmailProvider, SendResult, WhatsAppProvider } from "./types";

/**
 * Default stand-in providers: log to stdout instead of hitting a real vendor.
 * Every message still gets written to NotificationLog by the caller, so the
 * full delivery pipeline is exercised end to end.
 */
export class ConsoleEmailProvider implements EmailProvider {
  name = "console";

  async send(input: {
    to: string;
    subject: string;
    body: string;
  }): Promise<SendResult> {
    console.log(
      `[email:console] to=${input.to} subject="${input.subject}"\n${input.body}`,
    );
    return { success: true };
  }
}

export class ConsoleWhatsAppProvider implements WhatsAppProvider {
  name = "console";

  async send(input: { to: string; body: string }): Promise<SendResult> {
    console.log(`[whatsapp:console] to=${input.to}\n${input.body}`);
    return { success: true };
  }
}
