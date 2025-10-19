import nodemailer from 'nodemailer';
const { default: User } = await import('../models/User.js');
import bcrypt from 'bcryptjs';
import Order from '../models/Order.js';

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendEmail = async ({email, emailType, userId, orderId, orderTotal, product, message }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_USERNAME,
                pass: process.env.GMAIL_PASSWORD
            }
        });
        let mailOptions;
        if(emailType === 'VERIFY') {
            const hashedToken = await bcrypt.hash(userId.toString(), 10);
            let otp = generateOTP();
            await User.findByIdAndUpdate(userId, {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000, verifyOTP: otp, verifyOTPExpiry: Date.now() + 10 * 60 * 1000});
            mailOptions = {
                from: process.env.GMAIL_USERNAME,
                to: email,
                subject: 'Verify your email',
                html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp),
            }
        }
        else if(emailType === 'RESET') {
            const hashedToken = await bcrypt.hash(userId.toString(), 10);
        	let otp = generateOTP();
        	await User.findByIdAndUpdate(userId, {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000, verifyOTP: otp, verifyOTPExpiry: Date.now() + 10 * 60 * 1000});
            mailOptions = {
                from: process.env.GMAIL_USERNAME,
                to: email,
                subject: 'Reset your password',
                html: RESET_PASSWORD_EMAIL_TEMPLATE.replace("{verificationCode}", otp),
            }
        }
        else if(emailType === 'REQUEST') {
			const user = await User.findById(userId);
			mailOptions = {
				from: process.env.GMAIL_USERNAME,
				to: email,
				subject: 'Your Order Has Been Received - Miraj Candles',
				html: ORDER_RECEIVED_EMAIL_TEMPLATE.replace("{customerName}", user.name).replace("{orderId}", `ORD-${orderId.toString().slice(-6).toUpperCase()}`).replace("{orderTotal}", orderTotal)
			}
        }
		else if(emailType === 'NEW PRODUCT') {
			const user = await User.findById(userId);
			mailOptions = {
				from: process.env.GMAIL_USERNAME,
				to: email,
				subject: '🕯️ Exclusive First Look: Our Brand-New Candle Has Arrived',
				html: NEW_PRODUCT_EMAIL_TEMPLATE
				.replace(/{customerName}/g, user.name)
				.replace(/{productName}/g, product.name)
				.replace(/{productDescription}/g, product.description)
				.replace(/{productPrice}/g, product.price)
				.replace(/{productImage}/g, product.images[0])
				.replace(/{productLink}/g, `${process.env.FRONTEND_URL}/product/${product._id}`)
			}
		}
		else if(emailType === 'CONFIRM') {
			const user = await User.findById(userId);
			const order = await Order.findById(orderId).populate('items.productId');
			let orderItemsHTML = order.items.map(item => `
				<tr style="border-bottom: 1px solid #eee;">
					<td style="padding: 10px;">${item.productId.name}</td>
					<td style="text-align: center; padding: 10px;">${item.quantity}</td>
					<td style="text-align: center; padding: 10px;">₹${item.price.toFixed(2)}</td>
					<td style="text-align: right; padding: 10px;">₹${(item.price * item.quantity).toFixed(2)}</td>
				</tr>
			`).join('');

      		let tot = 0;
      		order.items.forEach(item => tot += item.price * item.quantity);
      		const tax = order.totalAmount - tot;

      		orderItemsHTML += `
				<tr style="border-bottom: 1px solid #eee;">
				<td style="padding: 10px;">Tax</td>
				<td style="text-align: center; padding: 10px;">-</td>
				<td style="text-align: center; padding: 10px;">18%</td>
				<td style="text-align: right; padding: 10px;">₹${tax}</td>
				</tr>
			`;

			mailOptions = {
				from: process.env.GMAIL_USERNAME,
				to: email,
				subject: "🕯️ Thank You for Your Order — We've Received It!",
				html: ORDER_CONFIRMATION_EMAIL_TEMPLATE
				.replace(/{customerName}/g, user.name)
				.replace(/{orderId}/g, `ORD-${orderId.toString().slice(-6).toUpperCase()}`)
				.replace(/{deliveryPhone}/g, order.deliveryPhone)
				.replace(/{orderItems}/g, orderItemsHTML)
				.replace(/{orderTotal}/g, order.totalAmount.toFixed(2))
				.replace(/{trackingLink}/g, order.trackingLink)
			}
		}
		else if(emailType === 'PASSWORD CHANGED') {
			const user = await User.findById(userId);
			mailOptions = {
				from: process.env.GMAIL_USERNAME,
				to: email,
				subject: 'Your Password Has Been Changed - Miraj Candles',
				html: PASSWORD_CHANGED_EMAIL_TEMPLATE.replace("{userName}", user.name)
			}
		}
		else if(emailType === 'NEW ORDER') {
      		const user = await User.findById(userId);
          	const order = await Order.findById(orderId).populate('items.productId');
          	const formatDate = (dateString) => {
            	const date = new Date(dateString);
            	return date.toLocaleString("en-GB", {
              		day: "2-digit",
              		month: "short",
              		year: "numeric",
              		hour: "2-digit",
              		minute: "2-digit",
              		hour12: false
            	});
          	}
          	const itemsHtml = order.items.map(item => `
				<tr>
				<td>${item.productId.name}</td>
				<td align="center">${item.quantity}</td>
				<td align="right">₹${item.price}</td>
				</tr>
			`).join('');

          	mailOptions = {
            	from: process.env.GMAIL_USERNAME,
            	to: email,
            	subject: 'New Order Received - Miraj Candles',
            	html: NEW_ORDER_NOTIFICATION_EMAIL_TEMPLATE
				.replace('{orderId}', `ORD-${orderId.toString().slice(-6).toUpperCase()}`)
				.replace('{customerName}', user.name)
				.replace('{customerEmail}', user.email)
				.replace('{orderTotal}', order.totalAmount.toFixed(2))
				.replace('{paymentMethod}', order.paymentMethod)
				.replace('{paymentTnx', order.transactionId)
				.replace('{orderDate}', formatDate(order.date.toString()))
				.replace('{orderItems}', itemsHtml)
          	}
        }
        else if(emailType === 'QUERY') {
          	const user = await User.findById(userId);
          	mailOptions = {
				from: process.env.GMAIL_USERNAME,
				to: email,
				subject: 'Your Query Has Been Received - Miraj Candles',
				html: CUSTOMER_QUERY_RECEIVED_EMAIL_TEMPLATE
				.replace('{customerName}', user.name)
				.replace('{customerMessage}', message)
			}
        }
		else if(emailType === 'NEW QUERY') {
			const formatDate = (dateString) => {
				const date = new Date(dateString);
				return date.toLocaleString('en-GB', {
					day: '2-digit',
					month: 'short',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
					hour12: false
				});
			};

			const user = await User.findById(userId);

			mailOptions = {
				from: process.env.GMAIL_USERNAME,
				to: email,
				subject: '📩 New Customer Query Received - Miraj Candles',
				html: ADMIN_QUERY_NOTIFICATION_EMAIL_TEMPLATE
				.replace('{customerName}', user.name)
				.replace('{customerEmail}', user.email)
				.replace('{customerPhone}', user.phone || 'N/A')
				.replace('{submittedDate}', formatDate(new Date()))
				.replace('{customerMessage}', message)
			};
		}
        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;
    }
    catch(error) {
        throw new Error(error.message);
    }
}

