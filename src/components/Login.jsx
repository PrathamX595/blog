import { useState } from "react"
import React from 'react'
import authService from '../appwrite/auth'
import { Link, useNavigate } from "react-router-dom"
import {login as authLogin} from '../store/authSlice'
import {Button, Input, Select, Logo} from "./index"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const {register, handleSubmit} = useForm();

    const login = async(data)=>{
        try {
            setError("");
            const session = await authService.login(data);
            if (session) {
                const userData = await authService.getCurrentUser();
                if (userData) {
                    dispatch(authLogin(userData));
                }
            }
            navigate("/");
        } catch (error) {
            setError(error.message)
        }
    }
  return (
    <div
    className='flex items-center justify-center w-full'
    >
        <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
            <div className="mb-2 flex justify-center">
                <span className="inline-block w-full max-w-[100px]">
                    <Logo width="100%" />
                </span>
            </div>
            <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
            <p className="mt-2 text-center text-base text-black/60">
                Don&apos;t have any account?&nbsp;
                <Link
                    to="/signup"
                    className="font-medium text-primary transition-all duration-200 hover:underline"
                >
                    Sign Up
                </Link>
            </p>
            <form onSubmit={handleSubmit(login)} className="mt-8">
                <div className="space-y-5">
                    <Input
                        lable = "Email: "
                        placeholder = "enter your Email"
                        type = "email"
                        {...register("email", {required: true,
                            validate: {
                                matchPattern:(value)=>{
                                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be valid"
                                },
                            }
                        })}
                    />
                    <Input
                        lable = "Password: "
                        placeholder = "enter your Password"
                        type = "password"
                        {...register("password", {required: true,
                            validate: {
                                matchPattern:(value)=>{
                                    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value) || "enter a valid password"
                                },
                            }
                        })}
                    />
                    <Button
                        type="submit"
                        className="w-full "
                    >Login</Button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login