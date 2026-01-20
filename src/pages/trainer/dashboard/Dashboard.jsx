import useLogout from "@/hooks/common/useLogout";


export default function Dashboard(){

    const logout = useLogout()
    return (
    <>
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Dashboard</h2>
        <button
        onClick={logout}
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
        >
        Logout
    </button>
    </>
);
}