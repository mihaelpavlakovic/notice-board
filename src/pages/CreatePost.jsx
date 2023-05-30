// react imports
import React, { useEffect, useRef, useState } from "react";

// component imports
import Nav from "../layouts/Nav";
import { TrashIcon } from "@heroicons/react/24/outline";
import { createPost } from "../store/post/postActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetUploadProgress, selectProgress } from "../store/post/postSlice";

const CreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const uploadProgress = useSelector(selectProgress);
  const pollOptionRefs = useRef([]);
  const [displayProgress, setDisplayProgress] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [pollOptions, setPollOptions] = useState([]);

  const handleSelectChange = event => {
    setSelectedValue(event.target.value);
  };

  const handleAddPollOption = () => {
    setPollOptions(prevOptions => [
      ...prevOptions,
      { name: "", votes: 0, votedUsers: [] },
    ]);
  };

  const handlePollOptionChange = (event, index) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index].name = event.target.value;
    setPollOptions(updatedOptions);
  };

  const handleRemovePollOption = index => {
    const updatedOptions = [...pollOptions];
    updatedOptions.splice(index, 1);
    setPollOptions(updatedOptions);
  };

  const handlePollOptionKeyPress = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddPollOption();
    }
  };

  useEffect(() => {
    if (pollOptionRefs.current.length > 0) {
      const lastInput =
        pollOptionRefs.current[pollOptionRefs.current.length - 1];
      if (lastInput && document.contains(lastInput)) {
        lastInput.focus();
      }
    }
  }, [pollOptions]);

  const handleSubmit = e => {
    e.preventDefault();
    if (files.length > 0) {
      setDisplayProgress(true);
    }

    if (postTitle.trim() !== "" && selectedValue !== "option1") {
      dispatch(createPost({ postTitle, postText, files, pollOptions })).then(
        () => {
          navigate("/");
          dispatch(resetUploadProgress());
        }
      );
    } else if (pollOptions.length > 1) {
      dispatch(createPost({ postTitle, postText, files, pollOptions })).then(
        () => {
          navigate("/");
          dispatch(resetUploadProgress());
        }
      );
    }

    setPostTitle("");
    setPostText("");
    setFiles([]);
  };

  return (
    <>
      <Nav />
      <main className="w-full flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="rounded-lg sm:w-5/6 xl:w-1/2 shadow-xl m-5 border"
        >
          <div className="text-gray-700 p-5 sm:p-20">
            <h1 className="text-3xl">Kreiraj objavu:</h1>
            <div className="mt-4">
              <div className="pb-4">
                <label htmlFor="postTitle" className="block text-sm pb-2">
                  Naslov objave:
                </label>
                <input
                  id="postTitle"
                  className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-indigo-700 focus:ring-indigo-700"
                  type="text"
                  name="postTitle"
                  value={postTitle}
                  onChange={e => setPostTitle(e.target.value)}
                />
              </div>

              <div className="pb-4">
                <label htmlFor="postText" className="block text-sm pb-2">
                  Tekst objave:
                </label>

                <textarea
                  id="postText"
                  rows="8"
                  className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-indigo-700 focus:ring-indigo-700"
                  type="text"
                  name="postText"
                  value={postText}
                  onChange={e => setPostText(e.target.value)}
                ></textarea>
              </div>

              <div className="pb-4">
                <label htmlFor="fileInput" className="block text-sm pb-2">
                  Priloži datoteku:
                </label>

                <input
                  id="fileInput"
                  className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-indigo-700 focus:ring-indigo-700"
                  type="file"
                  name="fileInput"
                  accept="application/msword, .docx, application/pdf, text/plain, image/*"
                  multiple
                  onChange={e => setFiles(e.target.files)}
                />
              </div>

              <div className="pb-4">
                <label htmlFor="selectValue" className="block text-sm pb-2">
                  Dodatak objavi:
                </label>
                <select
                  id="selectValue"
                  value={selectedValue}
                  onChange={handleSelectChange}
                  className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-indigo-700 focus:ring-indigo-700"
                >
                  <option value="">Dodatak nije odabran</option>
                  <option value="option1">Kreiraj glasanje</option>
                </select>

                {selectedValue === "option1" && (
                  <div className="mt-2 flex flex-col gap-2">
                    {pollOptions.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          placeholder={`Enter poll option ${index + 1}`}
                          value={option.name} // Update this line
                          className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-indigo-700 focus:ring-indigo-700"
                          onChange={event =>
                            handlePollOptionChange(event, index)
                          }
                          onKeyDown={event =>
                            handlePollOptionKeyPress(event, index)
                          }
                          ref={inputRef =>
                            (pollOptionRefs.current[index] = inputRef)
                          }
                        />

                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 ml-2 rounded-md"
                          onClick={() => handleRemovePollOption(index)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-3 bg-transparent hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-md"
                      onClick={handleAddPollOption}
                    >
                      Dodaj polje
                    </button>
                  </div>
                )}
              </div>

              {displayProgress && (
                <div className="h-4 bg-indigo-200 rounded">
                  <div
                    className="h-full bg-indigo-600 rounded"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md mt-4"
              >
                Objavi
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

export default CreatePost;
