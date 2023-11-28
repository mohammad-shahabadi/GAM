import {useState} from "react";
import Input from "@/components/global/Input";
import { Lock, UserOctagon } from "iconsax-react";
import {ErrorText, InputCaption} from "@/components/global/TinyComponents";
import Button from "@/components/global/Button";

export default function Login({texts,authenticate,loading}) {

    const [loginForm, setLoginForm] = useState({
        stdNum: "",
        password: "",
    });
    const [loginFormErr, setLoginFormErr] = useState({
        stdNum: "",
        password: "",
    });
    const loginValidation = () => {
        let hasErr = false;
        let errTemp = loginFormErr;

        if (loginForm.stdNum === "") {
            errTemp = {
                ...errTemp,
                stdNum: texts('studentNumberError'),
            };
            hasErr = true;
        }

        if (loginForm.password === "") {
            errTemp = {
                ...errTemp,
                password: texts('passwordError'),
            };
            hasErr = true;
        }

        if (hasErr) {
            setLoginFormErr(errTemp);
            return false;
        }
        authenticate(loginForm)
    };
    return(
        <div className={"h-screen flex justify-center items-center bg-[var(--background)] text-white"}>
            <div className={"p-4 w-full  md:w-1/2  "}>
                <div className={"font-bold text-center text-lg md:text-2xl text-[var(--textMain)]"}>
                    {texts('title')}
                </div>
                <InputCaption
                    caption={texts('studentNumber')}
                    error={loginFormErr.stdNum}
                />
                <Input
                    type="text"
                    icon={<UserOctagon />}
                    placeholder=""
                    error={loginFormErr.stdNum}
                    value={loginForm.stdNum}
                    onClick={() =>
                        setLoginFormErr({ ...loginFormErr, stdNum: "" })
                    }
                    onChange={(e) =>
                        setLoginForm({ ...loginForm, stdNum: e.target.value })
                    }
                />
                {loginFormErr.stdNum && <ErrorText error={loginFormErr.stdNum} />}

                <InputCaption
                    caption={texts('password')}
                    error={loginFormErr.password}
                />
                <Input
                    type="password"
                    icon={<Lock />}
                    error={loginFormErr.password}
                    value={loginForm.password}
                    onClick={() =>
                        setLoginFormErr({ ...loginFormErr, password: "" })
                    }
                    onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    onEnter={loginValidation}
                />
                {loginFormErr.password && <ErrorText error={loginFormErr.password} />}
                <Button
                    type="primary"
                    caption={texts('login')}
                    className="mt-8 md:mt-12"
                    onClick={loginValidation}
                    loading={loading}
                />
            </div>
        </div>
    )
}

