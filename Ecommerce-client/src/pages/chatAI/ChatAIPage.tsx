import { useEffect, useRef, useState } from "react";
import { FaRegImage } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { MdAutoAwesome, MdSentimentSatisfiedAlt } from "react-icons/md";
import { aiSearch } from "../../api/aiApi";
import { formatMoneyString } from "../../utils/formatPrice";
import type { ProductType } from "../../type/ProductType";
import type { OrderType } from "../../type/OrderType";

function ChatAIPage() {
  const [inputChatAI, setInputChatAI] = useState<{ message: string }>({
    message: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputChatAI, string>>
  >({});

  const bottomRef = useRef<HTMLDivElement | null>(null);

  type ChatMessage =
    | {
        role: "user";
        message: string;
      }
    | {
        role: "assistant";
        message: string;
        type?: "product";
        data?: ProductType[];
      }
    | {
        role: "assistant";
        message: string;
        type?: "order";
        data?: OrderType[];
      }
    | {
        role: "assistant";
        type: "text";
        message: string;
      };

  const [contentChatAI, setContetChatAI] = useState<ChatMessage[]>([
    { role: "assistant", message: "Chào bạn! Tôi có thể giúp gì cho bạn?" },
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [contentChatAI]);

  const handleSubmitChatAI = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!inputChatAI.message) {
        newErrors.message = "Vui lòng nhập nội dung";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setContetChatAI((prev) => [
        ...(prev || []),
        {
          role: "user",
          message: inputChatAI.message,
        },
      ]);

      const resAI = await aiSearch({ message: inputChatAI.message });

      console.log(resAI);

      setContetChatAI((prev) => [
        ...(prev || []),
        {
          role: "assistant",
          message: resAI.message,
          data: resAI.data,
          type: resAI.type,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark relative w-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="flex-1 max-h-[500px] overflow-y-auto custom-scrollbar p-6 md:p-10 space-y-8 flex flex-col items-center">
          {contentChatAI.map((content) => {
            return content.role === "assistant" ? (
              <div className="flex gap-3 max-w-4xl w-full">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                  <MdAutoAwesome className="text-sm" />
                </div>
                <div className="flex flex-col gap-4 items-start w-full">
                  <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-5 py-3 rounded-2xl shadow-sm text-slate-700 dark:text-slate-200">
                    <p className="text-sm leading-relaxed">{content.message}</p>
                  </div>
                  <div ref={bottomRef} />
                  {content.type === "product" && content.data && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      {content.data?.map((product) => {
                        return (
                          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="h-64 overflow-hidden relative">
                              <img
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                src={product.image_url[0]}
                              />
                              <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-1.5 rounded-full"></div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-bold text-sm truncate">
                                {product.name}
                              </h4>
                              <p className="text-primary font-bold mt-1">
                                {formatMoneyString(product.price.toString())}₫
                              </p>
                              <button className="w-full mt-3 py-2 text-xs font-bold border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                                Xem chi tiết
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-end gap-3 max-w-4xl w-full">
                <div className="flex flex-col items-end gap-1">
                  <div className="bg-primary text-white px-5 py-3 rounded-2xl rounded-tr-none shadow-lg shadow-primary/20">
                    <p className="text-sm">{content.message}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    data-alt="User avatar small"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX1XwZvqM3RL3k4xVMbVCfDPgi9aQXbCovFLBWiRT9guaVQXDyj-J5Gf8MubbU4_2KtbVBQTtZEPLvUeb8xvODo7QsbasgOpm2AauBf6PCwwZMoC2HaR8zPi7PlG3rwBkZSp35s_i6vhcfCF-42Y8dvfl4B6_RDIj5HQ7UCNQuB9ZZ9C9HMeUpyJyoNfqOPXpEPIc1qEf9P9Y8cXXvGcUvd4agLhXvZoCkN668QiVw2ZLYVtOEGx-lr7Q0hdxsfZybsH8uB0AfHdY"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="p-6 md:px-10 md:pb-10 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light dark:via-background-dark to-transparent">
        <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none p-2 flex items-end gap-2">
          <div className="flex items-center gap-1 pb-1 px-1">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
              <FaRegImage size={25} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
              <MdSentimentSatisfiedAlt size={25} />
            </button>
          </div>
          <div className="flex-1">
            <textarea
              className="w-full bg-transparent outline-none border-none focus:ring-0 text-sm py-3 px-2 min-h-[44px] max-h-32 overflow-y-auto resize-none custom-scrollbar"
              placeholder="Nhập tin nhắn..."
              rows={1}
              value={inputChatAI.message}
              name="message"
              onChange={(e) =>
                setInputChatAI((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            />
          </div>
          <div className="pb-1 pr-1">
            <button
              onClick={() => handleSubmitChatAI()}
              className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <IoSend />
            </button>
          </div>
        </div>
        <p className="text-red-500 font-medium text-center text-[15px] mt-4 uppercase tracking-widest">
          {errors.message}
        </p>
      </footer>
    </main>
  );
}

export default ChatAIPage;
