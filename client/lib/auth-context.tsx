"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { gql, useApolloClient } from "@apollo/client";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// ─── State & Reducer ─────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

type AuthAction =
  | { type: "INIT_NO_TOKEN" }
  | { type: "SET_TOKEN"; token: string }
  | { type: "LOGIN_SUCCESS"; user: User; token: string }
  | { type: "AUTH_FAILURE" }
  | { type: "LOADED" }
  | { type: "LOGOUT" };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "INIT_NO_TOKEN":
      return { ...state, isLoading: false };
    case "SET_TOKEN":
      return { ...state, token: action.token };
    case "LOGIN_SUCCESS":
      return { user: action.user, token: action.token, isLoading: false };
    case "AUTH_FAILURE":
      return { user: null, token: null, isLoading: false };
    case "LOADED":
      return { ...state, isLoading: false };
    case "LOGOUT":
      return { user: null, token: null, isLoading: false };
    default:
      return state;
  }
}

// ─── GraphQL ─────────────────────────────────────────────────────────────────

const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      role
    }
  }
`;

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const client = useApolloClient();
  const router = useRouter();

  // On mount: read persisted token and validate it via the `me` query
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      dispatch({ type: "INIT_NO_TOKEN" });
      return;
    }

    dispatch({ type: "SET_TOKEN", token: storedToken });

    client
      .query({ query: ME_QUERY, fetchPolicy: "network-only" })
      .then(({ data }) => {
        if (data?.me) {
          dispatch({
            type: "LOGIN_SUCCESS",
            user: data.me,
            token: storedToken,
          });
        } else {
          localStorage.removeItem("token");
          dispatch({ type: "AUTH_FAILURE" });
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        dispatch({ type: "AUTH_FAILURE" });
      });
  }, [client]);

  const login = useCallback(
    (newToken: string, newUser: User) => {
      localStorage.setItem("token", newToken);
      dispatch({ type: "LOGIN_SUCCESS", user: newUser, token: newToken });
      router.push("/dashboard");
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    client.clearStore();
    router.push("/login");
  }, [client, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      token: state.token,
      isAuthenticated: !!state.token && !!state.user,
      isLoading: state.isLoading,
      login,
      logout,
    }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
