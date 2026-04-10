import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter as Router } from "react-router-dom";

import { Provider } from "react-redux";
import { authStore } from "./redux/auth/authStore";
import { AppProviders } from "./AppProviders";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={authStore}>
      <AppProviders>
        <Router>
          <App />
        </Router>
      </AppProviders>
    </Provider>
  </StrictMode>,
);
