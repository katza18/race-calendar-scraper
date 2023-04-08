import {BrowserRouter, Routes, Route } from 'react-router-dom';
import CalendarPage from '../pages/CalendarPage';
import React from 'react';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<CalendarPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
