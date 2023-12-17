import axios from "axios";
import {useState} from "react";
import {toast} from "react-toastify";
import Cookies from "js-cookie";

export function useRequest(url, method, token, loaderInitState) {
    const CancelToken = axios.CancelToken;
    const [loading, setLoading] = useState(loaderInitState || false);
    const [cancel, setCancel] = useState();
    const response = async (data, params) => {
        setLoading(true);
        let finalUrl = url;
        if (params) {
            for (let param of params) {
                finalUrl = finalUrl.replace(":" + param.name, param.value);
            }
        }

        return axios({
            method,
            url: finalUrl,
            data,
            params: method.toLowerCase() === "get" ? data : undefined,
            cancelToken: new CancelToken(function executor(c) {
                setCancel(() => c);
            }),
            headers: Cookies.get("gam-token") ? {
                Authorization:
                    "Bearer " + Cookies.get("gam-token") || token || undefined,
            } : {},
        })
            .then((r) => {

                setLoading(false);
                return r.data;
            })
            .catch((e) => {
                if (e.code === "ERR_NETWORK") {
                    toast.error("Network lost!");
                }
                if (e.code === "ERR_CANCELED") {
                    console.log(e.code);
                } else {
                    setLoading(false);

                    if (
                        (e?.response?.status === 401 ||
                            e?.response?.status === 403) && /// must be unified.
                        Cookies.get("gam-token")
                    ) {
                        Cookies.remove("gam-token")
                        window.location.reload();
                    } else {
                        throw e;
                    }
                }
            });
    };

    return [response, loading, cancel];
}