export const resendVerificationEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        if(!user) throw new error('User not found');
        await sendEmail({
            email,
            emailType: 'VERIFY',
            userId: user._id
        });
    }
    catch(error) {
        throw new Error(error.message);
    }
}

const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email - Miraj Candles</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #fff7f3; color: #333;">
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #ff7b00, #ff4500); padding: 30px;">
              <img src="https://mirajcandles.com/logo.png" alt="Miraj Candles" width="80" style="display: block; margin-bottom: 10px;" />
              <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Verify Your Email</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px 40px;">
              <p style="font-size: 16px; margin-bottom: 15px;">Hi there,</p>
              <p style="font-size: 16px; margin-bottom: 20px;">
                Welcome to <strong>Miraj Candles</strong> — where light meets luxury.
                To complete your registration and start exploring our handcrafted candle collection, please verify your email address.
              </p>

              <div style="text-align: center; margin: 40px 0;">
                <div style="display: inline-block; background-color: #fff4e6; padding: 20px 40px; border-radius: 8px; border: 2px dashed #ff7b00;">
                  <span style="font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #ff7b00;">{verificationCode}</span>
                </div>
              </div>

              <p style="font-size: 15px; margin-bottom: 10px;">
                Enter this code on the verification page to activate your account.
              </p>
              <p style="font-size: 14px; color: #666;">
                This code will expire in <strong>15 minutes</strong> for security reasons.
              </p>

              <p style="font-size: 14px; margin-top: 30px; color: #555;">
                If you didn't create an account with Miraj Candles, you can safely ignore this message.
              </p>

              <p style="font-size: 14px; margin-top: 40px; color: #444;">
                Warm regards,<br/>
                <strong>The Miraj Candles Team 🕯️</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #fff4e6; padding: 20px; font-size: 12px; color: #888;">
              <p style="margin: 0;">© 2025 Miraj Candles. All rights reserved.</p>
              <p style="margin: 5px 0 0;">This is an automated email, please do not reply.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const RESET_PASSWORD_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password - Miraj Candles</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #fff7f3; color: #333;">
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #ff7b00, #ff4500); padding: 30px;">
              <img src="https://mirajcandles.com/logo.png" alt="Miraj Candles" width="80" style="display: block; margin-bottom: 10px;" />
              <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Reset Your Password</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px 40px;">
              <p style="font-size: 16px; margin-bottom: 15px;">Hi there,</p>
              <p style="font-size: 16px; margin-bottom: 20px;">
                We received a request to reset your password for your <strong>Miraj Candles</strong> account.
                To proceed, please use the verification code below:
              </p>

              <div style="text-align: center; margin: 40px 0;">
                <div style="display: inline-block; background-color: #fff4e6; padding: 20px 40px; border-radius: 8px; border: 2px dashed #ff7b00;">
                  <span style="font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #ff7b00;">{resetCode}</span>
                </div>
              </div>

              <p style="font-size: 15px; margin-bottom: 10px;">
                Enter this code on the password reset page to create a new password.
              </p>
              <p style="font-size: 14px; color: #666;">
                This code will expire in <strong>15 minutes</strong> for security reasons.
              </p>

              <p style="font-size: 14px; margin-top: 30px; color: #555;">
                If you didn't request a password reset, no worries — just ignore this email and your account will remain secure.
              </p>

              <p style="font-size: 14px; margin-top: 40px; color: #444;">
                Warm regards,<br/>
                <strong>The Miraj Candles Team 🕯️</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #fff4e6; padding: 20px; font-size: 12px; color: #888;">
              <p style="margin: 0;">© 2025 Miraj Candles. All rights reserved.</p>
              <p style="margin: 5px 0 0;">This is an automated email, please do not reply.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const ORDER_RECEIVED_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Order Has Been Received - Miraj Candles</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #fff7f3; color: #333;">
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #ff7b00, #ff4500); padding: 30px;">
              <img src="https://mirajcandles.com/logo.png" alt="Miraj Candles" width="80" style="display: block; margin-bottom: 10px;" />
              <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Order Received Successfully</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px 40px;">
              <p style="font-size: 16px; margin-bottom: 15px;">Hi {customerName},</p>

              <p style="font-size: 16px; margin-bottom: 20px;">
                Thank you for shopping with <strong>Miraj Candles</strong> 🕯️
                We're excited to let you know that we've successfully received your order <strong>{orderId}</strong>.
              </p>

              <p style="font-size: 15px; margin-bottom: 20px;">
                Our team is currently reviewing and confirming your order details. Once it's confirmed,
                we'll carefully prepare your items for dispatch and send you a <strong>tracking link</strong> so you can follow your delivery every step of the way.
              </p>

              <div style="text-align: center; margin: 40px 0;">
                <div style="display: inline-block; background-color: #fff4e6; padding: 20px 30px; border-radius: 8px; border: 2px dashed #ff7b00;">
                  <p style="font-size: 16px; margin: 0;">Order Total: <strong style="color: #ff7b00;">₹ {orderTotal}</strong></p>
                </div>
              </div>

              <p style="font-size: 15px; margin-bottom: 25px;">
                We'll keep you updated once your order is shipped.
              </p>

              <p style="font-size: 15px; font-weight: 500; color: #ff7b00;">
                Stay tuned — your candles are on their way to brighten your moments ✨
              </p>

              <p style="font-size: 14px; margin-top: 40px; color: #444;">
                Warm regards,<br/>
                <strong>The Miraj Candles Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #fff4e6; padding: 20px; font-size: 12px; color: #888;">
              <p style="margin: 0;">© 2025 Miraj Candles. All rights reserved.</p>
              <p style="margin: 5px 0 0;">This is an automated message, please do not reply.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const NEW_PRODUCT_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Product Alert!</title>
