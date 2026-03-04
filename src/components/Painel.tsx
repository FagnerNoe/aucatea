
import { Users, SquareUserRound, Calendar, Printer, PowerIcon, Home, X, Menu, HandCoins } from "lucide-react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useStyle } from "../context/StyleContext";


export default function Painel() {
    const [menuAberto, setMenuAberto] = useState(false);
    const { user, logout } = useAuth();
    const { cores } = useStyle();


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
        { title: "Doações", path: "doacoes", icon: HandCoins },
        { title: "Relatórios", path: "relatorios", icon: Printer },
    ];

    return (
        <div className="flex h-screen  bg-gray-100">
            <button
                onClick={() => setMenuAberto(!menuAberto)}
                className="p-2 lg:hidden fixed top-4 left-4 z-60 bg-white rounded-lg shadow-xl "
            >
                {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {menuAberto && (
                <div
                    onClick={() => setMenuAberto(false)}
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 z-50 left-0 w-64 h-full bg-gray-200 shadow-lg flex-col  transform transition-transform duration-300
          ${menuAberto ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex`}
            >

                <div className="h-28">
                    <img src="/logo.png" alt="Logo" className="w-25 h-28 mx-auto mt-5 " />
                </div>
                <div className={`p-4 font-bold text-2xl text-center ${cores.dangerText}`}>
                    AUCA<span className={`${cores.primaryText}`}>TEA</span>
                </div>


                <nav className="flex-1 p-2 space-y-2 mb-10">
                    {menuItems.map((menu) => (
                        <Link
                            onClick={() => setMenuAberto(false)}
                            key={menu.title}
                            to={menu.title === "Home" ? "/painel" : `/painel/${menu.path}`}
                            className={
                                menu.title === "Home"
                                    ? `flex items-center justify-center border border-blue-500 m-auto rounded p-2 mb-5 mx-auto hover:bg-blue-300 cursor-pointer bg-white/10 ${cores.primaryText} hover:text-white  font-bold shadow-md`
                                    : `w-full cursor-pointer hover:scale-105 transition-transform text-left text-white font-medium px-3 py-2 rounded ${cores.gradientBlue} hover:bg-gray-200 flex items-center`
                            }
                        >
                            {menu.icon && <menu.icon className="inline-block mr-2" />}
                            {menu.title}
                        </Link>
                    ))}
                </nav>
                <div className=" flex flex-col items-center justify-end  mb-5   ">

                    <span className="text-center p-2 text-sm text-gray-600">{Saudacao()}</span>


                    <div
                        onClick={() => logout()}
                        className={`w-15 flex  hover:scale-109 transition-transform py-3 px-2 cursor-pointer rounded-full ${cores.gradientBlue} shadow-xl shadow-blue-800 text-white hover:bg-gray-600`}>
                        <PowerIcon className="w-6 h-6 mx-auto" />
                    </div>
                </div>
            </aside>



            {/* Conteúdo principal */}
            <main className="flex-1 py-8 md:py-10 lg:py-8 w-full relative p-4 bg-[url('/aucateaimg.jpg')] bg-cover">
                <Outlet />
            </main>
        </div>
    );
}




