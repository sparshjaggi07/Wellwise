import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import PatientRegistration from "../../../../build/contracts/PatientRegistration.json";

function PatientForm({setInitialRegistration}) {
    const [patientData, setPatientData] = useState({
        cryptoWalletAddress: '',
        fullName: '',
        healthId: '',
        email: '',
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
                    console.log(connectedAccount);

                    const networkId = await web3Instance.eth.net.getId();
                    const deployedNetwork = PatientRegistration.networks[networkId];

                    if (deployedNetwork) {
                        const contractInstance = new web3Instance.eth.Contract(
                            PatientRegistration.abi,
                            deployedNetwork.address
                        );
                        setContract(contractInstance);
                        console.log("Patient Smart contract loaded successfully.");
                        setInitialRegistration(true);
                    } else {
                        console.error("Patient Smart contract not deployed on the detected network.");
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
        try {
            console.log("Starting patient registration process...");
    
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const contract = new web3.eth.Contract(
                PatientRegistration.abi,
                PatientRegistration.networks[networkId].address
            );
            console.log("Contract initialized with address:", PatientRegistration.networks[networkId].address);
            
            console.log("Checking if patient is already registered...");
            const isRegPatient = await contract.methods
                .isRegisteredPatient(patientData.healthId)
                .call();
                console.log("Is Registered Patient:", isRegPatient);
                
                if (isRegPatient) {
                    alert("Patient already exists");
                    console.log("Patient already exists, aborting registration");
                    return;
                }
                
                console.log("Registering patient with the following details:", patientData);
                
                await contract.methods
                    .registerPatientCredentials(
                        patientData.healthId,
                        patientData.fullName,
                        patientData.email,
                        patientData.password,
                        connectedAccount
                    )
                    .send({ from: connectedAccount });
                
                console.log("Patient registration successful");
                navigate(`/register/patient/profile/${patientData.healthId}`, { replace: true });
                setInitialRegistration(true);
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred while registering the Patient.");
            console.log("Registration error:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <>
            <form onSubmit={handlePatientSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        name="cryptoWalletAddress"
                        value={connectedAccount}
                        onChange={handleInputChange}
                        placeholder="Crypto Wallet Address"
                        disabled
                        className="w-full px-6 py-3 text-center rounded-full text-sm bg-gray-200 border border-[#e6eaf0] text-gray-500 placeholder-gray-500 focus:ring-1 focus:ring-gray-700 focus:outline-none cursor-not-allowed"
                    />
                </div>
            
                <div>
                    <input
                        type="text"
                        name="fullName"
                        value={patientData.fullName}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className="w-full px-6 py-3 rounded-full text-sm bg-white border border-[#e6eaf0] text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-gray-700 focus:outline-none"
                    />
                </div>
            
                <div>
                    <input
                        type="text"
                        name="healthId"
                        value={patientData.healthId}
                        onChange={handleInputChange}
                        placeholder="National Health ID (ABHA ID)"
                        className="w-full px-6 py-3 rounded-full text-sm bg-white border border-[#e6eaf0] text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-gray-700 focus:outline-none"
                    />
                </div>
            
                <div>
                    <input
                        type="email"
                        name="email"
                        value={patientData.email}
                        onChange={handleInputChange}
                        placeholder="Email address"
                        className="w-full px-6 py-3 rounded-full text-sm bg-white border border-[#e6eaf0] text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-gray-700 focus:outline-none"
                    />
                </div>
            
                <div>
                    <input
                        type="password"
                        name="password"
                        value={patientData.password}
                        onChange={handleInputChange}
                        placeholder="Create password"
                        className="w-full px-6 py-3 rounded-full text-sm bg-white border border-[#e6eaf0] text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-gray-700 focus:outline-none"
                    />
                </div>

                <div>
                    <button type="submit" className="w-full mt-5 bg-[#1a3235] text-white px-4 py-3 rounded-full font-albulaBold hover:bg-[#2d555b] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all ease-in-out duration-200" >
                        <div className="flex items-center justify-center">
                            <span> Register </span>
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                </div>
            </form>
        </>
    )
};

export default PatientForm;