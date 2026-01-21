/**
 * Generate UPI deep link for payment requests
 * Format: upi://pay?pa={upiId}&pn={name}&am={amount}&cu=INR&tn={note}
 * 
 * IMPORTANT: UPI ID (pa) must NOT be URL-encoded. Only name (pn) and note (tn) are encoded.
 * 
 * @param {string} upiId - UPI ID (e.g., "gajeet031@ybl") - will NOT be encoded
 * @param {string} name - Recipient name - will be URL-encoded with + for spaces
 * @param {number} amount - Amount to request - will NOT be encoded
 * @param {string} note - Payment note/description - will be URL-encoded
 * @returns {string} UPI deep link
 */
export function generateUPILink(upiId, name, amount, note = "") {
  // Validate UPI ID format (basic validation)
  if (!upiId || !upiId.includes("@")) {
    throw new Error("Invalid UPI ID format. Must include @ symbol (e.g., user@paytm)");
  }

  // Format amount to 2 decimal places (no encoding needed)
  const formattedAmount = parseFloat(amount).toFixed(2);

  // Trim and prepare values
  const cleanUpiId = upiId.trim();
  const cleanName = name.trim();
  const cleanNote = note.trim() || "Split expense payment";

  // Encode only name and note, preserving + for spaces in name
  // encodeURIComponent encodes spaces as %20, but we want + for name
  const encodedName = encodeURIComponent(cleanName).replace(/%20/g, "+");
  const encodedNote = encodeURIComponent(cleanNote).replace(/%20/g, "+");

  // Construct URL manually - UPI ID and amount are NOT encoded
  return `upi://pay?pa=${cleanUpiId}&pn=${encodedName}&am=${formattedAmount}&cu=INR&tn=${encodedNote}`;
}

/**
 * Open UPI payment app with pre-filled details
 */
export function openUPIPayment(upiId, name, amount, note = "") {
  try {
    const upiLink = generateUPILink(upiId, name, amount, note);
    window.location.href = upiLink;
  } catch (error) {
    console.error("Error opening UPI payment:", error);
    throw error;
  }
}

/**
 * Generate WhatsApp Click-to-Chat URL with plain text payment request message
 * Format: https://wa.me/{phoneNumber}?text={encodedMessage}
 * 
 * IMPORTANT: This function sends ONLY plain text, NO UPI links
 * 
 * @param {string} phoneNumber - WhatsApp number with country code (e.g., "919876543210")
 * @param {string} receiverName - Name of the person receiving the request
 * @param {string} requesterName - Name of the person requesting payment
 * @param {number} amount - Amount to request
 * @param {string} reason - Payment reason/description
 * @param {string} requesterUpiId - Requester's UPI ID (plain text, not a link)
 * @returns {string} WhatsApp Click-to-Chat URL
 */
export function generatePlainTextWhatsAppLink(
  phoneNumber,
  receiverName,
  requesterName,
  amount,
  reason,
  requesterUpiId
) {
  // Validate phone number (should be digits only, with country code)
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  if (!cleanPhone || cleanPhone.length < 10) {
    throw new Error("Invalid phone number format. Include country code (e.g., 919876543210)");
  }

  // Validate UPI ID format
  if (!requesterUpiId || !requesterUpiId.includes("@")) {
    throw new Error("Invalid UPI ID format. Must include @ symbol (e.g., user@paytm)");
  }

  // Format amount to 2 decimal places
  const formattedAmount = parseFloat(amount).toFixed(2);

  // Create plain text WhatsApp message (NO UPI links)
  const message = `Hi ${receiverName}!

${requesterName} is requesting a payment.

Amount: ₹${formattedAmount}
Reason: ${reason}

UPI ID to pay:
${requesterUpiId.trim()}

Please copy this UPI ID and pay using Google Pay / PhonePe / any UPI app.

Thank you!`;

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Open WhatsApp with pre-filled plain text payment request message
 * NO UPI links are generated - only plain text with UPI ID
 */
export function openWhatsAppPayment(
  phoneNumber,
  receiverName,
  requesterName,
  amount,
  reason,
  requesterUpiId
) {
  try {
    const whatsappLink = generatePlainTextWhatsAppLink(
      phoneNumber,
      receiverName,
      requesterName,
      amount,
      reason,
      requesterUpiId
    );
    window.open(whatsappLink, "_blank");
  } catch (error) {
    console.error("Error opening WhatsApp:", error);
    throw error;
  }
}
