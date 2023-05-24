import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../store/user/userSlice";
import { updateProfileInfo } from "../store/user/userActions";
import { updateComment, updatePost } from "../store/post/postActions";
import { DocumentIcon, XMarkIcon } from "@heroicons/react/24/outline";

const Modal = ({ isOpen, onClose, type, index, itemId, data }) => {
  const user = JSON.parse(useSelector(selectUser));
  const [displayName, setDisplayName] = useState(user?.displayName);
  const [commentValue, setCommentValue] = useState(data.value);
  const [postTitleValue, setPostTitleValue] = useState(data.title);
  const [postTextValue, setPostTextValue] = useState(data.text);
  const dispatch = useDispatch();

  const newDisplayName = e => {
    setDisplayName(e.target.value);
  };

  const newCommentValue = e => {
    setCommentValue(e.target.value);
  };

  const newPostTitleValue = e => {
    setPostTitleValue(e.target.value);
  };

  const newPostTextValue = e => {
    setPostTextValue(e.target.value);
  };

  const deleteHandler = e => {
    console.log("delete");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (type === "user") {
      dispatch(updateProfileInfo(displayName)).then(() => onClose());
    } else if (type === "comment") {
      dispatch(
        updateComment({ postId: itemId, commentId: index, commentValue })
      ).then(() => onClose());
    } else if (type === "post") {
      dispatch(
        updatePost({
          postId: itemId,
          title: postTitleValue,
          text: postTextValue,
        })
      ).then(() => onClose());
    }
  };
  return (
    <>
      {isOpen && (
        <div className="z-20 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-12 mx-7 w-full sm:w-1/2 lg:w-1/3 rounded-xl">
            <h2 className="text-xl font-semibold mb-3">Uredite informacije:</h2>
            <form onSubmit={handleSubmit} className="text-gray-700">
              <div className="mt-4">
                {type === "user" && (
                  <div className="pb-4">
                    <label htmlFor="displayName" className="block text-sm pb-2">
                      Vaše ime:
                    </label>

                    <input
                      className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-indigo-700 focus:ring-indigo-700"
                      type="text"
                      id="displayName"
                      name="displayName"
                      placeholder="Unesi novo ime..."
                      value={displayName}
                      onChange={newDisplayName}
                    />
                  </div>
                )}
                {type === "comment" && (
                  <div className="pb-4">
                    <label htmlFor="comment" className="block text-sm pb-2">
                      Vaš komentar:
                    </label>

                    <input
                      className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-indigo-700 focus:ring-indigo-700"
                      type="text"
                      id="comment"
                      name="comment"
                      placeholder="Unesi svoj novi komentar..."
                      value={commentValue}
                      onChange={newCommentValue}
                    />
                  </div>
                )}
                {type === "post" && (
                  <>
                    <div className="pb-4">
                      <label htmlFor="postTitle" className="block text-sm pb-2">
                        Naslov objave:
                      </label>

                      <input
                        className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-indigo-700 focus:ring-indigo-700"
                        type="text"
                        id="postTitle"
                        name="postTitle"
                        placeholder="Unesi svoj novi naslov..."
                        value={postTitleValue}
                        onChange={newPostTitleValue}
                      />
                    </div>
                    <div className="pb-4">
                      <label htmlFor="postText" className="block text-sm pb-2">
                        Tekst objave:
                      </label>

                      <input
                        className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-indigo-700 focus:ring-indigo-700"
                        type="text"
                        id="postText"
                        name="postText"
                        placeholder="Unesi svoj novi opis..."
                        value={postTextValue}
                        onChange={newPostTextValue}
                      />
                    </div>
                    <div className="pb-4">
                      {data.files.length !== 0 &&
                        Object.entries(data.files).map((item, index) => {
                          if (
                            item[1].documentName.includes(".pdf") ||
                            item[1].documentName.includes(".txt") ||
                            item[1].documentName.includes(".docx") ||
                            item[1].documentName.includes(".doc")
                          ) {
                            return (
                              <a
                                key={index}
                                href={item[1].downloadURL}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-gray-200 flex gap-3 items-center grow p-3 hover:bg-gray-300 hover:cursor-pointer"
                              >
                                <DocumentIcon className="h-5 w-5 hover:cursor-pointer" />
                                {item[1].documentName}
                              </a>
                            );
                          } else {
                            return (
                              <div className="relative">
                                <img
                                  key={index}
                                  src={item[1].downloadURL}
                                  alt={`Slika ${index}`}
                                  className="w-[7rem]"
                                />
                                <button
                                  type="button"
                                  onClick={deleteHandler}
                                  className="absolute top-0 right-0 p-1 bg-red-500 rounded-full text-white"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </div>
                            );
                          }
                        })}
                    </div>
                  </>
                )}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
                  >
                    Ažuriraj
                  </button>
                  <button
                    type="button"
                    className="hover:font-bold text-indigo-700 font-semibold py-2 px-4 border-2 border-indigo-700 rounded-md"
                    onClick={onClose}
                  >
                    Zatvori
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
