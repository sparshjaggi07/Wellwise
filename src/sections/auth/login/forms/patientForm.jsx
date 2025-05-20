import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import PatientRegistration from "../../../../build/contracts/PatientRegistration.json";

function PatientLogin({ setIsRegistered, setPatientDetails }) {
    const [patientCredentials, setPatientCredentials] = useState({
        healthID: '',
        password: '',
    });

    const navigate = useNavigate();
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);

    const [connectedAccount, setConnectedAccount] = useState("");

    useEffect(() => {
        if (connectedAccount) {
            console.log("Connected account:", connectedAccount.toString());
        }
    }, [connectedAccount]);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                    setWeb3(web3Instance);

                    const accounts = await web3Instance.eth.getAccounts();
                    setConnectedAccount(accounts[0]);

                    const networkId = await web3Instance.eth.net.getId();
                    const deployedNetwork = PatientRegistration.networks[networkId];

                    if (deployedNetwork) {
                        const contractInstance = new web3Instance.eth.Contract(
                            PatientRegistration.abi,
                            deployedNetwork.address
                        );
                        setContract(contractInstance);
                        console.log("Smart contract loaded successfully.");
                    } else {
                        console.error("Smart contract not deployed on the detected network.");
                    }
                } catch (error) {
                    console.error("Error accessing MetaMask or contract:", error);
                }
            } else {
                alert("MetaMask not detected. Please install the MetaMask extension.");
                console.error("MetaMask not detected. Please install the MetaMask extension.");
            }
        };

        init();
    }, []);

    const handlePatientSubmit = async (e) => {
        e.preventDefault();

        const patientHealthID = patientCredentials.healthID;
        const patientPassword = patientCredentials.password;

        try {
            console.log(`Starting login for Health ID: ${patientHealthID}`);

            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = PatientRegistration.networks[networkId];
            const contract = new web3.eth.Contract(
                PatientRegistration.abi,
                deployedNetwork && deployedNetwork.address
            );

            console.log("Checking if patient is registered...");
            const isRegisteredResult = await contract.methods
                .isRegisteredPatient(patientHealthID)
                .call();
            console.log("Is Registered:", isRegisteredResult);

            setIsRegistered(isRegisteredResult);

            if (isRegisteredResult) {
                console.log("Patient is registered, validating password...");
                const isValidPassword = await contract.methods
                    .validatePassword(patientHealthID, patientPassword)
                    .call();
                console.log("Is Valid Password:", isValidPassword);

                if (isValidPassword) {
                    const fetchPatientDetails = await contract.methods
                        .getPatientCredentials(patientHealthID)
                        .call();
                    console.log("Patient details:", fetchPatientDetails);
                    console.log('Login successful');
                    console.log('Redirecting...')
                    navigate("/patient/" + patientHealthID + "/home");
                } else {
                    alert("Incorrect password");
                    console.log("Password validation failed");
                }
            } else {
                alert("Patient not registered");
                console.log("Patient not registered");
            }
        } catch (error) {
            console.error("Error during login process:", error);
            alert("An error occurred while checking registration.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <form onSubmit={handlePatientSubmit} className="space-y-4">
            <div className="relative">
                <input
                    type="text"
                    name="healthID"
                    value={patientCredentials.healthID}
                    onChange={handleInputChange}
                    placeholder="National Health ID (ABHA ID)"
                    className="w-full px-7 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                />
            </div>

            <div className="relative">
                <input
                    type="password"
                    name="password"
                    value={patientCredentials.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="w-full px-7 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                />
            </div>

            <div>
                <button type="submit" className="group w-full mt-5 bg-[#1a3235] text-white px-4 py-3 rounded-full font-albulaBold hover:bg-[#2d555b] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all ease-in-out duration-200">
                    <div className="flex items-center justify-center relative">
                        <span className="absolute"> Login </span>
                        <svg className="w-5 h-5 ml-16 relative transform transition-all duration-200 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>
            </div>
        </form>
    );
}

export default PatientLogin;