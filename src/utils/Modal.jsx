import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "../store/user/userSlice";
import { updateProfileInfo } from "../store/user/userActions";
import {
  deleteDocument,
  generateId,
  updateComment,
  updatePost,
  uploadFiles,
} from "../store/post/postActions";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { resetUploadProgress, selectProgress } from "../store/post/postSlice";

const Modal = ({ isOpen, onClose, type, index, itemId, data }) => {
  const uploadProgress = useSelector(selectProgress);
  const [displayProgress, setDisplayProgress] = useState(false);
  const user = useSelector(selectUserData);
  const [displayName, setDisplayName] = useState(user?.displayName);
  const [commentValue, setCommentValue] = useState(data.value);
  const [postTitleValue, setPostTitleValue] = useState(data.title);
  const [postTextValue, setPostTextValue] = useState(data.text);
  const [files, setFiles] = useState([]);
  const [fileObjects, setFileObjects] = useState([]);
  const [documentId, setDocumentId] = useState(
    data.documentId ? data.documentId : ""
  );
  const dispatch = useDispatch();
  const refValue = useRef();

  useEffect(() => {
    const bodyElement = document.body;
    if (isOpen) {
      bodyElement.classList.add("overflow-hidden");
    } else {
      bodyElement.classList.remove("overflow-hidden");
    }

    return () => {
      bodyElement.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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

  const deleteHandler = (postId, documentId, index, filename) => {
    dispatch(deleteDocument({ postId, documentId, index, filename }));
  };

  const reset = () => {
    setDisplayProgress(false);
    refValue.current.value = "";
    setFiles([]);
    dispatch(resetUploadProgress());
  };

  const uploadFilesHandler = () => {
    setDisplayProgress(true);

    if (data.documentId) {
      const documentId = data.documentId;
      try {
        dispatch(uploadFiles({ files, documentId })).then(response => {
          setFileObjects(response.payload);
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      const documentId = generateId();
      setDocumentId(documentId);
      try {
        dispatch(uploadFiles({ files, documentId })).then(response => {
          setFileObjects(response.payload);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (files.length > 0) {
      setDisplayProgress(true);
    }

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
          files: fileObjects,
          documentId,
        })
      ).then(() => onClose());
    }
  };
  return (
    <>
      {isOpen && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-white p-5 d:p-12 mx-3 md:mx-7 w-full sm:w-1/2 lg:w-[40rem] rounded-xl">
            <h2 className="text-xl font-semibold mb-3">Uredite informacije:</h2>
            <form onSubmit={handleSubmit} className="text-gray-700">
              <div className="mt-4">
                {type === "user" && (
                  <div className="pb-4">
                    <label htmlFor="displayName" className="block text-sm pb-2">
                      Vaše ime:
                    </label>

                    <input
                      className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-indigo-700 focus:ring-indigo-700"
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
                      className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-indigo-700 focus:ring-indigo-700"
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
                        className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-indigo-700 focus:ring-indigo-700"
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
                        className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-indigo-700 focus:ring-indigo-700"
                        type="text"
                        id="postText"
                        name="postText"
                        placeholder="Unesi svoj novi opis..."
                        value={postTextValue}
                        onChange={newPostTextValue}
                      />
                    </div>
                    <div>
                      <label htmlFor="fileInput" className="block text-sm pb-2">
                        Priloži datoteku:
                      </label>

                      <input
                        id="fileInput"
                        className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none focus:border-indigo-700 focus:ring-indigo-700"
                        type="file"
                        name="fileInput"
                        ref={refValue}
                        accept="application/msword, .docx, application/pdf, text/plain, image/*"
                        multiple
                        onChange={e => setFiles(Array.from(e.target.files))}
                      />

                      {files.length > 0 && (
                        <div className="flex flex-col">
                          {displayProgress && (
                            <div className="h-4 bg-indigo-200 rounded mt-3">
                              <div
                                className="h-full bg-indigo-600 rounded"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          )}
                          <div className="mt-2 flex gap-2 flex-row justify-between">
                            <button
                              type="button"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md w-full p-1 mt-2"
                              onClick={uploadFilesHandler}
                            >
                              Primjeni
                            </button>
                            <button
                              type="button"
                              className="bg-white hover:font-bold text-indigo-700 font-semibold rounded-md border-2 border-indigo-700 w-full p-1 mt-2"
                              onClick={reset}
                            >
                              Odustani
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="my-4 overflow-y-auto max-h-[10rem] grid grid-cols-3 md:grid-cols-4 gap-4">
                      {data.files.length !== 0 && (
                        <>
                          {Object.entries(data.files).map((item, index) => {
                            if (
                              !(
                                item[1].documentName.includes(".pdf") ||
                                item[1].documentName.includes(".txt") ||
                                item[1].documentName.includes(".docx") ||
                                item[1].documentName.includes(".doc")
                              )
                            ) {
                              return (
                                <div className="relative" key={index}>
                                  <img
                                    src={item[1].downloadURL}
                                    alt={`Slika ${index}`}
                                    className="w-full"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteHandler(
                                        data.id,
                                        data.documentId,
                                        index,
                                        item[1].documentName
                                      )
                                    }
                                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                                  >
                                    <XMarkIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              );
                            }
                            return null;
                          })}
                          {Object.entries(data.files).map((item, index) => {
                            if (
                              item[1].documentName.includes(".pdf") ||
                              item[1].documentName.includes(".txt") ||
                              item[1].documentName.includes(".docx") ||
                              item[1].documentName.includes(".doc")
                            ) {
                              return (
                                <div
                                  className="flex items-center bg-gray-200 col-span-3 md:col-span-2"
                                  key={index}
                                >
                                  <button
                                    type="button"
                                    className="focus:outline-none p-3"
                                    onClick={() =>
                                      deleteHandler(
                                        data.id,
                                        data.documentId,
                                        index,
                                        item[1].documentName
                                      )
                                    }
                                  >
                                    <XMarkIcon className="h-5 w-5 text-red-500 hover:cursor-pointer" />
                                  </button>
                                  <div className="flex-shrink truncate">
                                    <a
                                      href={item[1].downloadURL}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="bg-gray-200 flex items-center gap-3 py-3 pr-3 hover:bg-gray-300 hover:cursor-pointer"
                                    >
                                      <span className="truncate">
                                        {item[1].documentName}
                                      </span>
                                    </a>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </>
                      )}
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
