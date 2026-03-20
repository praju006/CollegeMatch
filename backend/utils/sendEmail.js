import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (toEmail, resetLink) => {
  const mailOptions = {
    from: `"CollegeMatch" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset Your CollegeMatch Password",
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"/></head>
        <body style="margin:0;padding:0;background:#f6f7f8;font-family:'DM Sans',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f8;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                  <!-- header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#0b2647,#565699);padding:32px 40px;text-align:center;">
                      <span style="color:white;font-size:22px;font-weight:800;">College<span style="color:#f4c542;">Match</span></span>
                    </td>
                  </tr>

                  <!-- body -->
                  <tr>
                    <td style="padding:40px 40px 32px;">
                      <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0b2647;">Reset your password</h1>
                      <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
                        We received a request to reset your CollegeMatch password. Click the button below — this link expires in <strong>1 hour</strong>.
                      </p>

                      <div style="text-align:center;margin:32px 0;">
                        <a href="${resetLink}"
                          style="display:inline-block;background:linear-gradient(135deg,#0b2647,#565699);color:white;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:50px;">
                          Reset Password →
                        </a>
                      </div>

                      <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;text-align:center;">Or copy this link:</p>
                      <p style="margin:0 0 24px;font-size:12px;color:#565699;word-break:break-all;text-align:center;background:#f0f0fa;padding:12px;border-radius:8px;">
                        ${resetLink}
                      </p>

                      <hr style="border:none;border-top:1px solid #f1f5f9;margin:24px 0;"/>
                      <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">
                        If you didn't request this, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>

                  <!-- footer -->
                  <tr>
                    <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #f1f5f9;">
                      <p style="margin:0;font-size:12px;color:#94a3b8;">© 2025 CollegeMatch · AI-Powered College Discovery for India</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};