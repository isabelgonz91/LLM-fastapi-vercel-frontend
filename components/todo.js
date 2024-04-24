import Image from 'next/image';
import styles from '../styles/todo.module.css';
import { useState } from 'react';

export default function ToDo(props) {
  const { todo, onChange, onDelete } = props;
  const [poem, setPoem] = useState(null);
  const [isPoemVisible, setIsPoemVisible] = useState(false);
  const [instagramPost, setInstagramPost] = useState(null);
  const [isInstagramPostVisible, setIsInstagramPostVisible] = useState(false);

  async function generateContent(id, type) {
    let endpoint = '';
    if (type === 'poem') {
      endpoint = `${process.env.NEXT_PUBLIC_API_URL}/todos/write-poem/${id}`;
    } else if (type === 'instagram') {
      endpoint = `${process.env.NEXT_PUBLIC_API_URL}/todos/write-instagram-post/${id}`;
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
        const data = await res.json();
        if (type === 'poem') {
          setPoem(data.poem);
          setIsPoemVisible(true);
        } else if (type === 'instagram') {
          setInstagramPost(data.instagram_post);
          setIsInstagramPostVisible(true);
        }
    }
  }

  function closeBox(type) {
    if (type === 'poem') {
      setIsPoemVisible(false);
    } else if (type === 'instagram') {
      setIsInstagramPostVisible(false);
    }
  }

  return (
    <div className={styles.toDoRow} key={todo.id}>
      <input
        className={styles.toDoCheckbox}
        name="completed"
        type="checkbox"
        checked={todo.completed}
        onChange={(e) => onChange(e, todo.id)}
      />
      <input
        className={styles.todoInput}
        autoComplete='off'
        name="name"
        value={todo.name}
        onChange={(e) => onChange(e, todo.id)}
      />
      <button
        className={styles.generateContentBtn}
        onClick={() => generateContent(todo.id, 'poem')}
      >
        Generar Poema
      </button>
      <button
        className={styles.generateContentBtn}
        onClick={() => generateContent(todo.id, 'instagram')}
      >
        Generar Post de Instagram
      </button>
      <button className={styles.deleteBtn} onClick={() => onDelete(todo.id)}>
        <Image src="/delete-outline.svg" width="24" height="24" />
      </button>
      {isPoemVisible && (
        <div className={styles.contentBox}>
          <button className={styles.closeButton} onClick={() => closeBox('poem')}>
            &times;
          </button>
          <p>{poem}</p>
        </div>
      )}
      {isInstagramPostVisible && (
        <div className={styles.contentBox}>
          <button className={styles.closeButton} onClick={() => closeBox('instagram')}>
            &times;
          </button>
          <p>{instagramPost}</p>
        </div>
      )}
    </div>
  );  
}
