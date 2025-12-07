import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SearchBox from "./components/SearchBox";
import Favorites from "./components/Favorites";
import Features from "./components/Features";
import Reviews from "./components/Reviews";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <SearchBox />
      <Favorites />
      <Features />
      <Reviews />
    </>
  );
}

export default App;