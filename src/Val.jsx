import React, { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import html2canvas from "html2canvas";
import { Toaster, toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Copy01Icon,
  SparklesIcon,
  Download01Icon,
  Cancel01Icon,
  FavouriteIcon,
} from "@hugeicons/core-free-icons";

const Val = () => {
  const [formData, setFormData] = useState({ name: "", details: "" });
  const [generatedNote, setGeneratedNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const cardRef = useRef(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const generateNote = async () => {
    if (!formData.name) return toast.error("Please enter a name!");
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Write a short, heartfelt, and unique Valentine's Day message for ${formData.name}. 
                      Context: ${formData.details}. 
                      Make it authentic, sweet, and intimate. Max 120 words.`;

      const result = await model.generateContent(prompt);
      setGeneratedNote(result.response.text());
      setShowModal(true);
    } catch (error) {
      console.log(error);
      toast.error("Generation failed. Check connection.");
    }
    setLoading(false);
  };

  const downloadImage = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 3,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `Valentine_${formData.name}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Card downloaded! 🎀");
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />

      {/* Main Container - Fixed to 100vh */}
      <div className="cont relative h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Input Card */}
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-white/40 z-10 animate-in fade-in zoom-in duration-700">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-500">
              <HugeiconsIcon icon={FavouriteIcon} size={32} variant="solid" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center tracking-tight">
            Amanti AI
          </h1>
          <p className="text-slate-500 text-sm text-center mb-8">
            Create a message as unique as they are.
          </p>

          <div className="space-y-5">
            <input
              className="w-full p-4 bg-white/50 border border-rose-100 rounded-2xl focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
              placeholder="Recipient's Name"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <textarea
              className="w-full p-4 bg-white/50 border border-rose-100 rounded-2xl focus:ring-2 focus:ring-rose-400 outline-none transition-all h-28 resize-none placeholder:text-slate-400"
              placeholder="What makes them special?"
              onChange={(e) =>
                setFormData({ ...formData, details: e.target.value })
              }
            />

            <button
              onClick={generateNote}
              disabled={loading}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Crafting your message..." : "Generate Love Note"}
            </button>
          </div>
        </div>

        {/* --- MODAL OVERLAY --- */}
        {showModal && (
          <div className="fixed inset-0 z-50 max-h-screen flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={32} />
              </button>

              {/* The Result Card */}
              <div className="bg-white rounded-lg overflow-hidden shadow-2xl ">
                <div
                  ref={cardRef}
                  className="bg-white p-12 px-8 md:p-16 flex flex-col items-center justify-center text-center min-h-[400px]"
                >
                  <HugeiconsIcon
                    icon={SparklesIcon}
                    className="text-rose-200 mb-3"
                    size={40}
                  />

                  <p className="font-serif text-md md:text-md text-slate-800 leading-wide max-w-lg">
                    "{generatedNote}"
                  </p>

                  <div className=" pt-8 border-t border-rose-50 w-full max-w-xs">
                    <p className="text-rose-500 font-bold tracking-[0.2em] uppercase text-xs">
                      For {formData.name}
                    </p>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="bg-rose-50/50 p-3 flex gap-4 justify-center border-t border-rose-100">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedNote);
                      toast.success("Copied!");
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-white text-slate-700 rounded-xl shadow-sm hover:bg-slate-50 transition-all font-semibold border border-rose-100"
                  >
                    <HugeiconsIcon icon={Copy01Icon} size={20} /> Copy
                  </button>
                  <button
                    onClick={downloadImage}
                    className="flex items-center gap-2 px-3 py-2 bg-rose-500 text-white rounded-xl shadow-md hover:bg-rose-600 transition-all font-semibold"
                  >
                    <HugeiconsIcon icon={Download01Icon} size={20} /> Download
                    Card
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Val;
