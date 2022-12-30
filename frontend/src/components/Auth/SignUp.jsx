import React, { useState } from "react";

import {
    VStack,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    InputRightElement,
    InputGroup,
    Button,
} from "@chakra-ui/react";

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [profilePic, setProfilePic] = useState("");

    function postDetails(pic) {}
    function handleSubmit() {}

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
                onClick={handleSubmit}
            >
                Sign Up
            </Button>
        </VStack>
    );
}

export default SignUp;
