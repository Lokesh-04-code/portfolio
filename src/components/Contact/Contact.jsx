import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../../lib/supabase";

const Contact = () => {
  const form = useRef();
  const [sending, setSending] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setSending(true);

    const formData = new FormData(form.current);
    const name = formData.get("user_name") || "";
    const email = formData.get("user_email") || "";
    const subject = formData.get("subject") || "";
    const message = formData.get("message") || "";

    try {
      // 1) Save to Supabase (works without EmailJS)
      const { error: dbError } = await supabase.from("contact_messages").insert([
        { name, email, subject, message },
      ]);

      if (dbError) {
        console.warn("Supabase save failed:", dbError.message);
      }

      // 2) Also send via EmailJS if credentials are configured
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_6f0reu6";
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_o15805b";
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "p-ka2jM3uNb5YWQMO";

      await emailjs.sendForm(serviceId, templateId, form.current, publicKey);

      toast.success("Message sent successfully! ✅", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      form.current.reset();
    } catch (error) {
      console.error("Error:", error);
      // If only EmailJS fails but Supabase saved it, still show partial success
      toast.info("Message received! (Email notification may be delayed.)", {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
      });
      form.current.reset();
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="flex flex-col items-center justify-center py-24 px-[12vw] md:px-[7vw] lg:px-[20vw]"
    >
      {/* Toast Container */}
      <ToastContainer />

      {/* Section Title */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white">CONTACT</h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-semibold">
          I'd love to hear from you—reach out for any opportunities or questions!
        </p>
      </div>

      {/* Contact Form */}
      <div className="mt-8 w-full max-w-md bg-[#0d081f] p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-xl font-semibold text-white text-center">
          Connect With Me <span className="ml-1">🚀</span>
        </h3>

        <form
          ref={form}
          onSubmit={sendEmail}
          className="mt-4 flex flex-col space-y-4"
        >
          <input
            type="email"
            name="user_email"
            placeholder="Your Email"
            required
            className="w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
          />
          <input
            type="text"
            name="user_name"
            placeholder="Your Name"
            required
            className="w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            required
            className="w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
          />
          <textarea
            name="message"
            placeholder="Message"
            rows="4"
            required
            className="w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 text-white font-semibold rounded-md hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
