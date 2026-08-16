import "server-only";

import { NotificationChannel, NotificationEvent } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { emailProvider, whatsappProvider } from "./providers";

export interface NotifyInput {
  caseId?: string;
  event: NotificationEvent;
  channel: NotificationChannel;
  recipient: string;
  subject?: string;
  body: string;
}

export async function sendNotification(input: NotifyInput) {
  const log = await prisma.notificationLog.create({
    data: {
      caseId: input.caseId,
      event: input.event,
      channel: input.channel,
      recipient: input.recipient,
      subject: input.subject,
      body: input.body,
      status: "QUEUED",
    },
  });

  const result =
    input.channel === NotificationChannel.EMAIL
      ? await emailProvider.send({
          to: input.recipient,
          subject: input.subject ?? "Notification",
          body: input.body,
        })
      : await whatsappProvider.send({ to: input.recipient, body: input.body });

  return prisma.notificationLog.update({
    where: { id: log.id },
    data: {
      status: result.success ? "SENT" : "FAILED",
      sentAt: result.success ? new Date() : null,
      error: result.error,
    },
  });
}

/** Sends the same body over both email and WhatsApp (when a phone is known) to one recipient. */
export async function notifyBothChannels(input: {
  caseId?: string;
  event: NotificationEvent;
  email: string;
  phone?: string | null;
  subject: string;
  body: string;
}) {
  const results = [
    await sendNotification({
      caseId: input.caseId,
      event: input.event,
      channel: NotificationChannel.EMAIL,
      recipient: input.email,
      subject: input.subject,
      body: input.body,
    }),
  ];

  if (input.phone) {
    results.push(
      await sendNotification({
        caseId: input.caseId,
        event: input.event,
        channel: NotificationChannel.WHATSAPP,
        recipient: input.phone,
        body: input.body,
      }),
    );
  }

  return results;
}
