import Home from "./components/pages/Home";
import ErrorBoundary from "./components/pages/ErrorBoundary";
import './App.css';
function App() {
  return (
    <ErrorBoundary>
    <Home />
     </ErrorBoundary>
  );
}

export default App;
