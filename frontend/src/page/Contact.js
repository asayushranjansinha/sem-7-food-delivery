import React, { useState } from "react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let bodyObj = {
      "userName": name,
      "userEmail": email,
      "userMessage": message
    }

    // Make an HTTP request to your serverless function
    const response = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyObj),
    });

    if (response.ok) {
      // Handle success, e.g., show a success message
      console.log("Email sent successfully!");
    } else {
      // Handle error, e.g., show an error message
      console.error("Failed to send email");
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center">
      <div className="mt-4 mr-4 mb-10 px-6 w-full md:w-1/2 lg:w-1/3 ml-4">
        <h2 className="text-gray-800 text-xl font-semibold mb-4 text-center">
          Send Us a Message
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-400 mb-2">Name</label>
            <input
              className="w-full border bg-transparent text-black border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
              type="text"
              required
              placeholder="Your Name"
              value={name}
              onChange={handleNameChange}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Email</label>
            <input
              className="w-full border border-gray-300 bg-transparent text-black rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Message</label>
            <textarea
              className="w-full border border-gray-300 bg-transparent text-black rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
              rows="4"
              required
              placeholder="Your Message"
              value={message}
              onChange={handleMessageChange}
            ></textarea>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-rose-600 text-white px-4 py-2 mb-10 rounded-md hover:bg-rose-800 transition duration-300"
              type="submit"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;