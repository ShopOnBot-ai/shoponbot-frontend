import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { useState } from "react";

export const ChatInerface = () => {
    const [messages, setMessages] = useState([
        {
            id: "welcome",
            role: "assistant",
            text: "Bhai, welcome to ShopOnBot.ai! Main aapki kya madad kar sakta hoon?",
            timestamp: new Date(),
        },
    ])
    return (
        <div className="fixed bottom-6 right-12 z-50">
            <TooltipProvider>
                {/* add open and open change prop */}
                <Dialog>
                    <Tooltip delayDuration={200}>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                                <Button
                                    size="icon"
                                    className="h-16 w-16 rounded-full shadow-lg hover:scale-105 transition-transform bg-primary cursor-pointer"
                                >
                                    <Bot className="h-[120px] w-[120px] text-primary-foreground animate-pulse" />
                                </Button>
                            </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="font-medium mb-2">
                            Ask AI
                        </TooltipContent>
                    </Tooltip>

                    {/* Production-Grade Chat Pop-up overlay */}
                    <DialogContent className="fixed bottom-20 right-10 top-auto left-auto translate-x-0 translate-y-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-bottom-5 data-[state=closed]:slide-out-to-bottom-5 w-[360px] h-[480px] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl border">
                        <DialogHeader className="p-4 border-b bg-black text-white border-white/10 flex flex-row items-center gap-3 space-y-0 relative">
                            <Avatar className="h-10 w-10 border border-white/20 bg-white/10 ">
                                <AvatarFallback className="bg-white/10">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col text-left">
                                <DialogTitle className="text-base font-bold flex items-center gap-1.5 text-white">
                                    ShopOnBot Assistant
                                </DialogTitle>
                                <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                                    Online
                                </p>
                            </div>
                        </DialogHeader>

                        <ScrollArea className="flex-1 p-4 bg-background">
                            <div className="space-y-4">
                                {messages.map((msg) => {
                                    const isAssistant = msg.role === "assistant"
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex gap-3 max-w-[85%] ${isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
                                                }`}
                                        >
                                            <Avatar className="h-8 w-8 shrink-0 select-none border">
                                                <AvatarFallback className={isAssistant ? "bg-primary/10" : "bg-muted"}>
                                                    {isAssistant ? (
                                                        <Bot className="h-4 w-4 text-primary" />
                                                    ) : (
                                                        <User className="h-4 w-4" />
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div
                                                className={`rounded-2xl px-3.5 py-2.5 text-sm shadow-sm leading-relaxed ${isAssistant
                                                    ? "bg-muted/60 text-foreground rounded-tl-none"
                                                    : "bg-primary text-primary-foreground rounded-tr-none"
                                                    }`}
                                            >
                                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                                <span
                                                    className={`text-[10px] block mt-1 text-right opacity-60 ${isAssistant ? "text-muted-foreground" : "text-primary-foreground"
                                                        }`}
                                                >
                                                    {msg.timestamp.toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                                {/* add ref */}
                                <div />
                            </div>
                        </ScrollArea>

                        <form
                            onSubmit={() => { "" }}
                            className="p-4 border-t bg-muted/20 flex items-center gap-2"
                        >
                            <Input
                                value=""
                                onChange={() => ("")}
                                placeholder="Type or ASK Assistant..."
                                className="flex-1 focus-visible:ring-1 pr-10 rounded-xl"
                                maxLength={1000}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="rounded-xl shrink-0 cursor-pointer"
                                disabled={false}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </TooltipProvider>
        </div>
    )
}