import React from "react";
import {
    Container,
    Box,
    Text,
    Tab,
    Tabs,
    TabList,
    TabPanel,
    TabPanels,
} from "@chakra-ui/react";

import Login from "../Auth/Login";
import SignUp from "../Auth/SignUp";

function Home() {
    return (
        <Container maxW="xl" centerContent>
            <Box
                d="flex"
                justifyContent="center"
                p={3}
                bg="white"
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text
                    textAlign="center"
                    fontSize="4xl"
                    fontFamily="Inter"
                    fontWeight="400"
                    color="Gray"
                >
                    WhatDat
                </Text>
            </Box>
            <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
                <Tabs variant="soft-rounded" colorScheme="whatsapp">
                    <TabList mb="1em">
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
}

export default Home;
