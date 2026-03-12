
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";
import { useRelatorio } from "../hooks/useRelatorio";


// Registrar os módulos do Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

// Conexão com Supabase

export function Relatorios() {
    const { totalPacientes, laudos, tratamentos } = useRelatorio();

    const palette = [
        "#FF6384", "#36A2EB", "#FFCE56", "#4CAF50",
        "#9966FF", "#FF9F40", "#00CED1", "#8B0000",
        "#FFD700", "#228B22", "#1E90FF", "#FF4500"
    ];

    const getColors = (labels: string[]): string[] => {
        return labels.map((_, i) => palette[i % palette.length]);
    };
    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 12, // tamanho da fonte da legenda
                    },
                },
            },

        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 10, // tamanho da fonte das descrições no eixo X
                    },
                    color: "#374151", // cor do texto (Tailwind gray-700)
                },
            },
            y: {
                ticks: {
                    font: {
                        size: 10, // tamanho da fonte das descrições no eixo Y
                    },
                    color: "#374151",
                },
            },
        },
    };


    // Dados para gráfico de barras
    const barData = {
        labels: Object.keys(laudos),
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 5, // tamanho da fonte da legenda
                    },
                },
            },
        },
        datasets: [
            {
                label: "Pacientes por Laudo",
                data: Object.values(laudos),
                backgroundColor: "#37A2EB",


            },
        ],
    };
    // Dados para gráfico de pizza
    const pieData = {
        labels: Object.keys(laudos),
        datasets: [
            {
                data: Object.values(laudos),
                backgroundColor: getColors(Object.keys(laudos)),

            },
        ],
    };


    const barDataTratamentos = {
        labels: Object.keys(tratamentos),
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 8, // tamanho da fonte da legenda
                    },
                },
            },
        },
        datasets: [
            {
                label: "Pacientes por Tratamento",
                font: { size: 14 },
                data: Object.values(tratamentos),
                backgroundColor: "#008000",
            },
        ],
    };

    // Dados para gráfico de pizza de tratamentos
    const pieDataTratamentos = {
        labels: Object.keys(tratamentos),
        datasets: [
            {
                data: Object.values(tratamentos),
                backgroundColor: getColors(Object.keys(tratamentos)),
                size: 10
            },
        ],
    };




    return (
        <div className="p-4 bg-white z-90" >
            <h2 className="text-xl font-bold font-[Poppins]">Dashboard</h2>
            <div className="flex-1 overflow-y-auto mt-4 max-h-[80vh]">

                {/* Card de total de pacientes */}
                <div className="bg-blue-500 text-white rounded-lg shadow-md p-4 mb-6 w-45 sm:w-64">
                    <h3 className="text-md font-semibold">Total de Pacientes</h3>
                    <p className="text-3xl font-bold">{totalPacientes}</p>
                </div>

                <div className="flex flex-col md:flex-row gap-x-10 mb-10">

                    <div className="bg-white rounded-lg shadow-md border border-blue-300 mb-6 w-full h-80 p-2 mx-auto">
                        <Bar data={barData} options={barOptions} />
                    </div>

                    {/* Gráfico de pizza */}
                    <div className="bg-white rounded-lg shadow-md border border-blue-300 w-full max-w-md h-80 mx-auto text-center">
                        <h3 className="text-lg font-semibold mb-4">Distribuição de Laudos</h3>
                        <div className="w-full h-60 flex items-center justify-center">
                            <Pie data={pieData} />
                        </div>
                    </div>



                </div>
                <div className="flex flex-col md:flex-row gap-x-10 ">
                    <div className="bg-white rounded-lg shadow-md border border-green-400 mb-6 w-full h-80  p-2 mx-auto">
                        <Bar data={barDataTratamentos} options={barOptions} />
                    </div>

                    {/* Gráfico de pizza */}
                    <div className="bg-white rounded-lg shadow-md border border-green-400 w-full max-w-md h-80 mx-auto text-center">
                        <h3 className="text-lg font-semibold ">Distribuição de Tratamentos</h3>
                        <div className="w-full h-70 items-start justify-center flex ">
                            <Pie data={pieDataTratamentos} />
                        </div>
                    </div>



                </div>
            </div>
        </div >
    );
};

