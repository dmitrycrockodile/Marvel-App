import Skeleton from "../skeleton/Skeleton";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const setContent = (processName, Component, data) => {
   switch (processName) {
      case 'waiting':
         return <Skeleton />;
      case 'loading':
         return <Spinner />;
      case 'performed':
         return <Component data={data} />
      case 'error':
         return <ErrorMessage />
      default:
         throw new Error('Unexpected process name');
   }
}

export default setContent;