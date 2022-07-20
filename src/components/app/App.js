import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import Spinner from "../spinner/Spinner";

const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicPage = lazy(() => import('../pages/SingleComicPage'));

const App = () => {

    return (
        <Router> 
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}> 
                        <Routes> 
                            <Route path="https://dmitrycrockodile.github.io/Marvel-App/" element={<MainPage />} />
                            <Route path="https://dmitrycrockodile.github.io/Marvel-App/comics" element={<ComicsPage />}/>
                            <Route path="https://dmitrycrockodile.github.io/Marvel-App/:comicId" element={<SingleComicPage />}/>
                            <Route path="*" element={<Page404 />}/>
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}

export default App;