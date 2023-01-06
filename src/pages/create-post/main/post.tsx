import { 
  addDoc, //Create
  getDocs, 
  collection, 
  query, //for db query
  where, //for setting db query condition
  deleteDoc, //Remove
  doc //One specific document
} from "firebase/firestore"
import { Post as IPost } from "./main"
import { db, auth } from "../../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useEffect, useState } from "react"

interface Props {
  post: IPost
}

interface Like {
  likeId: string;
  userId: string;
}

export const Post = (props: Props) => {
  const { post } = props
  const [user] = useAuthState(auth)

  const [likes, setLikes] = useState<Like[] | null>(null)

  const likesRef = collection(db, 'likes')

  const likesDoc = query(likesRef, where("postId", "==", post.id))

  const getLIkes = async () => {
    const data = await getDocs(likesDoc)
    setLikes(data.docs.map(doc => ({userId: doc.data().userId, likeId: doc.id})))
  }
  
  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {userId: user?.uid, postId: post.id})
      if (user) {
        setLikes((prev) => 
          prev ? [...prev, {userId: user?.uid, likeId: newDoc.id}] 
          : [{userId: user?.uid, likeId: newDoc.id}]
        )
      }
    } catch (e) {
      console.error(e)
    }
  }

  const removeLike = async () => {
    try {
      const likeToDeleteQuery = query(
        likesRef, 
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      )

      const likeToDeleteData = await getDocs(likeToDeleteQuery)
      const likeId = likeToDeleteData.docs[0].id
      const likeToDelete = doc(db, "likes", likeId)
      await deleteDoc(likeToDelete)
      if (user) {
        setLikes((prev) => prev && prev.filter(like => like.likeId !== likeId))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid)

  useEffect(() => {
    getLIkes()
  }, [])

  return (
    <div>
      <div className="title">
        <h1>{post.title}</h1>
      </div>
      <div className="body">
        <p>{post.description}</p>
      </div>

      <div className="footer">
        <p>@{post.username}</p>
        {/* <></> to let react know that it's html (thumb up/down)*/}
        <button onClick={hasUserLiked ? removeLike : addLike}> 
          {hasUserLiked ? <>&#128078;</> : <>&#128077;</>} 
        </button>
        {likes && <p>Likes: {likes.length}</p>}
      </div>
    </div>
  )
}