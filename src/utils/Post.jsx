import React, { useEffect, useRef, useState } from "react";
import {
  createComment,
  deleteComment,
  deletePost,
  handleVote,
} from "../store/post/postActions";
import {
  DocumentIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, selectUserData } from "../store/user/userSlice";
import PostComment from "./PostComment";
import Modal from "./Modal";
import Picture from "./Picture";

const Post = ({ postData }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const [comment, setComment] = useState("");
  const [display, setDisplay] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [comment]);

  const handleDelete = postId => {
    dispatch(deletePost(postId));
  };
  const handleSubmit = e => {
    e.preventDefault();

    if (comment.trim() !== "") {
      dispatch(createComment({ postId: postData.id, commentValue: comment }));
    }

    setComment("");
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 3}px`;
  };

  const handleChange = e => {
    setComment(e.target.value);
  };

  const handleVoteAction = (postId, optionIndex) => {
    dispatch(handleVote({ postId, optionIndex }));
  };

  return (
    <div className="flex flex-col gap-4">
      {display && (
        <Modal
          type={"post"}
          isOpen={display}
          index={""}
          itemId={postData.id}
          data={postData}
          onClose={() => setDisplay(false)}
        />
      )}

      <div className="w-full">
        <div className="sm:hidden text-right text-xs text-gray-500 mb-2">
          {postData.createdAt}
        </div>
        <div className="flex items-center justify-between flex-row">
          <div className="flex flex-row gap-3">
            <img
              className="w-11 h-11 rounded-md object-cover"
              src={postData.user.photoURL}
              alt="Slika profila student-mentora"
            />
            <div className="flex flex-col">
              <h3 className="flex-auto font-semibold flex items-center">
                {postData.user?.displayName}
              </h3>
              <p className="text-sm text-gray-500">{postData.user?.email}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            <div className="hidden sm:block">{postData.createdAt}</div>
            <div className="mt-2">
              {userData?.uid === postData.user?.uid && (
                <div className="flex gap-2 justify-end">
                  <PencilSquareIcon
                    className="h-6 sm:h-5 w-6 sm:w-5 hover:cursor-pointer hover:text-indigo-600"
                    onClick={() => setDisplay(true)}
                  />
                  <TrashIcon
                    className="h-6 sm:h-5 w-6 sm:w-5 hover:cursor-pointer hover:text-red-500"
                    onClick={() => handleDelete(postData.id)}
                  />
                </div>
              )}
              {userData?.uid !== postData.user?.uid && userData?.isAdmin && (
                <div className="flex justify-end">
                  <TrashIcon
                    className="h-6 sm:h-5 w-6 sm:w-5 hover:cursor-pointer hover:text-red-500"
                    onClick={() => handleDelete(postData.id)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold">{postData.title}</h2>
      </div>
      {postData.text && <p className="text-gray-500">{postData.text}</p>}
      {postData.files.length !== 0 && (
        <div className="flex flex-wrap gap-2 overflow-hidden">
          {Object.entries(postData.files).map((item, index) => {
            if (
              !(
                item[1].documentName.includes(".pdf") ||
                item[1].documentName.includes(".txt") ||
                item[1].documentName.includes(".docx") ||
                item[1].documentName.includes(".doc")
              )
            ) {
              return (
                <Picture
                  key={index}
                  src={item[1].downloadURL}
                  alt={`Slika ${index}`}
                />
              );
            }
            return null;
          })}
          {Object.entries(postData.files).map((item, index) => {
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
                  className="bg-gray-200 flex gap-3 items-center grow p-3 truncate hover:bg-gray-300 hover:cursor-pointer"
                >
                  <DocumentIcon className="h-5 w-5 hover:cursor-pointer" />
                  <span className="truncate">{item[1].documentName}</span>
                </a>
              );
            }
            return null;
          })}
        </div>
      )}
      {postData?.pollOptions && (
        <ul className="w-full md:w-4/5 mx-auto space-y-1">
          {postData.pollOptions.map((option, index) => (
            <li
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center hover:bg-indigo-100 p-2"
            >
              <div className="flex-grow">
                <span className="text-lg font-semibold">{option.name}</span>
              </div>
              <div className="flex flex-row items-center w-full sm:w-auto">
                <div className="w-48 h-2 bg-gray-300 rounded-full sm:mx-4">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${(option.votes / 10) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 text-center">
                  <span className="text-lg font-semibold">{option.votes}</span>
                </div>
                <button
                  onClick={() => handleVoteAction(postData.id, index)}
                  disabled={postData?.totalVotedUsers?.includes(user.uid)}
                  className={`py-1 px-2 rounded ${
                    !postData?.totalVotedUsers?.includes(user.uid)
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                      : "bg-indigo-600 bg-opacity-80 text-white font-semibold"
                  }`}
                >
                  Glasaj
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div>
        {postData?.comments.length === 0 ? (
          <p className="text-gray-500">Objava nema komentara...</p>
        ) : (
          postData.comments.map((item, index) => {
            return (
              <PostComment
                key={index}
                index={index}
                itemId={postData.id}
                comment={item}
                handleCommentDelete={() =>
                  dispatch(
                    deleteComment({ postId: postData.id, commentId: index })
                  )
                }
              />
            );
          })
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-row items-center gap-3"
      >
        <textarea
          ref={textareaRef}
          className="w-full p-2 text-gray-500 rounded-md border-2 focus:border-indigo-700 focus:ring-indigo-700 focus:outline-none resize-none"
          rows="1"
          name="comment"
          placeholder="Unesite svoj komentar..."
          onChange={handleChange}
          value={comment}
        ></textarea>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md md:w-[8rem]"
        >
          <PaperAirplaneIcon className="h-5 w-5 hover:cursor-pointer mx-auto" />
        </button>
      </form>
    </div>
  );
};

export default Post;
