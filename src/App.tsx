import { FC, ReactElement } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LegalNotes from "./pages/LegalNotes";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const App: FC = (): ReactElement => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/impressum" element={<LegalNotes />} />
        <Route path="/datenschutz" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
};

export default App;
