import React, { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectUserData } from "../store/user/userSlice";
import Modal from "./Modal";

const PostComment = ({ index, itemId, comment, handleCommentDelete }) => {
  const user = useSelector(selectUserData);
  const [display, setDisplay] = useState(false);

  return (
    <div className="w-full bg-gray-100 px-3 py-1.5 sm:px-4 flex gap-3 mb-2">
      {display && (
        <Modal
          type={"comment"}
          isOpen={display}
          index={index}
          itemId={itemId}
          data={comment}
          onClose={() => setDisplay(false)}
        />
      )}
      <div className="w-full">
        <div className="flex items-center justify-between flex-row">
          <div className="flex flex-row gap-3 items-center">
            <img
              className="w-8 h-8 rounded-md mt-1 object-cover"
              src={comment.user?.photoURL}
              alt="Profilna slika korisnika"
            />
            <h3 className="font-semibold">{comment.user?.displayName}</h3>
          </div>
          <div className="text-xs text-gray-500 text-right">
            <div className="hidden sm:block">{comment.createdAt}</div>
            <div className="mt-1">
              {user?.uid === comment.user?.uid && (
                <div className="flex gap-2 justify-end">
                  <PencilSquareIcon
                    className="h-6 sm:h-5 w-6 sm:w-5 hover:cursor-pointer hover:text-indigo-600"
                    onClick={() => setDisplay(true)}
                  />
                  <TrashIcon
                    className="h-6 sm:h-5 w-6 sm:w-5 hover:cursor-pointer hover:text-red-500"
                    onClick={handleCommentDelete}
                  />
                </div>
              )}
              {user?.uid !== comment.user?.uid && user?.isAdmin && (
                <div className="flex gap-2 justify-end">
                  <TrashIcon
                    className="h-6 sm:h-5 w-6 sm:w-5 hover:cursor-pointer hover:text-red-500"
                    onClick={handleCommentDelete}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-gray-500 my-2">{comment.value}</p>
        <div className="sm:hidden text-left text-xs text-gray-500">
          Kreirano: {comment.createdAt}
        </div>
      </div>
    </div>
  );
};

export default PostComment;
