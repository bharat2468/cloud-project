import { useState, useEffect } from "react";

const ThemeSwitcher = () => {
    const [theme, setTheme] = useState("dark");

    // Popular themes that work well
    const themes = [
        "light",
        "dark",
    ];

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "dark";
        setTheme(savedTheme);
        // Make sure we're setting it on the html element
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    const handleThemeChange = (newTheme: string) => {
        console.log("Changing theme from", theme, "to:", newTheme);

        // Update state
        setTheme(newTheme);

        // Update localStorage
        localStorage.setItem("theme", newTheme);

        // Update HTML element - this is the key part for DaisyUI
        document.documentElement.setAttribute("data-theme", newTheme);

        console.log(
            "Theme changed! Current data-theme:",
            document.documentElement.getAttribute("data-theme")
        );
    };

    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
                title={`Current theme: ${theme}`}
            >
                <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            
            <ul tabIndex={0} className="dropdown-content z-[50] menu p-2 shadow-2xl bg-base-300 rounded-box w-52 max-h-96 overflow-y-auto">
                <li className="menu-title">
                    <span>Choose Theme</span>
                </li>
                {themes.map((themeName) => (
                    <li key={themeName}>
                        <button
                            className={`justify-between ${
                                theme === themeName ? "active" : ""
                            }`}
                            onClick={() => handleThemeChange(themeName)}
                        >
                            <span className="capitalize">{themeName}</span>
                        
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ThemeSwitcher;
