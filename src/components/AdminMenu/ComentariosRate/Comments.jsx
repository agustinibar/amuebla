import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';

export const Comments = () => {
  const [comments, setComments] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsCollectionRef = collection(db, 'comments');
        const commentsSnapshot = await getDocs(commentsCollectionRef);
        const commentsData = commentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsData);
      } catch (error) {
        console.error('Error al obtener comentarios:', error);
      }
    };

    fetchComments();
  }, []);

  const handleReply = async (commentId) => {
    try {
      const commentDocRef = doc(db, 'comments', commentId);
      await updateDoc(commentDocRef, {
        answer: replyTexts[commentId] || '', // Obtener la respuesta del objeto replyTexts
      });
      // Actualizar el estado local después de responder
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? { ...comment, answer: replyTexts[commentId] || '' } : comment
        )
      );
      setReplyTexts((prevReplyTexts) => {
        const newReplyTexts = { ...prevReplyTexts };
        delete newReplyTexts[commentId]; // Limpiar el texto de respuesta después de enviar la respuesta
        return newReplyTexts;
      });
      console.log('Respuesta enviada con éxito.');
    } catch (error) {
      console.error('Error al responder al comentario:', error);
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p>{comment.comment}</p>
            {comment.answer && <p>Respuesta: {comment.answer}</p>}
            {!comment.answer && (
              <>
                <input
                  type="text"
                  value={replyTexts[comment.id] || ''} // Obtener el texto de respuesta del objeto replyTexts
                  onChange={(e) => setReplyTexts({ ...replyTexts, [comment.id]: e.target.value })}
                  placeholder="Escribe tu respuesta"
                />
                <button onClick={() => handleReply(comment.id)}>Responder</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};