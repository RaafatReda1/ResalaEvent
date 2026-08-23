import styles from "../Loader.module.css";

export const THOUGHTS = [
  { id: 1, text: "هبدأ منين؟", x: "12%", y: "20%", mx: "6%", my: "16%", rotate: "-5deg", variant: "card" },
  { id: 2, text: "هدرس إيه؟", x: "22%", y: "70%", mx: "10%", my: "72%", rotate: "3deg", variant: "tag" },
  { id: 3, text: "أذاكر إزاي؟", x: "38%", y: "15%", mx: "32%", my: "12%", rotate: "-2deg", variant: "plain" },
  { id: 4, text: "هل الطب صعب؟", x: "52%", y: "76%", mx: "45%", my: "80%", rotate: "4deg", variant: "card" },
  { id: 5, text: "هعرف أواكب؟", x: "66%", y: "18%", mx: "58%", my: "15%", rotate: "-4deg", variant: "tag" },
  { id: 6, text: "هعمل صحاب؟", x: "78%", y: "68%", mx: "62%", my: "72%", rotate: "5deg", variant: "plain" },
  { id: 7, text: "نظام الكلية إيه؟", x: "32%", y: "82%", mx: "20%", my: "84%", rotate: "-3deg", variant: "card" },
  { id: 8, text: "هل أنا اخترت صح؟", x: "84%", y: "22%", mx: "72%", my: "20%", rotate: "2deg", variant: "tag" },
];

const ThoughtsContainer = () => {
  return (
    <div className={styles.thoughtsContainer}>
      {THOUGHTS.map((thought) => (
        <div
          key={thought.id}
          className={`${styles.thoughtItem} ${styles[thought.variant]}`}
          style={{
            "--thought-x": thought.x,
            "--thought-y": thought.y,
            "--thought-mx": thought.mx,
            "--thought-my": thought.my,
            "--thought-rot": thought.rotate,
          }}
        >
          {thought.text}
        </div>
      ))}
    </div>
  );
};

export default ThoughtsContainer;
