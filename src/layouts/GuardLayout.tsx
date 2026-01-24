import { useQuery } from "@tanstack/react-query"
import { api } from "../helpers/axios"
import Loading from "../components/Loading"
import { Navigate, Outlet } from "react-router"
import useUserStore from "../store/user"

export default function GuardLayout() {
  const setUser = useUserStore((state) => state.setUser)
  const { isLoading, error, data } = useQuery({
    queryKey: ['profile_guard_layout'],
    queryFn: () => {
      return api.get("/ms_user/profile")
    },
    staleTime: 1000 * 60 * 5,
    retry: false
  })

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Navigate to={"/login"} replace />
  }

  if (data) {
    const { data: user } = data.data
    setUser(user)
  }
  return (<Outlet />)
}