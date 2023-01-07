import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatProvider from "../Context/ChatProvider";

import Chats from "./Chats/Chats";
import Home from "./Home/Home";
import Layout from "./Layout/Layout";
import NoPage from "./NoPage/NoPage";

function App() {
    return (
        <BrowserRouter>
            <ChatProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/chats" element={<Chats />} />
                        <Route path="*" element={<NoPage />} />
                    </Route>
                </Routes>
            </ChatProvider>
        </BrowserRouter>
    );
}

export default App;
