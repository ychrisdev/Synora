export function resetPasswordTemplate(
  resetUrl: string,
  expiryMinutes: number
) {
  return `
  <div
    style="
      max-width:480px;
      margin:0 auto;
      padding:32px 24px;
      font-family:Arial,sans-serif;
      color:#111827;
      line-height:1.6;
    "
  >
    <h2 style="margin:0 0 20px;font-size:24px;color:#111827;">
      Đặt lại mật khẩu
    </h2>

    <p style="margin:0 0 16px;">
      Xin chào,
    </p>

    <p style="margin:0 0 16px;">
      Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản
      <strong>Synora</strong> của bạn.
    </p>

    <p style="margin:0 0 24px;">
      Nhấn vào nút bên dưới để tạo mật khẩu mới.
    </p>

    <div style="text-align:center;margin:32px 0;">
      <a
        href="${resetUrl}"
        style="
          display:inline-block;
          background:#2563eb;
          color:#ffffff;
          text-decoration:none;
          padding:12px 24px;
          border-radius:8px;
          font-weight:600;
          font-size:15px;
        "
      >
        Đặt lại mật khẩu
      </a>
    </div>

    <p style="margin:0 0 16px;">
      Liên kết này sẽ hết hạn sau
      <strong>${expiryMinutes} phút</strong>
      và chỉ có thể sử dụng <strong>một lần</strong>.
    </p>

    <p style="margin:0 0 16px;">
      Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.
      Mật khẩu hiện tại của bạn sẽ không bị thay đổi.
    </p>

    <hr
      style="
        margin:32px 0;
        border:none;
        border-top:1px solid #e5e7eb;
      "
    />

    <p
      style="
        margin:0 0 8px;
        font-size:13px;
        color:#6b7280;
      "
    >
      Nếu nút trên không hoạt động, hãy sao chép và mở liên kết sau:
    </p>

    <p
      style="
        margin:0;
        font-size:13px;
        word-break:break-all;
      "
    >
      <a
        href="${resetUrl}"
        style="color:#2563eb;text-decoration:none;"
      >
        ${resetUrl}
      </a>
    </p>

    <p style="margin:32px 0 0;">
      Trân trọng,<br />
      <strong>Đội ngũ Synora</strong>
    </p>

    <p
      style="
        margin-top:32px;
        padding-top:20px;
        border-top:1px solid #f3f4f6;
        text-align:center;
        font-size:12px;
        color:#9ca3af;
      "
    >
      © ${new Date().getFullYear()} Synora. All rights reserved.
    </p>
  </div>
  `;
}