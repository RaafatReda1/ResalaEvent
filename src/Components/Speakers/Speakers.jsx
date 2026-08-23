import React from "react";
import styles from "./Speakers.module.css";
const Speakers = () => {
  const speakers = [
    {
      name: "Dr. Naglaa Farouk",
      title: "Head of Resala Medical Activity",
      imageSrc: "./drNagalaa.png",
    },
    {
      name: "Dr. Rania Abd Al-Galil",
      title: "Head of Resala Medical Activity",
      imageSrc: "./drRania.png",
    },
    {
      name: "Dr. Rania Abd Al-Galil",
      title: "Head of Resala Medical Activity",
      imageSrc: "./drRania.png",
    },
    {
      name: "Dr. Rania Abd Al-Galil",
      title: "Head of Resala Medical Activity",
      imageSrc: "./drRania.png",
    },
  ];
  return (
    <section
      className={styles.speakersContainer}
      style={{
        background: "red",
        height: "100vh",
        width: "100%",
        position: "relative",
      }}
    >
      {speakers.map((speaker, index) => (
        <div key={index} className={styles.speakerCard}>
          <img
            src={speaker.imageSrc}
            alt={`Speaker ${index}`}
            className={styles.speakerImg}
          />
          <div className={styles.speakerInfo}>
            <h3 className={styles.speakerName}>{speaker.name}</h3>
            <p className={styles.speakerTitle}>{speaker.title}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Speakers;
