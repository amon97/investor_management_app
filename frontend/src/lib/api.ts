import { getAuth } from "firebase/auth";
import { auth } from "./firebase";

export const getApiBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

/**
 * 認証トークン付きのAuthorizationヘッダーを返す。
 * 未ログイン時は空オブジェクトを返す。
 */
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
    try {
        if (!auth) return {};
        const user = auth.currentUser;
        if (!user) return {};
        const idToken = await user.getIdToken();
        return { Authorization: `Bearer ${idToken}` };
    } catch {
        return {};
    }
};

/**
 * 認証トークン付きfetchのラッパー
 */
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const authHeaders = await getAuthHeaders();
    return fetch(url, {
        ...options,
        headers: {
            ...authHeaders,
            ...(options.headers || {}),
        },
    });
};
