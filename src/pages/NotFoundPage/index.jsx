import { TbFaceIdError } from "react-icons/tb";

export const NotFoundPage = () => {
    return (
        <div className="NotFoundPage flex flex-col justify-center items-center">
            <div className="icon text-[200px]"><TbFaceIdError /></div>
            <h1 className="text-gray-600">404 - Page Not Found</h1>
            <p className="text-gray-600">We can't seem to find the page you're looking for.</p>
            <a className="pointer text-gray-600 hover:underline hover:text-green-600" href="/" onClick={window.localStorage.clear()}>Go back home</a>
        </div>
    )
}
export default NotFoundPage;