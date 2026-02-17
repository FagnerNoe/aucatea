import { useStyle } from "../context/StyleContext";



export function Home() {
    const { cores } = useStyle();

    return (
        <div className="mt-10">
            <h1 className={`font-['Style_Script',cursive] text-4xl bg-clip-text ${cores.gradientBlue} text-transparent`}>
                Associação Candidomotense de Apoio a Pessoas com Transtorno do Espectro Autista
            </h1>
            <p className="font-[Poppins] text-gray-500 text-sm">
                Bem Vindo ao Sistema de Cadastros Aucatea !
            </p>
        </div>

    );
}

