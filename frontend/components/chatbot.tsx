"use client";

import { useState } from "react";

export default function Chatbot() {

    // Controls whether the chatbot window is open or closed
    const [isOpen, setIsOpen] = useState(false);

    // Stores whatever the user is currently typing
    const [question, setQuestion] = useState("");

    // Stores the entire conversation
    // Each message has a role (user/assistant) and its actual text
    const [messages, setMessages] = useState<
        { role: "user" | "assistant"; content: string }[]
    >([]);

    // Tells the UI whether we're currently waiting for FastAPI
    const [loading, setLoading] = useState(false);

    // Enabling the expansion and contraction of the chat
    const [isExpanded, setIsExpanded] = useState(false);


    // Runs whenever the user presses Enter
    // Sends the question to our FastAPI backend
    const sendMessage = async () => {

        // Don't send an empty message
        // Also don't send another request while one is already running
        if (!question.trim() || loading) return;

        // Save the question before clearing the textarea
        const currentQuestion = question;


        // Immediately add the user's message to the conversation
        setMessages((previous) => [
            ...previous,
            {
                role: "user",
                content: currentQuestion
            },
        ]);

        // Clear the input box
        setQuestion("");

        const textarea = document.querySelector("textarea");

        if (textarea) {
            textarea.style.height = "auto";
        }

        // Tell the UI that we're waiting for the chatbot
        setLoading(true);


        try {

            // Send the question from Next.js → FastAPI
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/chat`,
                {
                    method: "POST",

                    // Tell FastAPI we're sending JSON
                    headers: {
                        "Content-Type": "application/json",
                    },

                    // Convert our JavaScript object into JSON
                    body: JSON.stringify({
                        question: currentQuestion,
                    }),
                }
            );


            // If FastAPI returned an error status, throw an error
            if (!response.ok) {
                throw new Error("Failed to get response");
            }


            // Convert FastAPI's JSON response into a JavaScript object
            const data = await response.json();


            // Add the bot's answer to our conversation
            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    content: data.answer
                },
            ]);

        } catch (error) {

            // If something goes wrong, print the error in the console
            console.error(error);

            // Show an error message inside the chatbot
            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    content: "Sorry, something went wrong.",
                },
            ]);

        } finally {

            // Whether the request succeeded or failed,
            // we're no longer waiting for FastAPI
            setLoading(false);
        }
    };


    return (
        <>

            {/* Only show the chatbot window when isOpen is true */}
            {isOpen && (

                <div className={`fixed bottom-24 right-6 ${isExpanded ? "w-[600px] h-[700px]" : "w-80 h-96"} bg-gray-600 rounded-2xl shadow-lg flex flex-col overflow-hidden`}>


                    {/* ================= HEADER ================= */}

                    <div className="p-4 border-b border-gray-500">

                        <p className="font-semibold text-lg">
                            🤖 Student Assistant
                        </p>

                        <p className="text-sm text-gray-300">
                            How can I help you?
                        </p>

                         <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-lg"
                        >
                            {isExpanded ? "↙️" : "↗️"}
                        </button>

                    </div>


                    {/* ================= MESSAGES ================= */}

                    {/* 
                        flex-1:
                        Take up all available space.

                        overflow-y-auto:
                        If there are too many messages,
                        allow this section to scroll.

                        This keeps the input at the bottom.
                    */}

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">


                        {/* 
                            Go through every message in our messages array
                            and create a chat bubble for it.
                        */}

                        {messages.map((message, index) => (

                            <div
                                key={index}

                                // User messages go right
                                // Assistant messages go left
                                className={
                                    message.role === "user"
                                        ? "flex justify-end"
                                        : "flex justify-start"
                                }
                            >

                                <div
                                    // Give user and assistant different colors
                                    className={
                                        message.role === "user"
                                            ? "bg-blue-900 text-white rounded-2xl rounded-br-sm px-3 py-2 max-w-[80%]"
                                            : "bg-gray-500 text-white rounded-2xl rounded-bl-sm px-3 py-2 max-w-[80%]"
                                    }
                                >

                                    {/* Display the actual message */}
                                    <p className="text-sm whitespace-pre-wrap">
                                        {message.content}
                                    </p>

                                </div>

                            </div>
                        ))}


                        {/* 
                            While FastAPI/RAG/Gemini is working,
                            show a temporary loading message.
                        */}

                        {loading && (

                            <div className="flex justify-start">

                                <div className="bg-gray-500 text-white rounded-2xl rounded-bl-sm px-3 py-2">

                                    <p className="text-sm">
                                        Cooking up your response...
                                    </p>

                                </div>

                            </div>
                        )}

                    </div>


                    {/* ================= INPUT ================= */}

                    <div className="p-3 border-t border-gray-500">

                        <textarea
                            placeholder="Ask me something..."

                            // Whatever is in the textarea
                            // is stored in question
                            value={question}


                            // Update question whenever the user types
                            // Also automatically grow the textarea
                            onChange={(event) => {

                                setQuestion(event.target.value);

                                event.target.style.height = "auto";

                                event.target.style.height =
                                    `${event.target.scrollHeight}px`;
                            }}


                            // Handle Enter
                            onKeyDown={(event) => {

                                // Enter = send
                                // Shift + Enter = new line
                                if (
                                    event.key === "Enter" &&
                                    !event.shiftKey
                                ) {

                                    // Prevent the normal textarea
                                    // behavior of creating a new line
                                    event.preventDefault();

                                    // Send the question
                                    sendMessage();
                                }
                            }}


                            rows={1}

                            className="w-full p-3 rounded-xl border border-black bg-gray-700 text-white placeholder-gray-300 resize-none"
                        />

                    </div>

                </div>
            )}


            {/* ================= CHATBOT BUTTON ================= */}

            {/* 
                This button sits in the bottom-right corner.

                Clicking it flips isOpen:
                false → true
                true → false

                So it opens/closes the chatbot.
            */}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-blue-900 text-2xl"
            >
                🤖
            </button>

        </>
    );
}