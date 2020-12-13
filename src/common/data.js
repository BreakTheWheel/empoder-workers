function getEmailTemplate(content) {
  return `
  <!doctype html>
  <html>
     <head>
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style>
           @media only screen and (max-width: 830px) {
           table[class=body] h1 {
           font-size: 28px !important;
           margin-bottom: 10px !important;
           }
           img {
           width: 90px !important;
           }
           table[class=body] p,
           table[class=body] ul,
           table[class=body] ol,
           table[class=body] td,
           table[class=body] span,
           table[class=body] a {
           font-size: 16px !important;
           }
           table[class=body] .wrapper,
           table[class=body] .article {
           padding: 10px !important;
           }
           table[class=body] .content {
           padding: 0 !important;
           }
           table[class=body] .container {
           padding: 0 !important;
           width: 100% !important;
           }
           table[class=body] .main {
           border-left-width: 0 !important;
           border-radius: 0 !important;
           border-right-width: 0 !important;
           }
           table[class=body] .btn table {
           width: 100% !important;
           }
           table[class=body] .btn a {
           width: 100% !important;
           }
           table[class=body] .img-responsive {
           height: auto !important;
           max-width: 100% !important;
           width: auto !important;
           }
           .wrapper {
           padding: 20px !important;
           }
           }
           @media (max-width: 600px) {
           table[class=body] p,
           table[class=body] ul,
           table[class=body] ol,
           table[class=body] td,
           table[class=body] span,
           table[class=body] a {
           font-size: 14px !important;
           }
           .flex-div {
           padding-right: unset;
           padding-left: unset;
           display: unset !important;
           width: 100% !important;
           }
           .right-text {
           text-align: left !important;
           }
           .custom-div {
           width: 45% !important;
           }
           .custom-div.first-child {
           margin-right: 5% !important;
           }
           }
           /* -------------------------------------
           PRESERVE THESE STYLES IN THE HEAD
           ------------------------------------- */
           @media all {
           .ExternalClass {
           width: 100%;
           }
           .ExternalClass,
           .ExternalClass p,
           .ExternalClass span,
           .ExternalClass font,
           .ExternalClass td,
           .ExternalClass div {
           line-height: 100%;
           }
           .apple-link a {
           color: inherit !important;
           font-family: inherit !important;
           font-size: inherit !important;
           font-weight: inherit !important;
           line-height: inherit !important;
           text-decoration: none !important;
           }
           #MessageViewBody a {
           color: inherit;
           text-decoration: none;
           font-size: inherit;
           font-family: inherit;
           font-weight: inherit;
           line-height: inherit;
           }
           }
        </style>
     </head>
     <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
        <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
           ${content}
        </table>
     </body>
  </html>
  `
}

module.exports = {
  htmlTemplates: {
    passwordResetRequest: {
      subject: 'Reset password',
      body: uniqueId => {
        const content = `
        <tr>
        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
        <td class="container"
           style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 800px; padding: 10px; width: 800px; margin-top: 50px !important;">
           <div class="content"
              style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 800px; padding: 10px;">
              <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Password reset for empoder.com.</span>
              <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #253270; border-radius: 3px; border: 1px solid #434779; color: white;">
                 <tr>
                    <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 40px;">
                       <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                          <tr>
                             <td align="center">
                                <div style="width: 100%; margin-left:auto; margin-right: auto; margin-bottom: 30px;">
                                   <a href="http://empoder.com">
                                   <img style="width: 90px;" src="https://empoder.com/images/logo.png/"/>
                                   </a>
                                </div>
                             </td>
                          </tr>
                          <tr>
                             <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                                <p
                                   style="font-family: sans-serif; font-size: 24px; font-weight: normal; margin: 0; margin-bottom: 50px; text-align: center; font-weight:bold;">
                                   Reset your password for Empoder
                                </p>
                             </td>
                          </tr>
                          <tr align="center">
                             <td align="center">
                             <a href="https://empoder.com/password-reset/${uniqueId}" target="_blank">
                              <button align="center" style="
                                margin-top: 50px;
                                background: #fff;
                                border: none;
                                padding: 16px 50px;
                                border-radius: 5px;
                                cursor:pointer;"
                              >
                               Reset Your Password
                             </button>
                           </a>
                             </td>
                          </tr>
                       </table>
                    </td>
                 </tr>
              </table>
              <table align="center" border="0" cellpadding="0" cellspacing="0" class="body"
                 style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                 <tr align="center">
                    <td align="center">
                       <div align="center" style="width: 100%; margin-left:auto; margin-right: auto; margin-top: 10px;">
                          <a align="center" href="https://empoder.com/" style="color: #253270; font-weight: bold;">Empoder</a>
                       </div>
                    </td>
                 </tr>
              </table>
           </div>
        </td>
     </tr>
        `

        return getEmailTemplate(content)
      },
    },
  }

}
