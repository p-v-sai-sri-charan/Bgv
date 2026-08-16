export interface SendResult {
  success: boolean;
  error?: string;
}

export interface EmailProvider {
  name: string;
  send(input: { to: string; subject: string; body: string }): Promise<SendResult>;
}

export interface WhatsAppProvider {
  name: string;
  send(input: { to: string; body: string }): Promise<SendResult>;
}
