import "./App.css";
import SnackBarComp from "./Components/SnackBarComp";
import Router from "./Routes/Path";
import ThemeModeProvider from "./UI/ThemeContext";
function App() {
  return (
    <>
      <ThemeModeProvider>
        <Router />
      </ThemeModeProvider>
      <SnackBarComp />
    </>
  );
}

export default App;
