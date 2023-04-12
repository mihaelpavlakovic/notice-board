import React from "react";

// component imports
import Nav from "../layouts/Nav";

const CreatePost = () => {
  return (
    <>
      <Nav />
      <main className="w-full flex justify-center">
        <form className="rounded-lg sm:w-5/6 xl:w-1/2 shadow-xl m-5 border">
          <div className="text-gray-700 p-5 sm:p-20">
            <h1 className="text-3xl">Kreiraj objavu:</h1>
            <div className="mt-4">
              <div className="pb-4">
                <label htmlFor="postTitle" className="block text-sm pb-2">
                  Naslov objave:
                </label>
                <input
                  className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-teal-500 focus:ring-teal-500 "
                  type="text"
                  name="postTitle"
                />
              </div>

              <div className="pb-4">
                <label htmlFor="postText" className="block text-sm pb-2">
                  Tekst objave
                </label>

                <textarea
                  rows="8"
                  className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-teal-500 focus:ring-teal-500"
                  type="text"
                  name="postText"
                ></textarea>
              </div>

              <div className="pb-4">
                <label htmlFor="fileInput" className={"block text-sm pb-2"}>
                  Dodatak
                </label>

                <input
                  className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-teal-500 focus:ring-teal-500"
                  type="file"
                  name="fileInput"
                  accept="application/msword, .docx, application/pdf, text/plain, image/*"
                  multiple
                />
              </div>
              <button>Objavi</button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

export default CreatePost;
