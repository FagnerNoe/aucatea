
import { Users, SquareUserRound, Calendar, Printer, PowerIcon, Home, X, Menu } from "lucide-react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";


export default function Painel() {
    const [menuAberto, setMenuAberto] = useState(false);
    const { user, logout } = useAuth();


    function Saudacao() {
        const nome = user?.nome;
        console.log("Nome do usuário no painel:", nome);
        const hora = new Date().getHours();
        let saudacao;

        if (hora < 12) saudacao = "Bom dia";
        else if (hora < 18) saudacao = "Boa tarde";
        else saudacao = "Boa noite";
        return <h3>{saudacao}, <span className="font-[Poppins] font-bold">{nome}</span></h3>;
    }



    const menuItems = [
        { title: "Home", path: "home", icon: Home },
        { title: "Pacientes", path: "pacientes", icon: Users },
        { title: "Membros", path: "membros", icon: SquareUserRound },
        { title: "Agenda", path: "agenda", icon: Calendar },
        { title: "Relatórios", path: "relatorios", icon: Printer },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <button
                onClick={() => setMenuAberto(!menuAberto)}
                className="p-2 lg:hidden fixed top-4 left-4 z-50 bg-white rounded-lg shadow-xl "
            >
                {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <aside
                className={` realtive inset-y-0  sm:hidden left-0 w-64 bg-white/20  shadow-lg flex-col transform transition-transform duration-300
          ${menuAberto ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:flex`}
            >

                <div className="h-25">
                    <img src="/lobo.png" alt="Logo" className="w-20 h-20 mx-auto my-4" />
                </div>
                <div className="p-4 font-bold text-3xl text-center border-b font-[Poppins] bg-clip-text bg-linear-to-r from-pink-400 to-red-500 text-transparent">
                    AucaTea
                </div>


                <nav className="flex-1 p-2 space-y-2 ">
                    {menuItems.map((menu) => (
                        <Link
                            key={menu.title}
                            to={menu.title === "Home" ? "/painel" : `/painel/${menu.path}`}
                            className={
                                menu.title === "Home"
                                    ? "flex items-center justify-center border border-red-400 m-auto rounded-lg p-2 mb-5 mx-auto hover:bg-gray-300 cursor-pointer bg-white text-red-400 font-bold shadow-md"
                                    : "w-full cursor-pointer hover:scale-105 transition-transform text-left text-white font-medium px-3 py-2 rounded bg-linear-to-r from-red-500 to-pink-500 hover:bg-gray-200 flex items-center"
                            }
                        >
                            {menu.icon && <menu.icon className="inline-block mr-2" />}
                            {menu.title}
                        </Link>
                    ))}
                </nav>
                <span className="mx-auto p-2 mb-3 text-sm text-gray-600">{Saudacao()}</span>


                <div
                    onClick={() => logout()}
                    className="flex hover:scale-109 transition-transform py-3 px-3 mb-2 m-auto cursor-pointer rounded-full bg-linear-to-r from-red-500 to-pink-400 shadow-md shadow-red-400 text-white hover:bg-gray-600">
                    <PowerIcon />
                </div>
            </aside>
            {menuAberto && (
                <div
                    className="fixed inset-0 bg-black/40 md:hidden"
                    onClick={() => setMenuAberto(false)}
                />
            )}


            {/* Conteúdo principal */}
            <main className="flex-1 xs:mt-10 relative p-6 bg-[url('/aucateaimg.jpg')] bg-cover">
                <Outlet />
            </main>
        </div>
    );
}




