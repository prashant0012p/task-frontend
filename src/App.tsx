
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/login';
import Task from './components/task';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tasks" element={<Task/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
