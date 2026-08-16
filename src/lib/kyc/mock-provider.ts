import type {
  KycProvider,
  KycVerificationInput,
  KycVerificationResult,
} from "./types";

const AADHAR_PATTERN = /^\d{12}$/;
const PAN_PATTERN = /^[A-Z]{5}\d{4}[A-Z]$/;

/**
 * Deterministic stand-in for a real KYC vendor (Karza / Signzy / IDfy /
 * Surepass, etc). It only checks document-number format so demos are
 * reproducible. Swap in a real HTTP-backed provider behind the same
 * `KycProvider` interface and switch `KYC_PROVIDER` to enable it.
 */
export class MockKycProvider implements KycProvider {
  name = "mock";

  async verify(
    input: KycVerificationInput,
  ): Promise<KycVerificationResult> {
    const pattern =
      input.documentType === "AADHAR" ? AADHAR_PATTERN : PAN_PATTERN;
    const formatValid = pattern.test(input.documentNumber);

    if (!formatValid) {
      return {
        outcome: "FAILED",
        providerName: this.name,
        message: `${input.documentType} number failed format validation`,
        raw: { documentNumber: input.documentNumber, formatValid },
      };
    }

    return {
      outcome: "VERIFIED",
      providerName: this.name,
      message: `${input.documentType} verified against mock registry`,
      raw: {
        documentNumber: input.documentNumber,
        nameMatch: true,
        formatValid,
      },
    };
  }
}
