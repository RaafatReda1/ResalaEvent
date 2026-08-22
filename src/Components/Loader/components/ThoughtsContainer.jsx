import styles from "../Loader.module.css";

export const THOUGHTS = [
  { id: 1, text: "هبدأ منين؟", x: "14%", y: "24%", rotate: "-5deg", variant: "card" },
  { id: 2, text: "هدرس إيه؟", x: "26%", y: "68%", rotate: "3deg", variant: "tag" },
  { id: 3, text: "أذاكر إزاي؟", x: "40%", y: "18%", rotate: "-2deg", variant: "plain" },
  { id: 4, text: "هل الطب صعب؟", x: "54%", y: "74%", rotate: "4deg", variant: "card" },
  { id: 5, text: "هعرف أواكب؟", x: "67%", y: "22%", rotate: "-4deg", variant: "tag" },
  { id: 6, text: "هعمل صحاب؟", x: "78%", y: "65%", rotate: "5deg", variant: "plain" },
  { id: 7, text: "نظام الكلية إيه؟", x: "36%", y: "80%", rotate: "-3deg", variant: "card" },
  { id: 8, text: "هل أنا اخترت صح؟", x: "85%", y: "26%", rotate: "2deg", variant: "tag" },
];

const ThoughtsContainer = () => {
  return (
    <div className={styles.thoughtsContainer}>
      {THOUGHTS.map((thought) => (
        <div
          key={thought.id}
          className={`${styles.thoughtItem} ${styles[thought.variant]}`}
          style={{
            left: thought.x,
            top: thought.y,
            transform: `rotate(${thought.rotate})`,
          }}
        >
          {thought.text}
        </div>
      ))}
    </div>
  );
};

export default ThoughtsContainer;
