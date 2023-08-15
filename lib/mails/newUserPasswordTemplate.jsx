const forgotPasswordTemplate = (name, verify_email_code) => {
	const fronturi =
		process.env.NODE_ENV === "development"
			? "http://localhost:3000"
			: process.env.FRONTEND_URL;
	return `
    <div style="background-color: #f5f5f5;font-family: 'Nunito', sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
            <tbody>
                <tr>
                    <td align="center">
                    </td>
                </tr>
            </tbody>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
            <tbody>
                <tr>
                    <td>
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;margin: 0 auto;max-width: 600px;padding: 50px;border-width: 1px;border-radius: 0.25rem;border-color: #e5e7eb;border-style: solid;">
                            <tbody>
                                <tr>
                                    <td width="100%" cellpadding="0" cellspacing="0">
                                        <p style="color: rgb(107 114 128);font-weight: 300;font-size: 1.25rem;line-height: 1.25;letter-spacing: -0.025em;">Hi ${name}!</p>
                                        <p style="color: rgb(107 114 128); font-weight: 300; font-size: 0.875rem; line-height: 1.25rem;">It seems like someone invited you to belong to his Texpress. To set your password, click the button below.</p>
                                        <div style="display:block; text-align: center"><a href="${fronturi}/tp-resetpass?resetToken=${verify_email_code}" target="_blank" style="padding-top: 0.625rem;padding-bottom: 0.625rem;text-align: center;font-weight: 500; background-color: rgb(33 150 243);border-radius: 0.5rem;width: 80%;display: inline-block; color: rgb(255 255 255);text-decoration: none;font-size: 0.875rem;line-height: 1.25rem;">SET PASSWORD</a></div>
                                        <p style="color: rgb(107 114 128); font-weight: 300; font-size: 0.875rem; line-height: 1.25rem;">If you don't recognize this invite, don't worry, you can delete this email.</p>
                                        <p style="color: rgb(107 114 128); font-weight: 300; font-size: 0.875rem; line-height: 1.25rem;">This password set link will be active for 1 hour after its creation.</p>
                                        <hr>
                                        <p style="color: rgb(107 114 128); font-weight: 300; font-size: 0.875rem; line-height: 1.25rem;">If you're having trouble clicking the "Set Password" button, copy the following link and open it in your browser: ${fronturi}/tp-resetpass?resetToken=${verify_email_code}</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `;
};

export default forgotPasswordTemplate;
