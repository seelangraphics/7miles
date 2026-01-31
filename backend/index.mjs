import Razorpay from "razorpay";
import crypto from "crypto";
import nodemailer from "nodemailer";

/**
 * Shared response helper
 */
const respond = (statusCode, body) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
  },
  body: JSON.stringify(body)
});

/* ------------------ clients ------------------ */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

/**
 * Lambda entry
 */
export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return respond(200, { ok: true });
  }

  const method = event.requestContext?.http?.method;
  const path = event.rawPath;

  if (method !== "POST") {
    return respond(405, { message: "Method not allowed" });
  }

  let body;

  if (!event.body) {
  return respond(400, { message: "Request body is required" });
}

  try {
    body = JSON.parse(event.body);
  } catch {
    return respond(400, { message: "Invalid JSON body" });
  }

  try {
    if (path === "/order") {
      return await createOrder(body);
    }

    if (path === "/order/validate") {
      return validateOrder(body);
    }

    if (path === "/send-email") {
      return await sendEmail(body);
    }

    return respond(404, { message: "Route not found" });
  } catch (error) {
    console.error("Payment service error:", error);
    return respond(500, { message: "Internal server error" });
  }
};

/**
 * Create order
 */
const createOrder = async (payload) => {
  if (!payload || Object.keys(payload).length === 0) {
    return respond(400, { message: "Request body is required" });
  }

  const order = await razorpay.orders.create(payload);

  return respond(200, order);
};

/**
 * Validate order
 */
const validateOrder = (payload) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = payload;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    return respond(400, {
      message: "Missing payment verification fields"
    });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return respond(400, {
      success: false,
      message: "Invalid payment signature"
    });
  }

  return respond(200, {
    success: true,
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id
  });
};


/* ------------------ send email ------------------ */

const sendEmail = async (payload) => {
  const {
    to,
    subject,
    message,        
    attachments     
  } = payload;

  if (!to || !subject || !message) {
    return respond(400, { message: "to, subject and message are required" });
  }

  const mailOptions = {
    from: `"Shop@7miles.co.in" <${process.env.GMAIL_USER}>`,
    cc: process.env.DEFAULT_CC_EMAIL,
    to,
    subject,
    html: message,
    attachments: (attachments || []).map((a) => ({
      filename: a.filename,
      content: a.content,
      encoding: "base64",
      contentType: a.mimetype
    }))
  };

  try {
    await transporter.sendMail(mailOptions);
    return respond(200, { sent: true });
  } catch (err) {
    console.error("Email send failed:", err);
    return respond(500, { sent: false, message: "Email failed" });
  }
};
