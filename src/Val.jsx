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
  MoreVerticalIcon,
} from "@hugeicons/core-free-icons";

const Val = () => {
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    style: "authentic",
  });
  const [generatedNote, setGeneratedNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const cardRef = useRef(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const generateNote = async () => {
    if (!formData.name) return toast.error("Please enter a name!");
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
      });
      const prompt = `Write a short, heartfelt, and unique Valentine's Day message for ${formData.name}. 
                      Context: ${formData.details}. 
                      Make it ${formData.style}, sweet, and intimate. Max 165 words.
                      do not include any emojis and if i do npt explicitly tell you some details about the person, do not include any details about the person or any experiences. just the message `;

      const result = await model.generateContent(prompt);
      setGeneratedNote(result.response.text().trim());
      console.log(formData.style);
      setShowModal(true);
    } catch (error) {
      console.log(error);
      toast.error("Generation failed. Daily Quota exceeded.");
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

  // // Add this inside your Val component
  // useEffect(() => {
  //   const checkModels = async () => {
  //     try {
  //       // Note: Some SDK versions don't expose listModels directly on the genAI object
  //       // This is the standard way for the web SDK:
  //       const response = await fetch(
  //         `https://generativelanguage.googleapis.com/v1beta/models?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
  //       );
  //       const data = await response.json();
  //       console.log("--- AVAILABLE MODELS ---");
  //       data.models.forEach((m) => console.log(m.name.replace("models/", "")));
  //       console.log("-------------------------");
  //     } catch (err) {
  //       console.error("Could not fetch model list", err);
  //     }
  //   };
  //   checkModels();
  // }, []);

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
              className="w-full p-4 bg-white/50 border border-rose-100 rounded-2xl focus:ring-2 focus:ring-rose-400 outline-none transition-all h-20 resize-none placeholder:text-slate-400"
              placeholder="What makes them special?"
              onChange={(e) =>
                setFormData({ ...formData, details: e.target.value })
              }
            />

            <select
              className="w-full p-4 bg-white/50 border border-rose-100 rounded-2xl focus:ring-2 focus:ring-rose-400 outline-none transition-all h-15 resize-none placeholder:text-slate-400"
              onChange={(e) => {
                console.log(e.target.value);
                setFormData({ ...formData, style: e.target.value });
              }}
            >
              <option value="authentic">Authentic</option>
              <option value="romantic">Romantic</option>
              <option value="funny">Funny</option>
              <option value="sweet">Sweet</option>
              <option value="Touch of Innuendo">Touch of Innuendo</option>
              <option value="flirty">Flirty</option>
            </select>

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
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="absolute -top-12 left-0 text-white/80 bg-white/40 rounded-md backdrop-blur-md hover:text-white transition-colors"
              >
                <HugeiconsIcon icon={MoreVerticalIcon} size={32} />
              </button>

              <div
                className="bg-white flex flex-col gap-4 justify-center shadow-md w-fit absolute top-0 left-0"
                style={{ display: showOptions ? "flex" : "none" }}
              >
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedNote);
                    toast.success("Copied!");
                    setShowOptions(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2  text-slate-700font-semibold hover:bg-slate-50"
                >
                  <HugeiconsIcon icon={Copy01Icon} size={20} /> Copy
                </button>
                <button
                  onClick={() => {
                    downloadImage();
                    setShowOptions(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2  text-slate-700  font-semibold hover:bg-slate-50"
                >
                  <HugeiconsIcon icon={Download01Icon} size={20} /> Download
                  Card
                </button>
              </div>

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

                  <p className="font-serif text-[.9em] md:text-md text-slate-800 leading-wide max-w-lg">
                    "{generatedNote}"
                  </p>

                  <div className=" pt-8 border-t border-rose-50 w-full max-w-xs">
                    <p className="text-rose-500 font-bold tracking-[0.2em] uppercase text-xs">
                      For {formData.name}
                    </p>
                  </div>
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
