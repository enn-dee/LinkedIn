import { mailtrapclient, sender } from "../lib/mailtrap.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapclient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to LinkedIn Alt.",
      html: createWelcomeEmailTemplate(name, profileUrl),
      category: "welcome",
    });
    console.log(`Welcome email sent successfully: ${response}`);
  } catch (error) {
    throw error
  }
};
