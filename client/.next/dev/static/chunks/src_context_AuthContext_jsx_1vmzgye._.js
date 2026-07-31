(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/context/AuthContext.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const AuthProvider = ({ children })=>{
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // Check if user credentials are saved in localStorage
            const savedUser = localStorage.getItem("blink_user");
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
            setLoading(false);
        }
    }["AuthProvider.useEffect"], []);
    const login = async (email, password)=>{
        setLoading(true);
        // Simulate API request delay
        await new Promise((resolve)=>setTimeout(resolve, 800));
        const mockUser = {
            id: "usr-1",
            name: "Vartika Sharma",
            username: "vartikasharma",
            email: email,
            bio: "Creating beautiful pixels and code.",
            avatar: "",
            stats: {
                friends: 42,
                cardsCreated: 12,
                messages: 1337
            }
        };
        setUser(mockUser);
        localStorage.setItem("blink_user", JSON.stringify(mockUser));
        setLoading(false);
        return mockUser;
    };
    const signup = async (name, username, email, password)=>{
        setLoading(true);
        await new Promise((resolve)=>setTimeout(resolve, 800));
        const mockUser = {
            id: "usr-" + Math.floor(Math.random() * 1000),
            name,
            username,
            email,
            bio: "Hey there! I am using Blink.",
            avatar: "",
            stats: {
                friends: 0,
                cardsCreated: 0,
                messages: 0
            }
        };
        setUser(mockUser);
        localStorage.setItem("blink_user", JSON.stringify(mockUser));
        setLoading(false);
        return mockUser;
    };
    const logout = ()=>{
        setUser(null);
        localStorage.removeItem("blink_user");
    };
    const updateUserProfile = (updatedData)=>{
        const updatedUser = {
            ...user,
            ...updatedData
        };
        setUser(updatedUser);
        localStorage.setItem("blink_user", JSON.stringify(updatedUser));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isAuthenticated: !!user,
            loading,
            login,
            signup,
            logout,
            updateUserProfile
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AuthContext.jsx",
        lineNumber: 81,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthProvider, "NiO5z6JIqzX62LS5UWDgIqbZYyY=");
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_context_AuthContext_jsx_1vmzgye._.js.map