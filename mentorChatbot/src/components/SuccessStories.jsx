import React from "react";


const stories = [
  {
    name: "Sita from Madhya Pradesh",
    title: "Sita's Tailoring Shop",
    description: "Sita used a local scheme to start a tailoring business.",
    img: "/image/sita.jpeg", 
    audio: "./assets/sita-audio.mp3",
  },
  {
    name: "Kiran from Bihar",
    title: "Microloan to Boutique",
    description: "Kiran built her own boutique using a ₹10,000 microloan.",
    img: "/image/kiran.jpeg",
    audio: "/assets/kiran-audio.mp3",
  },
  {
    name: "Rekha from Rajasthan",
    title: "Online Skills to Business",
    description: "Rekha learned embroidery online and now trains other women.",
    img: "/image/rekha.jpeg",
    audio: "/assets/rekha-audio.mp3",
  },
];

const SuccessStories = () => {
  return (
    <div className="success-container" id="inspiration">
      <h2 className="section-title">Success Stories</h2>
      <div className="story-grid">
        {stories.map((story, index) => (
          <div className="story-card" key={index}>
            <img src={story.img} alt={story.name} className="profile-pic" />
            <h3>{story.name}</h3>
            <h4>{story.title}</h4>
            <p>{story.description}</p>
            <audio controls src={story.audio} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessStories;
