import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    VStack,
    FormControl,
    FormLabel,
    // FormErrorMessage,
    // FormHelperText,
    Input,
    InputRightElement,
    InputGroup,
    Button,
    useToast,
} from "@chakra-ui/react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    function handleSubmit() {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: "Please fill in all required fields!",
                status: "warning",
                duration: 9000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        } else {
            try {
                fetch("/api/user/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then((userInfo) => {
                        toast({
                            title: "Registration Successful",
                            status: "success",
                            duration: 9000,
                            isClosable: true,
                            position: "bottom",
                        });

                        sessionStorage.setItem(
                            "userInfo",
                            JSON.stringify(userInfo)
                        );
                        setLoading(false);
                        navigate("/chats");
                    });
            } catch (error) {
                toast({
                    title: "An error occured!",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                    position: "bottom",
                });
                setLoading(false);
            }
        }
    }

    return (
        <VStack>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder="Enter Your Email"
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        pr="4.5rem"
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Enter Your Password"
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                    <InputRightElement width="4.5rem">
                        <Button
                            height="1.75rem"
                            size="sm"
                            onClick={() => {
                                setPasswordVisible(!passwordVisible);
                            }}
                        >
                            {passwordVisible ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                colorScheme="whatsapp"
                width="100%"
                margin="30px !important"
                onClick={handleSubmit}
            >
                Login
            </Button>
        </VStack>
    );
}

export default Login;
