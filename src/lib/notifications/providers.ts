import "server-only";

import type { EmailProvider, WhatsAppProvider } from "./types";
import { ConsoleEmailProvider, ConsoleWhatsAppProvider } from "./console-provider";

/**
 * Add a real vendor by implementing EmailProvider/WhatsAppProvider (e.g. a
 * SendGrid or AWS SES class, a Twilio or WhatsApp Cloud API class) and
 * registering it below, then point EMAIL_PROVIDER / WHATSAPP_PROVIDER at it.
 */
function resolveEmailProvider(): EmailProvider {
  const key = process.env.EMAIL_PROVIDER ?? "console";
  switch (key) {
    case "console":
      return new ConsoleEmailProvider();
    default:
      throw new Error(
        `Unknown EMAIL_PROVIDER "${key}". Only "console" is wired up today — ` +
          `implement EmailProvider and register it in src/lib/notifications/providers.ts to add a real vendor.`,
      );
  }
}

function resolveWhatsAppProvider(): WhatsAppProvider {
  const key = process.env.WHATSAPP_PROVIDER ?? "console";
  switch (key) {
    case "console":
      return new ConsoleWhatsAppProvider();
    default:
      throw new Error(
        `Unknown WHATSAPP_PROVIDER "${key}". Only "console" is wired up today — ` +
          `implement WhatsAppProvider and register it in src/lib/notifications/providers.ts to add a real vendor.`,
      );
  }
}

export const emailProvider = resolveEmailProvider();
export const whatsappProvider = resolveWhatsAppProvider();
