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

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [profilePic, setProfilePic] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    function postDetails(toUpload) {
        setLoading(true);
        if (toUpload === undefined) {
            toast({
                title: "Please Select an Image",
                status: "warning",
                duration: 9000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        if (toUpload.type === "image/jpeg" || toUpload.type === "image/png") {
            const data = new FormData();
            data.append("file", toUpload);
            data.append("upload_preset", "Whatsapp_Clone");
            data.append("cloud_name", "df8cnxn1u");
            fetch("https://api.cloudinary.com/v1_1/df8cnxn1u/image/upload", {
                method: "POST",
                body: data,
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    setProfilePic(data.url.toString());
                    setLoading(false);
                });
        } else {
            toast({
                title: "Please Select an Image",
                status: "warning",
                duration: 9000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    function handleSubmit() {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: "Please fill in all required fields!",
                status: "warning",
                duration: 9000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        } else if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match!",
                status: "warning",
                duration: 9000,
                isClosable: true,
                position: "bottom",
            });
            return;
        } else {
            try {
                fetch("/api/user/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password,
                        picture: profilePic,
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
            <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder="Enter Your Name"
                    onChange={(event) => {
                        setName(event.target.value);
                    }}
                />
            </FormControl>

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

            <FormControl id="confirmPassword" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        pr="4.5rem"
                        type={confirmPasswordVisible ? "text" : "password"}
                        placeholder="Enter Your Password"
                        onChange={(event) => {
                            setConfirmPassword(event.target.value);
                        }}
                    />
                    <InputRightElement width="4.5rem">
                        <Button
                            h="1.75rem"
                            size="sm"
                            onClick={() => {
                                setConfirmPasswordVisible(
                                    !confirmPasswordVisible
                                );
                            }}
                        >
                            {confirmPasswordVisible ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id="profilePicture">
                <FormLabel>Upload Your Profile Picture</FormLabel>
                <Input
                    type="file"
                    paddingStart="4px"
                    paddingTop="4px"
                    accept="image/"
                    onChange={(event) => {
                        postDetails(event.target.files[0]);
                    }}
                />
            </FormControl>

            <Button
                colorScheme="whatsapp"
                width="100%"
                margin="30px !important"
                isLoading={loading}
                onClick={handleSubmit}
            >
                Sign Up
            </Button>
        </VStack>
    );
}

export default SignUp;
