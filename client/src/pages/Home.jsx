import React, { useEffect, useState } from "react";

const Home = () => {
  let [images, setImages] = useState([]);
  let [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    async function getSlides() {
      const res = await fetch("/api/get-home-slides").then((res) => res.json());
      setImages(res.images);
    }
    getSlides();
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIndex);
      console.log(nextIndex);
    }, 4000);
    return () => {
      clearTimeout(timer);
    };
  }, [currentIndex, images.length]);
  return (
    <img
      className="w-full md:max-h-80 object-cover"
      src={
        images[currentIndex] ||
        "https://htmlcolorcodes.com/assets/images/colors/bright-yellow-color-solid-background-1920x1080.png"
      }
      alt=""
    />
  );
};

export default Home;
