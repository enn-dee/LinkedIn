import { mailtrapclient, sender } from "../lib/mailtrap.js";
import {
  createCommentNotificationEmailTemplate,
  createWelcomeEmailTemplate,
} from "./emailTemplates.js";

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
    throw error;
  }
};

export const sendCommentNotificationEmail = async (
  recipientEmail,
  recipientName,
  commenterName,
  postUrl,
  commentContent
) => {
  const recipient = [{ recipientEmail }];
  try {
    const response = await mailtrapclient.send({
      from: sender,
      to: recipient,
      subject: "New Comment on Your Post",
      html: createCommentNotificationEmailTemplate(
        recipientName,
        commenterName,
        postUrl,
        commentContent
      ),
      category: "comment",
    });
    console.log(`email sent successfully: ${response}`);
  } catch (error) {
    throw error;
  }
};
