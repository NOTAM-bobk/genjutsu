import React from "react";

const urlRegex = /(https?:\/\/[^\s]+)/g;

export function linkify(text: string) {
    return text.split(urlRegex).map((part, i) =>
        urlRegex.test(part) ? (
            <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-600"
            >
                {part}
            </a>
        ) : (
            part
        )
    );
}