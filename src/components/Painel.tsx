import { useEffect, useState } from "react";
import { Users, SquareUserRound, Calendar, Printer, PowerIcon, CloudSun, CloudRain, Sun, Home } from "lucide-react";
import { Pacientes } from "./Pacientes";
import { Membros } from "./Membros";
import { Agenda } from "./Agenda";
import { Relatorios } from "./Relatorios";

export default function Painel() {
    const [selectedMenu, setSelectedMenu] = useState<string>("Home");

    const [weather, setWeather] = useState<any>(null);

    useEffect(() => {
        async function fetchWeather() {
            try {
                const apiKey = "446a777e790e4c777331ba4bef56587a";
                const city = "Candido Mota,BR"; // formato correto
                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`
                );
                const data = await res.json();
                setWeather(data); // salva o objeto inteiro
            } catch (error) {
                console.error("Erro ao buscar clima:", error);
            }
        }

        fetchWeather();
    }, []);

    const renderIcon = () => {
        if (!weather) return null;
        const condition = weather.weather[0].main.toLowerCase();

        if (condition.includes("clear")) {
            return <Sun className="inline-block text-yellow-400 w-6 h-6 ml-2" />;
        }
        if (condition.includes("cloud")) {
            return <CloudSun className="inline-block text-gray-500 w-6 h-6 ml-2" />;
        }
        if (condition.includes("rain")) {
            return <CloudRain className="inline-block text-blue-500 w-6 h-6 ml-2" />;
        }
        return null;
    };





    const menuItems = [
        { title: "Pacientes", icon: Users },
        { title: "Membros", icon: SquareUserRound },
        { title: "Agenda", icon: Calendar },
        { title: "Relatórios", icon: Printer },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="hidden md:flex md:w-64 bg-white/40 shadow-lg flex-col">
                <div className="h-25">
                    <img src="/lobo.png" alt="Logo" className="w-20 h-20 mx-auto my-4" />
                </div>
                <div className="p-4 font-bold text-3xl text-center border-b font-[Poppins] bg-clip-text bg-linear-to-r from-pink-300 to-red-500 text-transparent">
                    AucaTea
                </div>

                <div
                    onClick={() => setSelectedMenu("Home")}
                    className="flex items-center justify-center border border-red-400 m-auto rounded-full hover:bg-gray-500 cursor-pointer">
                    <Home className="m-3 text-red-400" />
                </div>
                <nav className="flex-1 p-2 space-y-2 ">
                    {menuItems.map((menu) => (
                        <button
                            key={menu.title}
                            onClick={() => setSelectedMenu(menu.title)}
                            className="w-full cursor-pointer hover:scale-105 transition-transform text-left text-white font-medium px-3 py-2 rounded bg-linear-to-r from-red-500 to-pink-500 hover:bg-gray-200 flex items-center"
                        >
                            {menu.icon && <menu.icon className="inline-block mr-2" />}
                            {menu.title}
                        </button>
                    ))}
                </nav>
                <div className=" flex flex-col mb-3 text-sm border py-1 text-shadow-amber-200 border-gray-200 rounded-lg text-center text-gray-600 font-[Poppins] mt-2">
                    {weather ? (
                        <>
                            {weather.name} - {Math.round(weather.main.temp)}°C
                            <div className="flex justify-center items-center">
                                <span className="mr-3 mb-2">{renderIcon()}</span>
                                {weather.weather[0].description}
                            </div>
                        </>
                    ) : (
                        "Carregando clima..."
                    )}
                </div>
                <div className="flex hover:scale-109 transition-transform py-3 px-3 mb-2 m-auto cursor-pointer rounded-full bg-linear-to-r from-red-500 to-pink-400 shadow-md shadow-red-400 text-white hover:bg-gray-600">
                    <PowerIcon />
                </div>
            </aside>

            {/* Conteúdo principal */}
            <main className="flex-1 xs:mt-10 relative p-6 bg-[url('/aucateaimg.jpg')] bg-cover">

                {selectedMenu === "Home" && (
                    <><h1 className="font-['Style_Script',cursive] text-4xl bg-clip-text bg-linear-to-bl from-red-500 via-orange-400 to-pink-500 text-transparent">
                        Associação Candidomotense de Apoio a Pessoas com Trasntorno do Espectro Autista</h1>
                        <p className="font-[Poppins] text-gray-500 text-sm">Bem Vindo ao Sistema de Cadastros Aucatea !</p></>
                )

                }

                {selectedMenu === "Pacientes" && (
                    <Pacientes />
                )}
                {selectedMenu === "Membros" && (
                    <Membros />
                )}
                {selectedMenu === "Agenda" && (
                    <Agenda />
                )}
                {selectedMenu === "Relatórios" && (
                    <Relatorios />
                )}
            </main>
        </div>
    );
}


