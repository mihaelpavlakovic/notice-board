import React, { useState } from "react";
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
      <div className="flex gap-3 items-center">
        <img
          className="w-11 h-11 rounded-md"
          src={postData.user.photoURL}
          alt="Slika profila student-mentora"
        />
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="flex-auto font-semibold flex items-center">
                {postData.user?.displayName}
              </h3>
              <p className="text-sm text-gray-500">{postData.user?.email}</p>
            </div>
            <div className="text-xs text-gray-500">
              <div>{postData.createdAt}</div>
              <div className="text-right">
                {user?.uid === postData.user?.uid && (
                  <div className="flex gap-2">
                    <PencilSquareIcon
                      className="h-5 w-5 hover:cursor-pointer"
                      onClick={() => setDisplay(true)}
                    />
                    <TrashIcon
                      className="h-5 w-5 hover:cursor-pointer"
                      onClick={() => handleDelete(postData.id)}
                    />
                  </div>
                )}
                {user?.uid !== postData.user?.uid && userData?.isAdmin && (
                  <div className="flex gap-2">
                    <TrashIcon
                      className="h-5 w-5 hover:cursor-pointer"
                      onClick={() => handleDelete(postData.id)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold">{postData.title}</h2>
      </div>
      <p className="text-gray-500">{postData.text}</p>
      {postData.files.length !== 0 && (
        <div className="flex flex-wrap gap-2 overflow-hidden">
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
                  className="bg-gray-200 flex gap-3 items-center grow p-3 hover:bg-gray-300 hover:cursor-pointer"
                >
                  <DocumentIcon className="h-5 w-5 hover:cursor-pointer" />
                  {item[1].documentName}
                </a>
              );
            } else {
              return (
                <Picture
                  key={index}
                  src={item[1].downloadURL}
                  alt={`Slika ${index}`}
                />
              );
            }
          })}
        </div>
      )}
      {postData?.pollOptions && (
        <ul className="space-y-4">
          {postData.pollOptions.map((option, index) => (
            <li key={index} className="flex items-center">
              <div className="flex-grow">
                <span className="text-lg font-semibold">{option.name}</span>
              </div>
              <div className="w-48 h-2 bg-gray-300 rounded-full mx-4">
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
                Vote
              </button>
            </li>
          ))}
        </ul>
      )}
      <div>
        {postData?.comments.length === 0
          ? "Objava nema komentara"
          : postData.comments.map((item, index) => {
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
            })}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex md:flex-row flex-col items-center gap-3"
      >
        <textarea
          className="w-full md:w-5/6 p-2 text-gray-500 rounded-md border-2 focus:border-indigo-700 focus:ring-indigo-700 focus:outline-none"
          rows="1"
          type="text"
          name="comment"
          placeholder={"Unesite svoj komentar..."}
          onChange={handleChange}
          value={comment}
        ></textarea>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          <PaperAirplaneIcon className="h-5 w-5 hover:cursor-pointer" />
        </button>
      </form>
    </div>
  );
};

export default Post;
