export const WHATSAPP_PHONE_NUMBER = "919876543210"; // Default Sri Sai Garments WhatsApp number
export const CONTACT_PHONE_DISPLAY = "+91 98765 43210";
export const COMPANY_EMAIL = "enquiry@srisaigarments.com";
export const COMPANY_ADDRESS = "14/A Textile City Main Road, Near New Bus Stand, Tiruppur, Tamil Nadu - 641601";

/**
 * Builds a WhatsApp URL with pre-filled enquiry message
 */
export function buildWhatsAppUrl({
  product,
  selectedSize,
  selectedColor,
  quantity = 1,
  message = "",
  phoneNumber = WHATSAPP_PHONE_NUMBER,
  businessName = 'Sri Sai Garments'
}) {
  let text = `Hello *${businessName}*! 👋\n\n`;

  if (product) {
    text += `I would like to enquire about the following product:\n`;
    text += `📦 *Product:* ${product.name} (Code: ${product.productCode || product.id})\n`;
    if (product.price != null) text += `💰 *Price:* ₹${product.price}\n`;
    else text += '*Please share the current price for this item.*\n';
    if (selectedSize) text += `📏 *Size:* ${selectedSize}\n`;
    if (selectedColor) text += `🎨 *Color:* ${selectedColor}\n`;
    text += `🔢 *Quantity:* ${quantity} ${quantity > 10 ? 'Pcs (Bulk Inquiry)' : 'Pcs'}\n\n`;
  }

  if (message) {
    text += `💬 *Message:* ${message}\n\n`;
  }

  text += `Could you please confirm availability, bulk pricing, and delivery details?\nThank you!`;

  const encodedText = encodeURIComponent(text);
  const digits = String(phoneNumber ?? WHATSAPP_PHONE_NUMBER).replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}?text=${encodedText}` : '';
}
