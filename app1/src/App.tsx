import React from "react";
import CounterAppOne from "./components/CounterAppOne";
import {Link, Route, Routes} from "react-router-dom";
import TestRedirect from "./components/TestRedirect";

// добавлены роутинги
const App = () => (
    <div>

        <Routes>
            <Route path={'/'} element={<nav>
                <Link to="/app1/mod">App2-basics</Link>
                <br/>
                <Link to="/app1/test">App2-info</Link>
            </nav>} />
            <Route path={'/mod'} element={
                <CounterAppOne/>
            }/>
            <Route path={'/test'} element={<TestRedirect/>}/>
        </Routes>
    </div>
);

export default App;
