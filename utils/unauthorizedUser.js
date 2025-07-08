import { toast } from "react-toastify"

export const unAuthorizedUser = (status) => {
    if (status === 401) {
        toast("Unauthorized user, Please login", {
            type: "error"
        })
    }
}