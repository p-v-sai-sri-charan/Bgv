import "server-only";

import type { KycProvider } from "./types";
import { MockKycProvider } from "./mock-provider";

export type { KycProvider, KycVerificationInput, KycVerificationResult } from "./types";

/**
 * Provider registry. Add a real vendor by implementing `KycProvider` (see
 * mock-provider.ts for the shape) and registering it here, then set
 * KYC_PROVIDER to its key.
 */
function resolveProvider(): KycProvider {
  const providerKey = process.env.KYC_PROVIDER ?? "mock";
  switch (providerKey) {
    case "mock":
      return new MockKycProvider();
    default:
      throw new Error(
        `Unknown KYC_PROVIDER "${providerKey}". Only "mock" is wired up today — ` +
          `implement KycProvider and register it in src/lib/kyc/index.ts to add a real vendor.`,
      );
  }
}

export const kycProvider = resolveProvider();
