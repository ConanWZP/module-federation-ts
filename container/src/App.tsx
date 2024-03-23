import React, {Suspense} from "react";
import { Routes, Route, Link } from "react-router-dom";

const CounterAppOne = React.lazy(() => import("app1/CounterAppOne"));
const CounterAppTwo = React.lazy(() => import("app2/CounterAppTwo"));

const Root = () => <div>
    <nav>
        <Link to="/app1">App 1</Link>
        <Link to="/app2">App 2</Link>
    </nav>
</div>

const App = () => (
  <Suspense fallback={null}>
    <Routes>
      <Route path={'/'} element={<Root />} />
      <Route path="/app1/*" element={<CounterAppOne />} />
      <Route path="/app2/*" element={<CounterAppTwo />} />
    </Routes>
  </Suspense>
);

export default App;