</head>
<body style="font-family: 'Arial', sans-serif; background-color: #ffffff; color: #333; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">

    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(to right, #ff6b00, #ff8800); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🔥 New Product Just Dropped!</h1>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 30px 20px;">
        <p style="font-size: 16px; margin-bottom: 16px;">Hi <strong>{customerName}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
          Exciting news! We've just added a <strong>brand new product</strong> to our store — and as one of our valued customers, you're among the first to know 🎉
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <img src="{productImage}" alt="New Product" style="max-width: 100%; border-radius: 8px;" />
        </div>

        <p style="font-size: 15px; line-height: 1.6;">
          <strong>{productName}</strong> — {productDescription}
        </p>

        <p style="font-size: 16px; font-weight: bold; margin: 20px 0; color: #ff6b00;">
          Price: ₹{productPrice}
        </p>

        <div style="text-align: center; margin-top: 30px;">
          <a href="{productLink}"
             style="background-color: #ff6b00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
             🛍️ View Product
          </a>
        </div>

        <p style="margin-top: 40px; font-size: 14px; color: #555;">
          Stay tuned — we're constantly adding more amazing products just for you!
        </p>

        <p style="margin-top: 20px; font-size: 14px; color: #777;">
          — The <strong>YourStore</strong> Team
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f9f9f9; text-align: center; padding: 15px; font-size: 12px; color: #888;">
        <p style="margin: 0;">Thank you for being a part of our community 💛</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const ORDER_CONFIRMATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Order Confirmation</title>
</head>
<body style="font-family: 'Arial', sans-serif; background-color: #ffffff; color: #333; margin: 0; padding: 0;">

  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 700px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">

    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(to right, #ff6b00, #ff8800); padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0;">🎉 Order Confirmed!</h1>
        <p style="color: #fff; margin-top: 5px; font-size: 15px;">Thank you for shopping with <strong>YourStore</strong></p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 30px 20px;">
        <p style="font-size: 16px;">Hi <strong>{customerName}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6;">
          We're excited to let you know that we've received your order. Below are your order details:
        </p>

        <!-- Order Info -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0;"><strong>Order ID:</strong></td>
            <td>{orderId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Status:</strong></td>
            <td style="color: #ff6b00;">Confirmed & Processing</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Delivery Contact:</strong></td>
            <td>{deliveryPhone}</td>
          </tr>
        </table>

        <!-- Items Table -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-top: 30px;">
          <thead>
            <tr style="background-color: #ff6b00; color: white;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: center;">Quantity</th>
              <th style="padding: 10px; text-align: center;">Price</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderItems}
          </tbody>
        </table>

        <!-- Total Section -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
          <tr>
            <td style="text-align: right; font-size: 16px; padding: 10px 0;">
              <strong>Grand Total:</strong>
              <span style="color: #ff6b00;">₹{orderTotal}</span>
            </td>
          </tr>
        </table>

        <!-- Tracking Link -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="{trackingLink}"
             style="background-color: #ff6b00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
             📦 Track Your Order
          </a>
        </div>

        <p style="font-size: 15px; line-height: 1.6;">
          You'll receive another update once your order is shipped.
          We'll share your tracking details so you can follow your package's journey!
        </p>

        <p style="margin-top: 30px; font-size: 15px; color: #555;">
          Stay tuned — your candles are on their way 🕯️
          <br/><br/>
          — The <strong>YourStore</strong> Team
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f9f9f9; text-align: center; padding: 15px; font-size: 12px; color: #888;">
        <p style="margin: 0;">Thank you for choosing us 💛</p>
      </td>
    </tr>

  </table>

</body>
</html>
`;

const PASSWORD_CHANGED_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Changed Successfully - Miraj Candles</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #fff7f3; color: #333;">
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #ff7b00, #ff4500); padding: 30px;">
              <img src="https://mirajcandles.com/logo.png" alt="Miraj Candles" width="80" style="display: block; margin-bottom: 10px;" />
              <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Password Changed Successfully</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px 40px;">
              <p style="font-size: 16px; margin-bottom: 15px;">Hi {userName},</p>
              <p style="font-size: 16px; margin-bottom: 20px;">
                This is to confirm that your <strong>Miraj Candles</strong> account password has been changed successfully.
              </p>

              <div style="background-color: #fff4e6; padding: 20px 30px; border-left: 4px solid #ff7b00; border-radius: 6px; margin: 30px 0;">
                <p style="font-size: 15px; margin: 0;">
                  If you made this change, no further action is required.
                </p>
                <p style="font-size: 15px; margin: 10px 0 0;">
                  However, if you didn’t change your password, please <a href="https://mirajcandles.com/reset-password" style="color: #ff7b00; text-decoration: none; font-weight: bold;">reset your password immediately</a> or contact our support team for help.
                </p>
              </div>

              <p style="font-size: 14px; color: #555; margin-top: 25px;">
                For your security, we recommend keeping your password unique and avoiding reuse across multiple websites.
              </p>

              <p style="font-size: 14px; margin-top: 40px; color: #444;">
                Stay secure,<br/>
                <strong>The Miraj Candles Team 🕯️</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #fff4e6; padding: 20px; font-size: 12px; color: #888;">
              <p style="margin: 0;">© 2025 Miraj Candles. All rights reserved.</p>
              <p style="margin: 5px 0 0;">This is an automated email, please do not reply.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const NEW_ORDER_NOTIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Order Received - Miraj Candles</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #fff7f3; color: #333;">
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #ff7b00, #ff4500); padding: 30px;">
              <img src="https://mirajcandles.com/logo.png" alt="Miraj Candles" width="80" style="display: block; margin-bottom: 10px;" />
              <h1 style="color: #ffffff; font-size: 24px; margin: 0;">New Order Placed</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px 40px;">
              <p style="font-size: 16px; margin-bottom: 15px;">Hello Admin,</p>
              <p style="font-size: 16px; margin-bottom: 20px;">
                A new order has just been placed on <strong>Miraj Candles</strong>. Please review the details below.
              </p>

              <!-- Order Summary Box -->
              <div style="background-color: #fff4e6; padding: 20px 30px; border-radius: 8px; border-left: 4px solid #ff7b00; margin-bottom: 30px;">
                <p style="margin: 0; font-size: 15px;"><strong>Order ID:</strong> {orderId}</p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>Customer Name:</strong> {customerName}</p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>Email:</strong> {customerEmail}</p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>Total Amount:</strong> ₹{orderTotal}</p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>Payment Method:</strong> {paymentMethod}</p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>Payment Transaction:</strong> {paymentTnx}</p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>Order Date:</strong> {orderDate}</p>
              </div>

              <!-- Items Table -->
              <table role="presentation" width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                  <tr style="background-color: #fff4e6;">
                    <th align="left" style="font-size: 14px; border-bottom: 2px solid #ff7b00;">Product</th>
                    <th align="center" style="font-size: 14px; border-bottom: 2px solid #ff7b00;">Qty</th>
                    <th align="right" style="font-size: 14px; border-bottom: 2px solid #ff7b00;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems}
                </tbody>
              </table>

              <p style="font-size: 15px; margin-bottom: 15px;">
                Please process this order promptly and update the order status in the admin dashboard.
              </p>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://mirajcandles.com/admin/orders/{orderId}" style="display: inline-block; background-color: #ff7b00; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: bold;">
                  View Order Details
                </a>
              </div>

              <p style="font-size: 14px; margin-top: 40px; color: #444;">
                Best regards,<br/>
                <strong>Miraj Candles System 🕯️</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #fff4e6; padding: 20px; font-size: 12px; color: #888;">
              <p style="margin: 0;">© 2025 Miraj Candles. All rights reserved.</p>
              <p style="margin: 5px 0 0;">This is an automated email for administrative purposes.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const CUSTOMER_QUERY_RECEIVED_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Query Has Been Received - Miraj Candles</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #fff7f3; color: #333;">
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #ff7b00, #ff4500); padding: 30px;">
              <img src="https://mirajcandles.com/logo.png" alt="Miraj Candles" width="80" style="display: block; margin-bottom: 10px;" />
              <h1 style="color: #ffffff; font-size: 24px; margin: 0;">We've Received Your Query</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px 40px;">
              <p style="font-size: 16px; margin-bottom: 15px;">Hi {customerName},</p>

              <p style="font-size: 16px; margin-bottom: 20px;">
                Thank you for reaching out to <strong>Miraj Candles</strong> 🕯️.
                We’ve successfully received your message and our support team is reviewing it.
              </p>

              <div style="background-color: #fff4e6; padding: 20px 30px; border-left: 4px solid #ff7b00; border-radius: 6px; margin: 25px 0;">
                <p style="font-size: 15px; margin: 0;">
                  <strong>Your Message:</strong>
                </p>
                <p style="font-size: 15px; color: #555; margin-top: 8px;">"{customerMessage}"</p>
              </div>

              <p style="font-size: 15px; margin-bottom: 15px;">
                One of our team members will get back to you as soon as possible — usually within <strong>24 hours</strong>.
              </p>

              <p style="font-size: 15px; color: #ff7b00; font-weight: 500;">
                We appreciate your patience and look forward to assisting you soon!
              </p>

              <p style="font-size: 14px; margin-top: 40px; color: #444;">
                Warm regards,<br/>
                <strong>The Miraj Candles Support Team 🕯️</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #fff4e6; padding: 20px; font-size: 12px; color: #888;">
              <p style="margin: 0;">© 2025 Miraj Candles. All rights reserved.</p>
              <p style="margin: 5px 0 0;">This is an automated email — please do not reply directly.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const ADMIN_QUERY_NOTIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Customer Query - Miraj Candles</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #fff7f3; color: #333;">
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #ff7b00, #ff4500); padding: 30px;">
              <img src="https://mirajcandles.com/logo.png" alt="Miraj Candles" width="80" style="display: block; margin-bottom: 10px;" />
              <h1 style="color: #ffffff; font-size: 24px; margin: 0;">New Customer Query Received</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px 40px;">
              <p style="font-size: 16px; margin-bottom: 15px;">Hello Admin,</p>

              <p style="font-size: 16px; margin-bottom: 20px;">
                A new customer has just reached out via the <strong>Contact Us</strong> form on the Miraj Candles website. Below are the details:
              </p>

              <!-- Query Details Box -->
              <div style="background-color: #fff4e6; padding: 20px 30px; border-left: 4px solid #ff7b00; border-radius: 6px; margin-bottom: 30px;">
                <p style="margin: 5px 0; font-size: 15px;"><strong>Customer Name:</strong> {customerName}</p>
                <p style="margin: 5px 0; font-size: 15px;"><strong>Email:</strong> {customerEmail}</p>
                <p style="margin: 5px 0; font-size: 15px;"><strong>Phone:</strong> {customerPhone}</p>
                <p style="margin: 5px 0; font-size: 15px;"><strong>Submitted On:</strong> {submittedDate}</p>
              </div>

              <!-- Message Section -->
              <div style="background-color: #fafafa; border: 1px solid #eee; border-radius: 6px; padding: 20px 25px; margin-bottom: 30px;">
                <p style="font-size: 15px; margin: 0 0 10px 0;"><strong>Message:</strong></p>
                <p style="font-size: 15px; color: #555; margin: 0;">"{customerMessage}"</p>
              </div>

              <p style="font-size: 15px; margin-bottom: 20px;">
                Please review and respond to the customer promptly. You can reply directly to their email or manage this query via the admin dashboard.
              </p>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://mirajcandles.com/admin/queries"
                   style="background-color: #ff7b00; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">
                   📋 View All Queries
                </a>
              </div>

              <p style="font-size: 14px; margin-top: 40px; color: #444;">
                Regards,<br/>
                <strong>Miraj Candles System 🕯️</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #fff4e6; padding: 20px; font-size: 12px; color: #888;">
              <p style="margin: 0;">© 2025 Miraj Candles. All rights reserved.</p>
              <p style="margin: 5px 0 0;">This is an automated email for administrative purposes.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
