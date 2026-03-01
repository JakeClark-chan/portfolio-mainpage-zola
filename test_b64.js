function decodeBase64UTF8(str) {
if (!str) return "";
    str = str.replace(/ /g, "+");
try {
        console.log("Decoding:", str);
const binaryStr = atob(str);
const bytes = new Uint8Array(binaryStr.length);
for (let i = 0; i < binaryStr.length; i++) {
bytes[i] = binaryStr.charCodeAt(i);
}
return new TextDecoder().decode(bytes);
} catch (e) {
        console.error("Error:", e.message);
return str; // Fallback if not base64 encoded
}
}
console.log(decodeBase64UTF8("SmFrZUNsYXJrIC0gUG9ydGZvbGlvICYgQmxvZyBjw6EgbmjDom4="));
