import Image from "next/image";
import Link from 'next/link'

export default function WhatsAppButton() {
  const phoneNumber = "254700000000"; // 👉 replace with your WhatsApp number (country code, no +)
  const message = "Hello, I would like to make an inquiry.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <Link
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50"
    >
      <div className="w-14 h-14 rounded-full shadow-lg hover:scale-105 transition-transform">
        <Image
          src="/images/whatsapp.png" 
          alt="Chat on WhatsApp"
          fill
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
}
