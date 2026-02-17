import { createContext, useContext, type ReactNode } from "react";

type StyleContextType = {
    cores: {
        primaryBg: string;
        secondaryBg: string;
        dangerBg: string;
        warnBg: string;
        gradientBlue: string;
        gradientRed: string;
        gradientAdd: string;
        primaryText: string;
        secondaryText: string;
        dangerText: string;
        warnText: string;
    };
};

const StyleContext = createContext<StyleContextType | null>(null);

export const StyleProvider = ({ children }: { children: ReactNode }) => {
    const cores = {
        primaryBg: "bg-blue-500",
        secondaryBg: "bg-red-600",
        dangerBg: "bg-red-500",
        warnBg: "bg-yellow-500",
        gradientBlue: "bg-gradient-to-l from-blue-600 to-sky-500",
        gradientRed: "bg-gradient-to-r from-red-600 to-red-500",
        gradientAdd: "bg-linear-to-r from-emerald-500 to-green-500",

        // cores para textos
        primaryText: "text-blue-500",
        secondaryText: "text-red-600",
        dangerText: "text-red-500",
        warnText: "text-yellow-500",

    };

    return (
        <StyleContext.Provider value={{ cores }}>
            {children}
        </StyleContext.Provider>
    );
};

export const useStyle = (): StyleContextType => {
    const context = useContext(StyleContext);
    if (!context) {
        throw new Error("useStyle must be used within a StyleProvider");
    }
    return context;
};