import { useQuery } from "@tanstack/react-query";

export const useIsAuthenticated = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["authUser"],
    staleTime: Infinity,
    refetchOnWindowFocus: false
  });

  const hasToken = localStorage.getItem("accessToken");
  
  return {
    isAuthenticated: Boolean(user || hasToken),
    isLoading,
    user
  };
};

export default useIsAuthenticated;