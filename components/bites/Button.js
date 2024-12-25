export const SubmitButton = ({ isLoading = false, children, onClick = () => { } }) => {
    return (
        <button disabled={isLoading} onClick={onClick} className="px-4 py-4 transition-all mt-4 hover:bg-gray-950 w-full flex items-center justify-center gap-3 bg-black rounded-lg">
            {(isLoading) && (
                <div className="animate-spin border-2 border-r-transparent rounded-full border-white bg-gray-900 w-5 h-5">

                </div>
            )}
            {children}
        </button>
    )
}