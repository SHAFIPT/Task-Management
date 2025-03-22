import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../service/projectService";
import { toast } from "react-toastify";
import { useEffect } from "react";

const useUser = () => {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers
  });
  
  useEffect(() => {
    if (query.isSuccess) {
      console.log('This is the data:', query.data);
      toast.success("Users fetched successfully!", { autoClose: 2000 });
    }
    if (query.isError) {
      console.error("Error fetching users:", query.error);
      toast.error("Failed to fetch users. Please try again.", { autoClose: 3000 });
    }
  }, [query.isSuccess, query.isError, query.data, query.error]);
  
  return query;
};

export default useUser;