"use client";

import { useState, useEffect } from "react";
import { useUi } from "@/store/ui";
import { ThemedHeading } from "@/components/ui/ThemedHeading";

interface Comment {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export function GuestbookSection() {
  const language = useUi((s) => s.language);
  const isAr = language === "ar";
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    fetch("/api/guestbook", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      
      if (!res.ok) throw new Error("Failed to submit");
      
      setStatus("success");
      setName("");
      setMessage("");
      
      // Reset success message after a few seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <section className="relative w-full bg-stone-50 py-24" dir={isAr ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <ThemedHeading 
          text={isAr ? "سجل الزوار" : "Guestbook"} 
          className="mb-12"
        />

        <div className="grid gap-12 md:grid-cols-2">
          {/* Submit Form */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="mb-6 text-2xl font-semibold">
              {isAr ? "اترك رسالة" : "Leave a Message"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-stone-700">
                  {isAr ? "الاسم" : "Name"}
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-4 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
                  placeholder={isAr ? "اسمك" : "Your Name"}
                  disabled={status === "submitting"}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-medium text-stone-700">
                  {isAr ? "الرسالة" : "Message"}
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-none rounded-lg border border-stone-300 px-4 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
                  placeholder={isAr ? "اكتب تمنياتك الطيبة..." : "Write your well wishes..."}
                  disabled={status === "submitting"}
                />
              </div>
              
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-lg bg-stone-900 px-4 py-3 font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50"
              >
                {status === "submitting" 
                  ? (isAr ? "جاري الإرسال..." : "Sending...") 
                  : (isAr ? "إرسال" : "Submit")}
              </button>
              
              {status === "success" && (
                <p className="mt-2 text-sm text-emerald-600">
                  {isAr 
                    ? "شكراً لك! سيتم عرض رسالتك بعد المراجعة." 
                    : "Thank you! Your message will be displayed after review."}
                </p>
              )}
              {status === "error" && (
                <p className="mt-2 text-sm text-rose-600">
                  {isAr 
                    ? "حدث خطأ. يرجى المحاولة مرة أخرى." 
                    : "An error occurred. Please try again."}
                </p>
              )}
            </form>
          </div>

          {/* Comments List */}
          <div className="flex flex-col space-y-4">
            <h3 className="mb-2 text-2xl font-semibold">
              {isAr ? "الرسائل" : "Messages"}
            </h3>
            
            {comments.length === 0 ? (
              <div className="flex h-48 items-center justify-center rounded-2xl border border-stone-200 border-dashed bg-white text-stone-400">
                {isAr ? "لا توجد رسائل بعد. كن أول من يكتب!" : "No messages yet. Be the first!"}
              </div>
            ) : (
              <div className="max-h-[500px] space-y-4 overflow-y-auto pe-2">
                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <p className="mb-3 text-stone-700 whitespace-pre-wrap">{comment.message}</p>
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="font-semibold text-stone-900">{comment.name}</span>
                      <span>
                        {new Date(comment.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
