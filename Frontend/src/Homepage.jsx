import Hero from "./components/Hero";
import SearchBox from "./components/SearchBox";
import Favorites from "./components/Favorites";
import Features from "./components/Features";
import Reviews from "./components/Reviews";

function Homepage() {
  return (
    <>
      <Hero />
      <SearchBox />
      <Favorites />
      <Features />
      <Reviews />
    </>
  );
}

export default Homepage;