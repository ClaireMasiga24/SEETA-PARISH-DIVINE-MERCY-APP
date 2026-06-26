import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Divine Mercy Seeta <noreply@divinemercyseeta.org>";
const FROM_NAME = "Divine Mercy Seeta Parish";

interface WelcomeEmailParams {
  name: string;
  email: string;
}

/**
 * Send a beautifully branded welcome email confirming system initialization
 * and Administrator account creation.
 */
export async function sendWelcomeEmail({ name, email }: WelcomeEmailParams) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to Divine Mercy Seeta — System Initialized",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Georgia, 'Times New Roman', Times, serif;
      background-color: #f5f0e8;
      color: #0b132b;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 24px;
    }
    .header {
      text-align: center;
      padding-bottom: 32px;
      border-bottom: 1px solid rgba(201, 168, 76, 0.3);
    }
    .header img {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      margin-bottom: 16px;
      border: 3px solid rgba(201, 168, 76, 0.3);
    }
    .header h1 {
      font-size: 24px;
      font-weight: 700;
      color: #0b132b;
      letter-spacing: 0.02em;
    }
    .header .motto {
      font-size: 14px;
      font-style: italic;
      color: #b48c3c;
      margin-top: 6px;
    }
    .body-content {
      padding: 32px 0;
    }
    .body-content h2 {
      font-size: 20px;
      font-weight: 600;
      color: #0b132b;
      margin-bottom: 16px;
    }
    .body-content p {
      font-size: 16px;
      color: #253b5c;
      margin-bottom: 16px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #c9a84c;
      margin-bottom: 8px;
    }
    .details-box {
      background: #fdfcfa;
      border: 1px solid rgba(201, 168, 76, 0.2);
      border-radius: 8px;
      padding: 24px;
      margin: 24px 0;
    }
    .details-box dt {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #b48c3c;
      margin-bottom: 2px;
    }
    .details-box dd {
      font-size: 16px;
      font-weight: 500;
      color: #0b132b;
      margin-bottom: 16px;
    }
    .details-box dd:last-child { margin-bottom: 0; }
    .blessing {
      font-size: 14px;
      font-style: italic;
      color: #3b5680;
      border-left: 3px solid #c9a84c;
      padding-left: 16px;
      margin: 24px 0;
    }
    .footer {
      text-align: center;
      padding-top: 32px;
      border-top: 1px solid rgba(201, 168, 76, 0.2);
      font-size: 13px;
      color: #3b5680;
    }
    .footer .cross {
      color: #c9a84c;
      font-size: 18px;
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://divinemercyseeta.vercel.app/Images/SEETA%20PARISH%20DIVINE%20MERCY.png" alt="Divine Mercy" />
      <h1>Divine Mercy Seeta Parish</h1>
      <p class="motto">Jesus, I Trust In You</p>
    </div>

    <div class="body-content">
      <p class="greeting">Dear ${name},</p>

      <h2>The Sanctuary Is Open</h2>

      <p>
        By the grace of God and the intercession of Saint Faustina, we are
        overjoyed to announce that the <strong>Divine Mercy Seeta Parish
        System</strong> has been successfully initialized.
      </p>

      <p>
        You have been registered as the <strong>Administrator</strong> of this
        sacred digital sanctuary — a steward entrusted with guiding our
        community in faith, fellowship, and devotion.
      </p>

      <div class="details-box">
        <dl>
          <dt>Account</dt>
          <dd>Administrator</dd>
          <dt>Email</dt>
          <dd>${email}</dd>
          <dt>Status</dt>
          <dd style="color: #2d6a4f;">Active</dd>
        </dl>
      </div>

      <div class="blessing">
        "Jesus, I trust in You." — Saint Faustina Kowalska
      </div>

      <p>
        May the Divine Mercy of Our Lord Jesus Christ guide you as you lead
        our community. You may now log in and begin building the spiritual
        home for the faithful of Seeta Parish.
      </p>

      <p style="margin-top: 24px;">
        With prayers and blessings,<br />
        <strong>The Divine Mercy Seeta Parish Team</strong>
      </p>
    </div>

    <div class="footer">
      <div class="cross">&#10013;</div>
      <p>Divine Mercy Seeta Parish &bull; Seeta, Uganda</p>
      <p style="margin-top: 4px;">
        <em>Jesus, I Trust In You</em>
      </p>
    </div>
  </div>
</body>
</html>
      `,
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    // Non-blocking — system initialization still succeeds even if email fails
  }
}

interface ResetEmailParams {
  name: string;
  email: string;
  resetLink: string;
}

/**
 * Send a password reset email with a secure link.
 */
export async function sendPasswordResetEmail({ name, email, resetLink }: ResetEmailParams) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset Your Password — Divine Mercy Seeta",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Georgia, 'Times New Roman', Times, serif;
      background-color: #f5f0e8;
      color: #0b132b;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 24px;
    }
    .header {
      text-align: center;
      padding-bottom: 32px;
      border-bottom: 1px solid rgba(201, 168, 76, 0.3);
    }
    .header img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-bottom: 12px;
      border: 3px solid rgba(201, 168, 76, 0.3);
    }
    .header h1 {
      font-size: 20px;
      font-weight: 700;
      color: #0b132b;
      letter-spacing: 0.02em;
    }
    .header .motto {
      font-size: 13px;
      font-style: italic;
      color: #b48c3c;
      margin-top: 4px;
    }
    .body-content { padding: 32px 0; }
    .body-content h2 {
      font-size: 18px;
      font-weight: 600;
      color: #0b132b;
      margin-bottom: 16px;
    }
    .body-content p {
      font-size: 15px;
      color: #253b5c;
      margin-bottom: 16px;
    }
    .greeting {
      font-size: 16px;
      font-weight: 600;
      color: #c9a84c;
      margin-bottom: 8px;
    }
    .reset-btn {
      display: inline-block;
      margin: 24px 0;
      padding: 14px 36px;
      background: linear-gradient(135deg, #E8C462, #C9A84C);
      color: #0b132b !important;
      text-decoration: none;
      font-size: 15px;
      font-weight: 600;
      border-radius: 40px;
      letter-spacing: 0.04em;
    }
    .warning {
      font-size: 12px;
      color: #3b5680;
      border-left: 3px solid #c9a84c;
      padding-left: 14px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding-top: 32px;
      border-top: 1px solid rgba(201, 168, 76, 0.2);
      font-size: 12px;
      color: #3b5680;
    }
    .footer .cross { color: #c9a84c; font-size: 16px; margin-bottom: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://divinemercyseeta.vercel.app/Images/SEETA%20PARISH%20DIVINE%20MERCY.png" alt="Divine Mercy" />
      <h1>Divine Mercy Seeta Parish</h1>
      <p class="motto">Jesus, I Trust In You</p>
    </div>
    <div class="body-content">
      <p class="greeting">Dear ${name},</p>
      <h2>Password Reset Request</h2>
      <p>
        We received a request to reset the password for your parish account.
        Click the button below to set a new password. This link expires in 15 minutes.
      </p>
      <div style="text-align:center;">
        <a href="${resetLink}" class="reset-btn">Reset Password</a>
      </div>
      <div class="warning">
        If you did not request a password reset, please ignore this email.
        Your account remains secure.
      </div>
      <p>
        If the button above does not work, copy and paste this link into your browser:
      </p>
      <p style="font-size:12px; word-break:break-all; color:#3b5680;">
        ${resetLink}
      </p>
    </div>
    <div class="footer">
      <div class="cross">&#10013;</div>
      <p>Divine Mercy Seeta Parish &bull; Seeta, Uganda</p>
      <p style="margin-top:4px;"><em>Jesus, I Trust In You</em></p>
    </div>
  </div>
</body>
</html>
      `,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw error;
  }
}
