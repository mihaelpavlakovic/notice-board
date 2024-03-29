import React, { useEffect } from "react";

// component imports
import Nav from "../layouts/Nav";
import { useDispatch, useSelector } from "react-redux";
import {
  selectError,
  selectPosts,
  selectStatus,
} from "../store/post/postSlice";
import { fetchPosts } from "../store/post/postActions";
import Card from "../utils/Card";
import { selectUserData } from "../store/user/userSlice";
import Post from "../utils/Post";
import Spinner from "../utils/Spinner";

const Feed = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  const user = useSelector(selectUserData);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <>
      <Nav />
      <div className="mx-auto max-w-[65rem] px-5 sm:px-[8%]">
        <h1 className="text-2xl sm:text-3xl my-5 font-semibold">
          Pozdrav {user?.displayName}
        </h1>
        {status === "loading" && <Spinner />}
        {status === "failed" && <div>Greska: {error}</div>}
        {status === "succeeded" &&
          posts?.map(post => (
            <Card key={post.id}>
              <Post postData={post} />
            </Card>
          ))}
      </div>
    </>
  );
};

export default Feed;
