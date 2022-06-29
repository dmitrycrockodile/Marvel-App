import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import ComicsList from "../../components/comicsList/ComicsList";
import AppBanner from "../appBanner/AppBanner";

const ComicsPage = () => {
   return (
      <>
         <AppBanner />
         <ErrorBoundary>
            <ComicsList />
         </ErrorBoundary>
      </>
   )
}

export default ComicsPage;