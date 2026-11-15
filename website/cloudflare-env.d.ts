declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    RESEND_API_KEY?: string;
    ENQUIRY_EMAIL_FROM?: string;
    BUCKET?: R2Bucket;
  }
}
